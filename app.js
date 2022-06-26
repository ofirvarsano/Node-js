const express = require('express');
const PORT = 3000; 

const translate = require('@vitalets/google-translate-api');
//const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');
//const Message = require('../models/Message');
const bodyParser = require('body-parser');
require('dotenv/config');
const app = express();

//app.use(bodyParser.json());
app.use(express.json());

//Import Routes
//const messagesRoute = require('./routes/messages');

//app.use('/messages', messagesRoute);


const uri = "mongodb+srv://ofir123:ofir123@cluster0.jji7m.mongodb.net/?retryWrites=true&w=majority";
 
const client = new MongoClient(uri);
 
try {
    // Connect to the MongoDB cluster
     client.connect();

    // Make the appropriate DB calls
    //await  listDatabases(client);
/*
    await createListing(client,
        {
            messagebody: "First message",
            author: "Ofir",
            fr: "",
            es: "",
            he: ""
        }
    );
    */

} catch (e) {
    console.error(e);
} finally {
     client.close();
}

/*
async function main(){

    const uri = "mongodb+srv://ofir123:ofir123@cluster0.jji7m.mongodb.net/?retryWrites=true&w=majority";
 
const client = new MongoClient(uri);
 
try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    //await  listDatabases(client);

    await createListing(client,
        {
            messagebody: "First message",
            author: "Ofir",
            fr: "",
            es: "",
            he: ""
        }
    );
    

} catch (e) {
    console.error(e);
} finally {
    await client.close();
}
}

main().catch(console.error);
*/
//LIST ALL DBS
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:"); 
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

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
            //date = new Date(result.last_review).toDateString();

            console.log(result);
            //console.log(`${i + 1}. author: ${result.author}`);
            //console.log(`   _id: ${result._id}`);
            //console.log(`   messageBody: ${result.messagebody}`);
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
            //console.log(`${i + 1}. author: ${result.author}`);
            //console.log(`   _id: ${result._id}`);
            //console.log(`   messageBody: ${result.messagebody}`);
            //console.log(`   fr: ${result.fr}`);
        });
    } else {
        console.log(`No listings found`);
    }return results;
}

//UPDATE FR
async function updateListingByID(client, idOfListing, updatedListing) {
    const result = await client.db("messages").collection("mess")
                        .updateOne({ _id: idOfListing }, { $set: updatedListing });
}

//DELETE ONE
async function deleteListingByID(client, id) {
    const result = await client.db("messages").collection("mess")
            .deleteOne({ _id: id });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}
//app.use( express.json() )

app.get('/', (req, res) => {
    res.status(200).send('We are home');
});


//GETS BACK ALL MESSAGE BY AUTHOR
app.get('/messages/author/:author', async (req, res) => {
    var results = await findMessagesByAuthor(client, req.params.author);
    let text = [];
    results.forEach((result) => {
        text.push( { id:result._id, messagebody:result.messagebody});
    });
    
    res.send(text);
});

//GETS BACK ONE MESSAGE
/*
app.get('/messages/author/:author', async (req, res) => {
    //res.send('We are messages');
    var result = await findOneListingByAuthor(client, req.params.author);
    let text = [];
    text.push( { id:result._id, messagebody:result.messagebody});
    res.send(text);
});
*/
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
        res.status(201).json();
    }
    else {
        res.send("Empty message not allowed !");
    }
});



//GETS TRANSLATED MESSAGES 
app.get('/messages/translate/:language', async (req, res) => {
    /*
    var results = await findAllMessages(client);
    results.forEach((result) => {
        if( result.he == "")
        {
            const translated = translateString(result.messagebody,
     req.params.language, result._id, result.author);
        }
    });
    */
    const translated = translateString(req.params.language);
        //text.push( { id:result._id, messagebody:result.req.params.language});
        var translatedResults = await findAllMessages(client);
        let text = [];
        translatedResults.forEach((re) => {
        text.push( { id:re._id, author: re.author, messagebody:re.he});
    });
    
    res.send(text);

    /*
    const translated = await translateString('hello my name is ofir',
     req.params.language);
     const resultt = await translated;
    console.log(resultt);*/
});

//var t = translateString('hello', 'fr');
//console.log(t);

async function translateString(translateTo)
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

/*
app.get('/posts', (req, res) => {
    res.status(200).send('We are on posts');
});

app.get('/messages', (req, res) => {
    res.status(200).json(mess);
});
*/
/*
app.post('/messages', async (req, res) => {
    //var newMess = JSON.parse(req.body);
    await createListing(client,
        {
            messagebody: req.body.messagebody,
            author: req.body.author,
            fr: "",
            es: "",
            he: ""
        }
    );
    res.status(201).json();
});
*/



// connect to DB
//mongoose.set('bufferCommands', false); 
/*
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true},
    //useFindAndModify: false,
    //useUnifiedTopology: true },
     () => console.log('connected to DB'));
*/
/*
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ofir123:<password>@cluster0.jji7m.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

     const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
*/

/*
app.listen(
    PORT,
    () => console.log('its alive on http//localhost:${PORT}')
)
*/