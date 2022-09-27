const axios = require('axios');
const apiKey1 = "AIzaSyAx3xTVsgGuwFRlGdKOVc-MdX7cLf5ipgE";
const apiKey2 = "AIzaSyCDgH4JbXUj1kBjofUHXa4oyNd0oNo8osc";
const maxResults = 50;
const query = "football";
const apiKey = [apiKey1, apiKey2];
var index = 0;

function apiResponse() {
    useKey = apiKey[ index%(apiKey.length) ];
    index += 1;
    var url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&key=${useKey}`;

    console.log("\nuseKey: ", useKey);

    return axios.get(url).then((res) => {
        return res.data.items;
    }).catch((err) => {
        return err;
    });
}

module.exports.apiResponse = apiResponse;


