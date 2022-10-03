const fetchData = require('./fetchData');
const model = require('./model');
const cron = require('node-cron');
const dbConnect = require('./dbConnect');
const { response } = require('express');

// // connect to mongoDB
// dbConnect.connect();
// insert();

async function writeToDb(apiResponse) {
    try {
        console.log("inserting data...");
        var post = [];
        for(let i=0; i < apiResponse.length; i++) {
            post.push({
                channelTitle: apiResponse[i]['snippet']['channelTitle'],
                videoId: apiResponse[i]['id']['videoId'],
                publishedAt: new Date(apiResponse[i]['snippet']['publishedAt']),
                title: apiResponse[i]['snippet']['title'],
                description: apiResponse[i]['snippet']['description']
            });
        }
        await model.mySchema.insertMany(post, { ordered: false });
    } catch(err) {
        // duplicacy error
        if(err.code == 11000){
            console.log("Inserted records: ", err.result.nInserted);
            console.log("Rejected duplicates: ", 50-err.result.nInserted);
        }
    }
}

function insert() {
    // cron-job
    cron.schedule('*/10 * * * *', () => {
        postAPIData();
    });

    // fetch data from YouTube
    async function postAPIData() {
        try {
            console.log("\n\nrunning cron...");
            var pageCount = 0;
            var res;
            do {
                console.log("Page Number: ", pageCount+1);
                res = await fetchData.apiResponse(pageCount);
                await writeToDb(res.items);
                pageCount += 1;
            } while(pageCount<5 && res.hasOwnProperty("nextPageToken"));
        } catch(err) {
            console.log("\nerror: ", err);
        }
    }
}

module.exports.insert = insert;

