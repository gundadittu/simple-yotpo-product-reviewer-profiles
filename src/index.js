const express = require('express');
const apiClient = require('./yotpoMerchantApiClient');
const child_process = require('child_process');
require("babel-register");
require("babel-polyfill");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const API_KEY = process.env.APP_KEY;
const API_SECRET = process.env.SECRET_KEY;

var app = express();

// TODO: add logging
// TODO: handle heroku timeout/memory exceeded errors
// TODO: handle heroku errors where free tier quota is exceeded 
// - https://devcenter.heroku.com/articles/free-dyno-hours#determining-your-free-dyno-hours
// TODO: yotpo handle rate limiting errors

app.use('/', async function (_req, _res, next) {
    if (API_KEY == null || API_SECRET == null) {
        let err = new Error("Missing API_KEY and/or API_SECRET"); // TODO: add env var values here
        next(err);
        return
    }

    var accessToken = process.env.ACCESS_TOKEN;
    var accessTokenCreatedAt = process.env.ACCESS_TOKEN_CREATED_AT;

    // TODO: test accessTokenExpired
    // Check if access token has expired (older than 14 days)
    var two_weeks_ago_utc_ms = Math.floor(new Date(new Date().getTime() - (14 * 24 * 60 * 60 * 1000)).getTime() / 100);
    var accessTokenExpired = accessTokenCreatedAt ? two_weeks_ago_utc_ms >= accessTokenCreatedAt : true;
    try {
        // Create access token if invalid
        if (accessToken == null || accessTokenExpired) {
            accessToken = await apiClient.fetchAccessToken(API_KEY, API_SECRET);
            // TODO: test below line

            // User Heroku CLI to save access token as env variable
            const cmd = "heroku config:set ACCESS_TOKEN=" + accessToken;
            child_process.exec(cmd);

            // Use Heroku CLI to save time when access token was created as env variable
            accessTokenCreatedAt = Math.floor(new Date().getTime() / 1000);
            const cmd2 = "heroku config:set ACCESS_TOKEN_CREATED_AT=" + accessTokenCreatedAt;
            child_process.exec(cmd2);

            // Save as regular env var for local testing
            process.env["ACCESS_TOKEN"] = accessToken;
            process.env["ACCESS_TOKEN_CREATED_AT"] = accessTokenCreatedAt;
        }
        next();
    } catch (e) {
        next(e);
    }
});

// TODO: add caching to response
app.get('/reviewer-profile/:selectedReviewId', async function (req, res, next) {
    try {
        const accessToken = process.env.ACCESS_TOKEN;
        const selectedReviewId = req.params.selectedReviewId;
        // TODO: check that accessToken and reviewId are not null
        // const data = await apiClient.getReviewerProfileForReviewId(reviewId, API_KEY, accessToken, {}); 
        if (selectedReviewId == null) {
            throw new Error("Must provide selectedReviewId."); // TODO: include provided values
        }
        const allReviews = await apiClient.fetchAllReviews(API_KEY, accessToken);
        const selectedReview = allReviews.find(r => r["id"] == selectedReviewId);
        if (selectedReview == null) {
            throw new Error("Provided Review id was not found."); // TODO: include review id in output
        }
        const reviewerEmail = selectedReview["email"];
        const relevantReviews = allReviews.filter(r => r["email"] == reviewerEmail);
        res.status(200).send('<h1>'+relevantReviews+'</h1>');
    } catch (e) {
        next(e);
    }
});

app.use(function (err, _req, res, _next) {
    // Log Error + send back generic message 
    // TODO: clean up return error message 
    res.status(500).send(err.message);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
