async function callResetWorldStats(){
    await fetch("/reset-stats").then(res => res.json()).then(data => {
        var reset_status = $("#reset-status");
        if(data.status == "success"){
            reset_status.html("Reset game statistics successful!");
            reset_status.addClass("alert-success");
        }else{
            reset_status.html("Reset game statistics failed!");
            reset_status.addClass("alert-danger");
        }
        reset_status.prop("hidden",false);
        $("button#reset-world-stats").prop({"disabled": true, "hidden":true});
        $("button#reset-world-stats").off("click");
        $("div#home-div").prop("hidden",false);
    });
}

async function main(){
    $("button#reset-world-stats").on("click",function(event){
        event.preventDefault();
        let confirmation = confirm("Are you sure you want to reset the world stats?");
        if(confirmation){
            callResetWorldStats();
        }else{
            console.log("Reset cancelled");
        }
    });
}

$(document).ready(main);