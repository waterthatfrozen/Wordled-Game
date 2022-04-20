var state = 0;
var used_words = [];

async function isValidWord(word){
    if(await used_words.includes(word)){
        return false;
    }else{    
        var url = "https://api.dictionaryapi.dev/api/v2/entries/en/"+word;
        let response = await fetch(url);
        let data = await response.json();
        return data.title != "No Definitions Found";
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
        if(element.result=="correct"){
            count++;
        }
    });
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
    $("input#guess-word").off("keyup").val("Congratulations! You won!").attr("disabled",true).addClass("bg-success text-white border-success");
    $("button#guess-button").off("click").text("Play again?").addClass("bg-primary text-white border-primary").attr("onclick","location.reload();");
}

async function wordle_gameover(current){
    $("input#guess-word").off("keyup").val("The word is "+current.toUpperCase()).attr("disabled",true).addClass("bg-danger text-white border-danger");
    $("button#guess-button").off("click").text("Play again?").addClass("bg-primary text-white border-primary").attr("onclick","location.reload();");
}

async function record_score(score){
    let data = { score: score};
    await fetch("/update-stats", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(err => console.log(err));
}

async function box_disable(message = "Checking..."){
    $("input#guess-word").prop("disabled",true);
    $("button#guess-button").prop("disabled",true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> '+message).toggleClass("btn-primary btn-secondary");
}

async function box_enable(message = " Submit"){
    $("input#guess-word").prop("disabled",false);
    $("button#guess-button").prop("disabled",false).text(message).toggleClass("btn-primary btn-secondary");
}

async function wordle_game(guess,current){
    box_disable();
    let valid = await isValidWord(guess);
    used_words.push(guess);
    if(valid){
        $("input#guess-word").val("");
        $("input#guess-word").removeClass("border-danger");
        var url = "https://v1.wordle.k2bd.dev/word/"+current+"?guess="+guess;
        let response = await fetch(url);
        let data = await response.json();
        await update_grid(data);
        state++;
        if(await wordle_isWin(data)){
            wordle_congrats();
            showDefiniton(current);
            record_score(state);
            $("button#guess-button").prop("disabled",false);
        }else{
            // update grid
            //game over condition
            if(state == 6){
                state = -1;
                wordle_gameover(current);
                showDefiniton(current);
                record_score(state);
                $("button#guess-button").prop("disabled",false);
            }else{
                box_enable();
            }
        }
        
    }else{
        window.alert("Invalid word!\nPlease try another word.");
        $("input#guess-word").addClass("border-danger");
        box_enable();
    }
}

async function main(){
    "use strict";
    box_disable("Please wait...");
    let current_word = await random_new_word(5);
    box_enable();
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
}

$(document).ready(main);