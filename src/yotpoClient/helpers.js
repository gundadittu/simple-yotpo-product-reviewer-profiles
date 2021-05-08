/* 
* API docs: https://apidocs.yotpo.com/reference#retrieve-all-reviews
*/
export const constructRetrieveAllReviewsUrl = (
    api_key,
    access_token,
    optionalSearchParams = { page: 1, count: 100 }
) => {
    const {
        count,
        page,
    } = optionalSearchParams;

    const baseUrl = new URL(`https://api.yotpo.com/v1/apps/${api_key}/reviews`);
    
    baseUrl.searchParams.append("utoken", access_token);

    if (count) {
        baseUrl.searchParams.append("count", count);
    }

    if (page) {
        baseUrl.searchParams.append("page", page);
    }
   
    return baseUrl.href;
}