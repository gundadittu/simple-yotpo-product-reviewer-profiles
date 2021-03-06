// Node modules
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

// External modules
const express = require('express');
const logger = require('npmlog');
const mcache = require('memory-cache');
const cors = require('cors');
require("regenerator-runtime/runtime");
require("dotenv").config();

// Internal modules
const yotpoClient = require('./yotpoClient');
const viewModelFactory = require('./viewModelFactory');

// Express app setup
const PORT = process.env.PORT || 5000;
var app = express();

// EJS View Engine Set up
app.set("views", path.join(__dirname, "assets/views"));
app.use(express.static(path.join(__dirname, "assets")));
app.set("view engine", "ejs");
app.engine('ejs', require('ejs').__express);

// Cross origin support
app.use(cors());

// Env variables
const API_KEY = process.env.APP_KEY || null;
const API_SECRET = process.env.SECRET_KEY || null;

/*
* Confirms that application is properly configured to handle incoming request.
*/
app.use('/', async function (req, _res, next) {
    logger.info('app.use(\'/\')', 'Received request.',
        {
            hostName: req.hostname,
            body: req.body,
            baseUrl: req.baseUrl,
            params: req.params,
            path: req.path,
        });

    try {
        if (API_KEY == null || API_SECRET == null) {
            let err = new Error("Missing APP_KEY and/or SECRET_KEY");
            next(err);
            return
        }

        var accessToken = process.env.ACCESS_TOKEN || null;
        var accessTokenCreatedAt = process.env.ACCESS_TOKEN_CREATED_AT || null;

        logger.info('app.use(\'/\')', 'Retrieved existing ACCESS_TOKEN and ACCESS_TOKEN_CREATED_AT.',
            { accessToken: accessToken, accessTokenCreatedAt: accessTokenCreatedAt });

        // Check if access token has expired (older than 14 days)
        var two_weeks_ago_utc_ms = Math.floor(new Date().getTime() - 12096e5);
        var accessTokenExpired = (accessTokenCreatedAt !== null) ? two_weeks_ago_utc_ms >= accessTokenCreatedAt : true;


        // Create access token if invalid
        if (accessToken == null || accessTokenExpired) {
            logger.info('app.use(\'/\')', 'Refreshing access token.');
            accessToken = await yotpoClient.fetchAccessToken(API_KEY, API_SECRET);

            logger.info('app.use(\'/\')', 'Successfully fetched refreshed accessToken.',
                { accessToken: accessToken });

            // User Heroku CLI to save access token as env variable
            const cmd = "heroku config:set ACCESS_TOKEN=" + accessToken;
            child_process.exec(cmd);

            // Use Heroku CLI to save time when access token was created as env variable
            accessTokenCreatedAt = Math.floor(new Date().getTime());
            const cmd2 = "heroku config:set ACCESS_TOKEN_CREATED_AT=" + accessTokenCreatedAt;
            child_process.exec(cmd2);

            logger.info('app.use(\'/\')', 'Successfully set heroku config vars for ACCESS_TOKEN and ACCESS_TOKEN_CREATED_AT.',
                { accessToken: accessToken, accessTokenCreatedAt: accessTokenCreatedAt });

            // Save as regular env var for local testing
            process.env["ACCESS_TOKEN"] = accessToken;
            process.env["ACCESS_TOKEN_CREATED_AT"] = accessTokenCreatedAt;
        }
        next();
    } catch (e) {
        next(e);
    }
});

/*
* Returns a success message and list of all Yotpo reviews from associated account
*/
app.get('/', async function (_req, res, next) {
    try {
        const accessToken = process.env.ACCESS_TOKEN || null;

        logger.info('/', 'Fetching all reviews.', { apiKeyIsNull: API_KEY == null, accessTokenIsNull: accessToken == null });

        const allReviews = await yotpoClient.fetchAllReviews(API_KEY, accessToken);

        logger.info('/', 'Successfully fetched all reviews.');

        res.status(200).render('allReviews', { allReviews });
    } catch (e) {
        next(e);
    }
});

/*
* Returns a js script that attaches profiles to a Yotpo widget
* on a Shopify site
*/
app.get('/shopify-embedding-script', function (_req, res, next) {
    logger.info('/shopify-embedding-script', 'Retrieving shopify embedding script.');
    fs.readFile(__dirname + '/assets/scripts/shopifyEmbeddingScript.js', (err, data) => {
        if (err) {
            next(err);
            return;
        } else {
            logger.info('/shopify-embedding-script', 'Successfully retrieved shopify embedding script.',
                { data: data });

            res.type('.js')
            res.status(200).send(data);
        }
    });
});

/*
* Cache used by /reviewer-profile/:selectedReviewId route below.
*/
const profileViewCache = (duration) => {
    return (req, res, next) => {
        let key = req.params.selectedReviewId || null;
        if (key == null) {
            next();
            return;
        }
        logger.info('profileViewCache', 'Retrieved key.', { key });

        let cachedBody = mcache.get(key);

        logger.info('profileViewCache', 'Retrieved cached body', { cachedBody });

        if (cachedBody) {
            const { view, params } = cachedBody;
            logger.info('profileViewCache', 'Retrieved view and params', { view, params });
            if (view && params) {
                logger.info('profileViewCache', 'Sending back cached response.');
                res.status(200).render(view, params);
                return;
            }
        }

        logger.info('profileViewCache', 'Cached body was missing. Exiting cache.');

        res.renderResponse = res.render;
        res.render = (view, params) => {
            logger.info('profileViewCache', 'Caching and sending back profile response.', { view, params });
            mcache.put(key, { view, params }, duration * 1000)
            res.renderResponse(view, params);
        };
        next();
    }
}

/*
* Takes a review id and returns html and css to render that reviewer's profile.
*/
app.get('/reviewer-profile/:selectedReviewId', profileViewCache(60), async function (req, res, next) {
    try {
        const accessToken = process.env.ACCESS_TOKEN;
        const selectedReviewId = req.params.selectedReviewId;

        logger.info('/reviewer-profile/:selectedReviewId', 'Fetching reviewer profile.', { selectedReviewId: selectedReviewId });

        if (selectedReviewId == null || selectedReviewId == 0) {
            throw new Error(`Must provide valid selectedReviewId. (selectedReviewId: ${selectedReviewId})`);
        }

        logger.info('/reviewer-profile/:selectedReviewId', 'Calling Yotpo Client to fetch review profile.');

        const reviewerProfile = await viewModelFactory.constructReviewProfileViewModel(selectedReviewId, API_KEY, accessToken);

        logger.info('/reviewer-profile/:selectedReviewId', 'Successfuly fetched reviewer profile. Returning rendered view.', reviewerProfile);

        res.status(200).render('reviewerProfile', reviewerProfile);
    } catch (e) {
        next(e);
    }
});

/*
* Returns error response
*/
app.use(function (err, _req, res, _next) {
    logger.error("error-middleware", err);
    res.status(500).send(err);
});

app.listen(PORT, () => logger.info('app.listen', `Listening on ${PORT}`));
