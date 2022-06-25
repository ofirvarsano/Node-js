const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    messagebody: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Message', MessageSchema);

//await mongoose.Model.createCollection();
    /*

    en: {
        type: String,
        required: false
    },
    es:  {
        type: String,
        required: false
    },
    he: {
        type: String,
        required: false
    },
    fr:  {
        type: String,
        required: false
    }*/