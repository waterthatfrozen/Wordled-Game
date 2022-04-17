async function isValidWord(word){
    var url = "https://api.dictionaryapi.dev/api/v2/entries/en/"+word;
    try {
        let response = await fetch(url);
        let data = await response.json();
        await console.log(data[0].meanings.length > 0);
        return await data[0].meanings.length > 0;
    } catch (error) {
        return false;
    }
}

async function random_new_word(length){
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

async function wordle_isWin(result){
    var count = 0;
    await result.forEach(function(element){
        console.log(element);
        if(element.result=="correct"){
            count++;
        }
    });
    console.log(count);
    return count == 5;
}

async function update_grid(data){
    data.forEach(function(element){
        var tile_id = "div#tile-"+state+element.slot;
        $(tile_id).text(element.guess);
        if(element.result=="correct"){
            $(tile_id).addClass("tile-correct");
        }else if(element.result=="present"){
            $(tile_id).addClass("tile-present");
        }else{
            $(tile_id).addClass("tile-absent");
        }
    });
}

async function wordle_game(guess,current){
    var url = "https://v1.wordle.k2bd.dev/word/"+current+"?guess="+guess;
    let response = await fetch(url);
    let data = await response.json();
    await console.log(data);
    if(await wordle_isWin(data)){
        console.log("win!");
        await update_grid(data);
        $("input#guess-word").val("Congratulations! You won!");
        $("input#guess-word").attr("disabled","disabled");
        $("input#guess-word").addClass("bg-success");
        $("button#guess-button").off("click");
        $("button#guess-button").text("Congratulations!");
        $("button#guess-button").addClasses("bg-success text-white border-success");
        $("button#guess-button").prop("disabled",true);
        return true;
    }else{
        console.log("not win yet!");
        // update grid
        await update_grid(data);
        state++;
        //game over condition
        if(state == 6){
            console.log("game over");
            $("button#guess-button").off("click");
            $("button#guess-button").text("Game Over!");
            $("button#guess-button").addClass("btn-danger");
            $("button#guess-button").prop("disabled",true);
            return false;
        }
        console.log(state);
    }
}

var state = 0;

async function main(){
    "use strict";
    console.log("start");
    let current_word = await random_new_word(5);
    console.log(current_word);
    $("button#guess-button").on("click",function(event){
        event.preventDefault();
        let guess_word = $("input#guess-word").val().toLowerCase();
        if(guess_word.length == 5){
            $("input#guess-word").val("");
            wordle_game(guess_word,current_word);
        }else{
            alert("Please enter a 5 letter word");
        }
    });
    console.log("end");
}

$(document).ready(main);