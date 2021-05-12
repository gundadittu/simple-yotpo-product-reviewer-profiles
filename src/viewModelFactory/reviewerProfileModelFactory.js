const logger = require('npmlog');
const yotpoClient = require('../yotpoClient');
/* 
* Takes review id and fetches all reviews posted by the same author. 
* Returns a profile object that is formatted for the reviewerProfile view.
*  {
*       authorImageUrl: selectedAuthorImageUrl,
*       authorName: selectedAuthorName,
*       allPostedReviews: relevantReviews,
*       totalReviewCount: relevantReviewsCount,
*       totalUpvoteCount: allUpvotesCount,
*       avgStarRating: avgStarRating,
*   }
*/
export async function constructReviewProfileViewModel(selectedReviewId, apiKey, accessToken) {
    if (selectedReviewId == null || apiKey == null || accessToken == null) {
        throw new Error("Must provide selectedReviewId, apiKey, and accessToken.");
    }

    logger.info('getReviewerProfileForReviewId', 'Calling fetchAllReviews');
    const allReviews = await yotpoClient.fetchAllReviews(apiKey, accessToken);
    logger.info('getReviewerProfileForReviewId', 'Successfully fetchedAllReviews.');

    const allReviewsCount = allReviews.length;

    const selectedReview = allReviews.find(r => r["id"] == selectedReviewId);
    if (selectedReview == null) {
        throw new Error(`Provided Review id (${selectedReviewId}) was not found.`);
    }
    logger.info('getReviewerProfileForReviewId', 'Found selectedReview.', { selectedReview: selectedReview });

    const selectedAuthorEmail = selectedReview["email"];
    const selectedAuthorName = selectedReview["name"];

    var selectedAuthorImageUrl;
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
            const createdAtReadableString = createdAtMs ? new Date(createdAtMs).mmddyyyy() : "";


            function removeHtmlEntities(str) {
                if (typeof str !== "string") {
                    return str; 
                }
                var text = str;
                const entities = {
                    '\'': /&#x27;/g,
                    '\"': /&quot;/g,
                    '&': /&amp;/g
                };
                for (const [key, value] of Object.entries(entities)) {
                    text = text.replace(value, key);
                }
                return text;
            }

            const title = removeHtmlEntities(currReview["title"]);
            const content = removeHtmlEntities(currReview["content"]);

            const deletedStatus = currReview["deleted"];
            const archiveStatus = currReview["archive"];
            const escalatedStatus = currReview["escalated"];

            if (authorEmail != selectedAuthorEmail ||
                deletedStatus == true ||
                archiveStatus == true ||
                escalatedStatus == true) {
                logger.info('getReviewerProfileForReviewId', 'Skipping review.',
                    {
                        currReviewId: currReviewId,
                        selectedAuthorEmail: selectedAuthorEmail,
                        authorEmail: authorEmail,
                    });
                continue;
            }

            logger.info('getReviewerProfileForReviewId', 'Fetching review details.', { currReviewId: currReviewId });

            const detailedReview = await yotpoClient.fetchSpecificReview(currReviewId);

            logger.info('getReviewerProfileForReviewId', 'Successfully fetched detailedReview.');

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
            logger.error('getReviewerProfileForReviewId', e);
            continue;
        }
    }

    const relevantReviewsCount = relevantReviews.length;
    const avgStarRating = (relevantReviewsCount > 0) ? (allStarRatingsCount / relevantReviewsCount).toFixed(1) : 0;

    const profile = {
        authorImageUrl: selectedAuthorImageUrl,
        authorName: selectedAuthorName,
        allPostedReviews: relevantReviews,
        totalReviewCount: relevantReviewsCount,
        totalUpvoteCount: allUpvotesCount,
        avgStarRating: avgStarRating,
    };

    logger.info('getReviewerProfileForReviewId', 'Returning profile object.');
    return profile;
}

Date.prototype.mmddyyyy = function () {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [(mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd,
    this.getFullYear(),
    ].join('/');
};