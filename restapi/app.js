const express = require('express');
const PORT = 3000; 

const translate = require('@vitalets/google-translate-api');
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv/config');
const app = express();

//app.use(bodyParser.json());
app.use(express.json());

const uri = process.env.DB_CONNECTION;
  
const client = new MongoClient(uri);
 
try {
    // Connect to the MongoDB cluster
     client.connect();

} catch (e) {
    console.error(e);
} finally {
     client.close();
}

//INSERT NEW MESSAGE TO DB
async function createListing(client, newListing){
    const result = await client.db("messages").collection("mess").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

//FIND ONE MESSAGE BY AUTHOR
async function findOneListingByAuthor(client, nameOfListing) {
    const result = await client.db("messages").collection("mess").findOne({ author: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
        return result;
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

//FIND MESSAGES BY AUTHOR
async function findMessagesByAuthor(client, authorName) {
    const cursor = client.db("messages").collection("mess").find(
        { author: authorName });

    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`Found author name : ${authorName} :`);
        results.forEach((result, i) => {


            console.log(result);
        });
    } else {
        console.log(`No listings found with author name ${authorName} `);
    }return results;
}



//FIND ALL MESSAGES
async function findAllMessages(client) {
    const cursor = client.db("messages").collection("mess").find();

    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`Found`);
        results.forEach((result, i) => {
            console.log(result);
        });
    } else {
        console.log(`No listings found`);
    }return results;
}

//UPDATE ONE
async function updateListingByID(client, idOfListing, updatedListing) {
    const result = await client.db("messages").collection("mess")
                        .updateOne({ _id: idOfListing }, { $set: updatedListing });
}

//DELETE ONE MESSAGE
async function deleteListingByID(client, id) {
    const result = await client.db("messages").collection("mess")
            .deleteOne({ _id: id });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

//GETS BACK ALL MESSAGE BY AUTHOR
app.get('/messages/author/:author', async (req, res) => {
    var results = await findMessagesByAuthor(client, req.params.author);
    let text = [];
    results.forEach((result) => {
        text.push( { id:result._id, messagebody:result.messagebody});
    });
    
    res.send(text);
});

//GETS BACK ALL THE MESSAGES
app.get('/messages', async (req, res) => {
    var results = await findAllMessages(client);
    let text = [];
    results.forEach((result) => {
        text.push( { id:result._id, messagebody:result.messagebody});
    });
    res.send(text);
});

//POST A MESSAGE
app.post('/messages', async (req, res) => {
    if (req.body.messagebody != "") {
        await createListing(client,
            {
                messagebody: req.body.messagebody,
                author: req.body.author,
                he: ""
            }
        );
        res.status(200).json();
    }
    else {
        res.send("Empty message not allowed !");
    }
});

//GETS TRANSLATED MESSAGES 
app.get('/messages/translate/:language', async (req, res) => {
    const translated = translateMessages(req.params.language);
       
        var translatedResults = await findAllMessages(client);
        let text = [];
        translatedResults.forEach((re) => {
        text.push( { id:re._id, author: re.author, messagebody:re.he});
    });
    
    res.send(text);
});

//TRANSLATE ALL MESSAGES WHICH HAVENT BEEN TRANSLATED YET
async function translateMessages(translateTo)
{
    var results = await findAllMessages(client);
    results.forEach((result) => {
        if( result.he == "")
        {
            let str = result.messagebody;
            let author = result.author;
            let data = translate(result.messagebody, {from: 'en', to: translateTo}).then(res => {
                console.log(res.text);
                deleteListingByID(client, result._id);
                createListing(client,
                    {
                        messagebody: str,
                        author: author,
                        he: res.text
                    }
                );
                return res.text;
            }).catch(err => {
                return err;
            })
        }
    });
    
}


app.listen(PORT, () => {
    console.log("Server is running at port 3000");
  });
