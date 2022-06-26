const translate = require('@vitalets/google-translate-api');
// download in Terminal:
// npt install @vitalets/google-translate-api

async function translateString( str, translateTo)
{
    translate(str, {from: 'en', to: translateTo}).then(res => {
        console.log(res.text);
        return res.text;
    }).catch(err => {
        return err;
    })
}

var t = translateString('hello', 'fr');
console.log(t);