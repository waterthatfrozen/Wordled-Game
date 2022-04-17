async function isValidWord(word){
    var url = "https://api.dictionaryapi.dev/api/v2/entries/en/"+word;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data[0].meanings);
    return data[0].meanings.length > 0;
}

async function random_new_word(length = 5){
    var url = "https://random-word-api.herokuapp.com/word?length="+length;
    let response = await fetch(url);
    let data = await response.json();
    let word = await data[0];
    if(await isValidWord(word)){
        return word;
    }else{
        return random_new_word(length);
    }
}

async function wordle_game(){
    await console.log("in game");
    let current_word = await random_new_word();
    let word_length = await current_word.length;
    console.log(current_word,word_length);
    await console.log("out game");
}

var main = function(){
    "use strict";
    console.log("start");
    wordle_game();
    console.log("end");
    // var url = "https://v1.wordle.k2bd.dev/daily?guess="+guess;
};

$(document).ready(main);