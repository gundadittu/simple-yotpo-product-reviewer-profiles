const axios = require('axios');
const logger = require('npmlog');
const validator = new (require('jsonschema').Validator)();

const yotpoHelpers = require('./helpers');
const schemas = require('./schemas');
const { setup } = require('axios-cache-adapter')

const axiosCachedClient = setup({
    maxAge: 60 * (60 * 1000) // cache for 60 minutes
});

/*
* API docs: https://apidocs.yotpo.com/reference#yotpo-authentication
*/
export async function fetchAccessToken(
    apiKey,
    apiSecret,
    grantType = "client_credentials"
) {
    const url = 'https://api.yotpo.com/oauth/token';
    const res = await axios.get(url, {
        params: {
            "client_id": apiKey,
            "client_secret": apiSecret,
            "grant_type": grantType,
        }
    });
    logger.info('fetchAccessToken', 'Received response.');

    const data = res["data"];
    logger.info('fetchAccessToken', 'Extracted response data.', data);
    validator.validate(data, schemas.fetchAccessTokenDataSchema, { throwFirst: true });

    const access_token = data["access_token"];
    return access_token;
}

/*
* API docs: https://apidocs.yotpo.com/reference#retrieve-all-reviews
*/
export async function fetchAllReviews(
    apiKey,
    accessToken
) {
    var allReviews = [];

    var page = 1;
    const resultsPerPageCount = 100;

    const url = yotpoHelpers.constructRetrieveAllReviewsUrl(apiKey, accessToken, { page: page, count: resultsPerPageCount });
    var res = await axiosCachedClient.get(url);
    logger.info('fetchAllReviews', 'Received response.', { page: page, count: resultsPerPageCount });

    const data = res["data"];
    validator.validate(data, schemas.fetchAllReviewsDataSchema, { throwFirst: true });

    const reviews = data["reviews"];
    allReviews.push(...reviews);

    const reviewsCount = reviews ? reviews.length : 0;
    var nextPageAvailable = (reviewsCount >= resultsPerPageCount);
    while (nextPageAvailable) {
        page++;

        const url = yotpoHelpers.constructRetrieveAllReviewsUrl(apiKey, accessToken, { page: page });
        const res = await axios.get(url);
        logger.info('fetchAllReviews', 'Received response.', { page: page });

        const data = res["data"];
        validator.validate(data, schemas.fetchAllReviewsDataSchema, { throwFirst: true });
        const reviews = data["reviews"];

        allReviews.push(...reviews);

        const reviewsCount = reviews ? reviews.length : 0;
        nextPageAvailable = (reviewsCount >= resultsPerPageCount);
        logger.info('fetchAllReviews', 'Checking to see if next page is available.',
            { nextPageAvailable: nextPageAvailable, reviewsCount: reviewsCount, resultsPerPageCount: resultsPerPageCount });
    }

    return allReviews;
}

/*
* API docs: https://apidocs.yotpo.com/reference#retrieve-a-review-by-review-id
*/
export async function fetchSpecificReview(reviewId) {
    const url = 'https://api.yotpo.com/reviews/' + reviewId;
    const res = await axios.get(url);
    logger.info('fetchSpecificReview', 'Received response.');

    const data = res["data"];
    logger.info('fetchSpecificReview', 'Extracted response data.', data);
    validator.validate(data, schemas.fetchSpecificReviewDataSchema, { throwFirst: true });

    const review = data["response"]["review"];
    return review;
}