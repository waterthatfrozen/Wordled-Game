var state = 0;

async function isValidWord(word){
    var url = "https://api.dictionaryapi.dev/api/v2/entries/en/"+word;
    let response = await fetch(url);
    let data = await response.json();
    return data.title != "No Definitions Found";
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
        var char_id = "span#char-"+element.guess;
        var slot_state = element.result;
        $(tile_id).text(element.guess);
        if(slot_state=="correct"){
            $(tile_id).addClass("tile-correct");
        }else if(slot_state=="present"){
            $(tile_id).addClass("tile-present");
        }else{
            $(tile_id).addClass("tile-absent");
        }
        $(char_id).removeClass("char-present"); 
        if(slot_state=="correct"){
            $(char_id).addClass("char-correct");
        }else if(slot_state=="present"){
            $(char_id).addClass("char-present");
        }else{
            $(char_id).addClass("char-absent");
        }
    });
}

async function showDefiniton(word){
    var url = "https://api.dictionaryapi.dev/api/v2/entries/en/"+word;
    let response = await fetch(url);
    let data = await response.json();
    let result = data[0].meanings[0];
    $("#remain-title").attr("hidden",true);
    $("#remain-char").attr("hidden",true);
    $("#word-def").attr("hidden",false);
    $("div#word-def").html(word.toUpperCase()+" ("+result.partOfSpeech+")<br/>"+result.definitions[0].definition);
}

async function wordle_congrats(){
    console.log("win!");
    $("input#guess-word").off("keyup").val("Congratulations! You won!").attr("disabled",true).addClass("bg-success text-white border-success");
    $("button#guess-button").off("click").text("Play again?").addClass("bg-primary text-white border-primary").attr("onclick","location.reload();");
}

async function wordle_gameover(current){
    console.log("game over!");
    $("input#guess-word").off("keyup").val("The word is "+current.toUpperCase()).attr("disabled",true).addClass("bg-danger text-white border-danger");
    $("button#guess-button").off("click").text("Play again?").addClass("bg-primary text-white border-primary").attr("onclick","location.reload();");
}

async function record_score(score){
    
    console.log("score: "+score);
}

async function wordle_game(guess,current){
    console.log("guess word: "+guess);
    console.log("current word: "+current);
    let valid = await isValidWord(guess);
    console.log("valid: "+valid);
    if(valid){
        $("input#guess-word").val("");
        $("input#guess-word").removeClass("border-danger");
        var url = "https://v1.wordle.k2bd.dev/word/"+current+"?guess="+guess;
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        await update_grid(data);
        state++;
        if(await wordle_isWin(data)){
            wordle_congrats();
            showDefiniton(current);
            record_score(state);
        }else{
            console.log("not win yet!");
            // update grid
            //game over condition
            if(state == 6){
                wordle_gameover(current);
                showDefiniton(current);
                state = -1;
                record_score(state);
            }
            console.log("state: "+state);
        }
    }else{
        console.log("invalid word");
        window.alert("Invalid word");
        $("input#guess-word").addClass("border-danger");
    }
}

async function main(){
    "use strict";
    console.log("start");
    let current_word = await random_new_word(5);
    console.log(current_word);
    // detect click button
    $("button#guess-button").on("click",function(event){
        event.preventDefault();
        event.stopPropagation();
        let guess_word = $("input#guess-word").val().toLowerCase();
        if(guess_word.length == 5){
            wordle_game(guess_word,current_word);
        }else{
            alert("Please enter a 5 letter word");
        }
    });
    $("input#guess-word").on("keyup",function(event){
        if(event.key == "Enter"){
            event.preventDefault();
            event.stopPropagation();
            let guess_word = $("input#guess-word").val().toLowerCase();
            if(guess_word.length == 5){
                wordle_game(guess_word,current_word);
            }else{
                alert("Please enter a 5 letter word");
            }
        }
    });
    console.log("end");
}

$(document).ready(main);