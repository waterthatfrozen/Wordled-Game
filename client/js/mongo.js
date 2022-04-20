// connect to the DB
const mongoose = require('mongoose');
const target_score = 1;

main().catch(err => console.log(err));

async function main() {
    const uri = "mongodb+srv://des422-wordled:IvMBkmr7NgBMWvv8@des422-wordled.rtbin.mongodb.net/wordled-stats?retryWrites=true&w=majority";
    mongoose.connect(uri);
    console.log("Connected to MongoDB");
    const scorecardSchema = mongoose.Schema({
        score: Number,
        count: Number
    });
    const scoreModel = mongoose.model('stats', scorecardSchema);
    
    scoreModel.findOne({"score":{$eq:target_score}}, function(err, obj){
        if(err){
            console.log(err);
        }else{
            console.log(obj["score"]+" "+obj["count"]);
            var new_count = obj["count"] + 1;
            scoreModel.updateOne({"score":target_score},{$set:{"count":new_count}}, function(err, obj){
                if(err){
                    console.log(err);
                }else{
                    console.log(obj);
                }
                mongoose.connection.close( () => {
                    console.log("Mongoose connection is closed");
                    process.exit(0);
                });
            });
        }
    });
}