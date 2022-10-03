const insert = require('./insert').insert;
const express = require('express');
const app = express();
const dbConnect = require('./dbConnect');
const PORT = 8000;
const { mySchema } = require('./model');
const rateLimit = require('express-rate-limit');

// connect to mongoDB
dbConnect.connect();

// cron-job for inserting data
insert();

// run node on PORT
app.listen(PORT, () => {
    console.log("Server started at port", PORT);
});

// ratelimiting
const limiter = rateLimit({
    max: 5,
    windowMs: 10000
});

// search api
app.get('/search', limiter, async(req, res) => {
    try {
        const search = req.query.text || "skill";
        console.log("searching...");
        var data = await mySchema.find({
            $text: {$search: search},
        }).sort({
            publishedAt: -1
        });
        res.status(200).send({
            status: "success",
            data: data
        });
    } catch(err) {
        console.log("\nerror: ", err);
        res.status(500).send({
            status: "search failure",
        });
    }
});

// pagination
app.get("/videos", async(req, res) => {
    try {
        console.log("fetching videos...");

        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page-1)*limit;
        const sort = req.query.sort || "publishedAt";

        let videos = await mySchema.find()
        .sort({[sort]: -1})
        .skip(skip)
        .limit(limit);

        res.status(200).send({
            status: "success",
            page: page,
            limit: limit,
            videos: videos,
        });
        console.log("data fetched");
    } catch (err) {
        console.log("\nerror:", err);
        res.status(500).send({
            status: "pagination failure",
        });
    }
});




