const fetchData = require('./fetchData');
const model = require('./model');
const cron = require('node-cron');
const dbConnect = require('./dbConnect');
const { response } = require('express');

// uncomment the next 3 lines to run the code independently
// connect to mongoDB
// dbConnect.connect();
// insert();

function insert() {
    // cron-job
    cron.schedule('*/10 * * * *', () => {
        postAPIData();
    });

    // fetch data from YouTube
    async function postAPIData() {
        try {
            var apiResponse = await fetchData.apiResponse();
            console.log("inserting data...");
            var post = [];
            for(let i=0; i < apiResponse.length; i++) {
                post.push({
                    channleTitle: apiResponse[i]['snippet']['channelTitle'],
                    videoId: apiResponse[i]['id']['videoId'],
                    publishedAt: new Date(apiResponse[i]['snippet']['publishedAt']),
                    title: apiResponse[i]['snippet']['title'],
                    description: apiResponse[i]['snippet']['description']
                });
            }
            await model.mySchema.insertMany(post, { ordered: false });
        } catch (err) {
            console.log("error: \n", err);
        }
    }
    
}

module.exports.insert = insert;

