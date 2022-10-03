const axios = require('axios');
const apiKey1 = "AIzaSyCDgH4JbXUj1kBjofUHXa4oyNd0oNo8osc";
const apiKey2 = "AIzaSyAx3xTVsgGuwFRlGdKOVc-MdX7cLf5ipgE";
const maxResults = 50;
const query = "football";
const apiKey = [apiKey1, apiKey2];
var index = 0;
const url = `https://youtube.googleapis.com/youtube/v3/search?`;
var publishedAfter = new Date("2022-09-01");
publishedAfter = publishedAfter.toISOString();
var params = {
    part: "snippet",
    order: "date",
    maxResults: maxResults,
    q: query,
    key: apiKey[0],
    type: "video",
    publishedAfter: publishedAfter,
};

function apiResponse(pageCount) {
    // rotate key
    params.key = apiKey[ index%(apiKey.length) ];
    index += 1;
    
    console.log("params: ", params);
    
    // resolve the clash between nextPageToken and publishedAfter updation
    return axios.get(url, { params }).then((res) => {
        if(!res.data.hasOwnProperty("prevPageToken")) {
            publishedAfter = new Date(res.data.items[0]['snippet']['publishedAt']);
            // console.log("pa: ", publishedAfter);
            publishedAfter.setSeconds(publishedAfter.getSeconds()-1);
        }
        // console.log("publishedAfter: ", publishedAfter);

        if(res.data.hasOwnProperty("nextPageToken") && pageCount<4) {
            // console.log("nextPageToken: ", res.data.nextPageToken);
            params.pageToken = res.data.nextPageToken;
        } else {
            // last nextpageToken accessed, update params for next cron-job
            params.publishedAfter = publishedAfter;
            console.log("updated publishedAfter: ", publishedAfter);
            delete params.pageToken;
        }
        return res.data;
    }).catch((err) => {
        throw err;
    });
}

module.exports.apiResponse = apiResponse;

