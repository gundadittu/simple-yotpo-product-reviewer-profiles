export const { fetchAllReviews, fetchSpecificReview, fetchAccessToken } = require('./dataFactory');

export async function getReviewerProfileForReviewId(selectedReviewId, apiKey, accessToken) {
    if (selectedReviewId == null || apiKey == null || accessToken == null) {
        throw new Error("Must provide selectedReviewId, apiKey, and accessToken."); // TODO: include provided values
    }

    const allReviews = await fetchAllReviews(apiKey, accessToken);
    const allReviewsCount = allReviews.length;

    const selectedReview = allReviews.find(r => r["id"] == selectedReviewId);
    if (selectedReview == null) {
        throw new Error("Provided Review id was not found."); // TODO: include review id in output
    }
    const selectedAuthorEmail = selectedReview["email"];
    const selectedAuthorName = selectedReview["name"];
    // TODO: replace default avatar image
    var selectedAuthorImageUrl = "https://secure.gravatar.com/avatar/214b1cc3f3b913b5e254f570c383a024?s=100&d=mm&r=g";

    var relevantReviews = [];
    var allStarRatingsCount = 0;
    var allUpvotesCount = 0;

    for (var i = 0; i < allReviewsCount; i++) {
        try {
            const currReview = allReviews[i];
            const currReviewId = currReview["id"];
            const authorEmail = currReview["email"];
            const starRating = currReview["score"];
            const upvoteCount = currReview["votes_up"];
            const downvoteCount = currReview["votes_down"];
            const createdAt = currReview["created_at"];
            const createdAtMs = createdAt ? Date.parse(createdAt) : null;
            const createdAtReadableString = createdAtMs ? new Date(createdAtMs).toString("MMM dd yy") : "";
            const title = currReview["title"];
            const content = currReview["content"];

            const deletedStatus = currReview["deleted"];
            const archiveStatus = currReview["archive"];
            const escalatedStatus = currReview["escalated"];

            if (authorEmail != selectedAuthorEmail ||
                deletedStatus == true ||
                archiveStatus == true ||
                escalatedStatus == true) { // TODO: what is escalated?
                continue;
            }


            const detailedReview = await fetchSpecificReview(currReviewId);

            const userInfo = detailedReview["user"];
            const userImageUrl = userInfo ? userInfo["social_image"] : null;
            if (userImageUrl) {
                selectedAuthorImageUrl = userImageUrl;
            }

            const productList = detailedReview["products"];
            const productInfo = (productList.length > 0) ? productList[0]["Product"] : null;
            const productImageList = productInfo ? productInfo["images"] : [];
            const productImageUrl = productImageList.length > 0 ? productImageList[0]["image_url"] : null;
            const productTitle = productInfo ? productInfo["name"] : "";
            const productUrl = productInfo ? productInfo["product_url"] : "";

            allStarRatingsCount += starRating;
            allUpvotesCount += upvoteCount;

            relevantReviews.push({
                title: title,
                content: content,
                upvoteCount: upvoteCount,
                downvoteCount: downvoteCount,
                starRating: starRating,
                date: createdAtReadableString,
                productImageUrl: productImageUrl,
                productTitle: productTitle,
                productUrl: productUrl
            });
        } catch (e) { 
            // log error
            console.log("getReviewerProfileForReviewId catch - "+e.message);
            continue; 
        }
    }

    const relevantReviewsCount = relevantReviews.length;
    const avgStarRating = (relevantReviewsCount > 0) ? allStarRatingsCount / relevantReviewsCount : 0;

    const profile = {
        authorImageUrl: selectedAuthorImageUrl,
        authorName: selectedAuthorName,
        allPostedReviews: relevantReviews,
        totalReviewCount: relevantReviewsCount,
        totalUpvoteCount: allUpvotesCount,
        avgStarRating: avgStarRating,
    };
    return profile;
}

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