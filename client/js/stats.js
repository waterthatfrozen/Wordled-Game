async function getStats(){
    var result = {};
    await fetch("/get-stats").then(res => res.json()).then(data => {
        for(const element of data){
            if(element.score == -1){
                result["x"] = element.count;
            }else{
                result[element.score] = element.count;
            }
        }
    });
    return result;
}

async function main(){
    "use strict";
    var stats = await getStats();
    // display time stamps
    const date = (new Date()).toDateString().split(" ");
    // display stats on table
    var keyLabels = [], statsData = [], totalGames = 0;
    for(const key in stats){
        var stats_id = "#stats-"+key;
        keyLabels.push(key); statsData.push(stats[key]);
        $(stats_id).html(stats[key]);
        totalGames = totalGames + stats[key];
    }
    var successRate = 0;
    if(totalGames != 0){
        successRate = ((totalGames-stats["x"])/totalGames)*100;
    }
    var successPercentage = successRate.toFixed(2);
    $("#date-caption").html("Worldwide Game Success Rate: "+ successPercentage+"% <br/>"+totalGames+" games played | Statistics as of "+date[1]+". "+date[2]+", "+date[3]);
    var chart = new Chart("stats-chart",{
        type: 'bar',
        data: {
            labels: keyLabels,
            datasets: [{
                label: 'Wordled Stats',
                data: statsData,
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins:{
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });

}

$(document).ready(main);