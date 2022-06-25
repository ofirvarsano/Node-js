const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const translate = require('@vitalets/google-translate-api');
//const { translate } = require('free-translate');

var mess = ["mess 1", "mess 2", "mess 3"];
let messagesArray = [];
let m = {
    "messagebody": "Hello",
    "author": "ofir",
    "en": "",
    "he": "",
    "fr": "",
    "es": ""
}
messagesArray.push(m);

let t = {
    "messagebody": "my name is",
    "author": "aa",
    "en": "",
    "he": "",
    "fr": "",
    "es": ""
}
messagesArray.push(t);

//GETS BACK ALL THE MESSAGES
router.get('/', (req, res) => {
    //res.send('We are messages');
    let text = [];
    for(let i = 0; i < messagesArray.length; i++)
    {
        text.push(messagesArray[i].messagebody);
    }
    res.send(text);
});

//SUBMITS A MESSAGE
router.post('/', (req, res) => {
    //console.log(req.body);
    //console.log(req.body.messagebody);
    if(req.body.messagebody === "")
    {
        res.send("Empty message not allowed");
    }
    else{
        var message = {
            "messagebody": req.body.messagebody,
            "author": req.body.author,
            "en": "", 
            "he": "",
            "fr": "",
            "es": ""
        }
        messagesArray.push(message);
        res.send("OK");
    }
});
/*
//GETS MESSAGES BY AUTHOR
router.get('/:author', (req, res) => {
    //res.send('We are messages');
    let messagesByAuthor = messagesArray.filter(message => message.author === req.params.author);
    let text = [];
    for(let i = 0; i < messagesByAuthor.length; i++)
    {
        text.push(messagesByAuthor[i].messagebody);
    }
    res.send(text);
});
*/
var textt = [];
//GETS TRANSLATED MESSAGES
router.get('/translate/:language', (req, res) => {
    
    let t = "ho"

    for(let i = 0; i < messagesArray.length; i++)
    {
        //var tem = (translateString(messagesArray[i].messagebody, req.params.language));
       // console.log(messagesArray[i].fr);
        translate(messagesArray[i].messagebody, {from: 'en', to: 'fr'}).then(ress => {
            //console.log(res.text);
           // var str1 = ress.text;
            messagesArray[i].fr = ress.text;
            //textt.push(res.text);
            //console.log(str1);
        //console.log(messagesArray[i].fr);
        
         
     }).catch(err => {
        res.send(err)
     })
     //console.log(messagesArray[1].fr);
        //text.push(messagesArray[i].fr);
    }
    messagesArray[1].es = "tttt";
    console.log(messagesArray);
        //messagesArray[i].f
    //res.send(textt);
    
    
});
/*
function translateString( str, translateTo)
{
    translate(str, {from: 'en', to: 'fr'}).then(res => {
       // console.log(ress.text);
        return String(res.text);
    }).catch(err => {
        return err;
    })
}
*/

//SUBMITS A MESSAGE
/*
router.post('/', async (req, res) => {
    console.log(req.body);
    console.log(req.body.messagebody);
    const message = new Message({
        messagebody: req.body.messagebody,
        desc: req.body.desc
        //en: req.body.messageBody
    });

    message.save(function(err, result) {
        if (err) {
            console.log(err);
        }
        else{
            console.log(result)
        }
    })
    try{
    const savedMessage = await message.save();
    res.json(savedPost);
    }catch (err) {
        res.json({ message: err});
    }
});
*/

module.exports = router;