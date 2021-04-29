"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAccessToken = exports.fetchAllReviews = void 0;

var _require = require('./dataFactory'),
    fetchAllReviews = _require.fetchAllReviews,
    fetchAccessToken = _require.fetchAccessToken; // export function getReviewerProfileForReviewId(selectedReviewId, apiKey, accessToken) { 
//     if (selectedReviewId == null || apiKey == null || accessToken == null) { 
//         throw new Error("Must provide selectedReviewId, apiKey, and accessToken."); // TODO: include provided values
//     }
//     const allReviews = await dataFactory.fetchAllReviews(apiKey, accessToken);
//     const selectedReview = allReviews.find(r => r["id"] == selectedReviewId);
//     if (selectedReview == null) { 
//         throw new Error("Provided Review id was not found."); // TODO: include review id in output
//     }
//     const reviewerEmail = selectedReview["email"];
//     const relevantReviews = allReviews.filter(r => r["email"] == reviewerEmail);
//     return relevantReviews; 
// }
// {
//     "reviews": [
//       {
//         "id": 248989899,
//         "title": "test review 1",
//         "content": "test review",
//         "score": 4,
//         "votes_up": 0,
//         "votes_down": 0,
//         "created_at": "2021-04-22T02:18:31.000Z",
//         "updated_at": "2021-04-22T02:53:35.000Z",
//         "sentiment": 0.589802,
//         "sku": "6640762945709",
//         "name": "dittu",
//         "email": "dittukg@gmail.com",
//         "reviewer_type": "verified_reviewer",
//         "deleted": false,
//         "archived": false,
//         "escalated": false
//       },
//     ]
// }


exports.fetchAccessToken = fetchAccessToken;
exports.fetchAllReviews = fetchAllReviews;