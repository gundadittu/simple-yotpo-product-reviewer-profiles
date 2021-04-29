// https://apidocs.yotpo.com/reference#retrieve-all-reviews
export const constructRetrieveAllReviewsUrl = (
    api_key,
    access_token,
    optionalSearchParams={}
) => {
    // const {
    //     since_id,
    //     since_date,
    //     since_updated_at,
    //     count = 100,
    //     page,
    //     deleted = true,
    //     user_reference
    // } = optionalSearcParams; 
    // TODO: check for null api_key and access_token
    const baseUrl = new URL(`https://api.yotpo.com/v1/apps/${api_key}/reviews`);
    baseUrl.searchParams.append("utoken", access_token);
    // TODO: add if clauses here 
    // TODO: validate data types especially for dates? 
    // baseUrl.searchParams.append("since_id", since_id);
    // baseUrl.searchParams.append("since_date", since_date);
    // baseUrl.searchParams.append("since_updated_at", since_updated_at);
    // baseUrl.searchParams.append("count", count);
    // baseUrl.searchParams.append("page", page);
    // baseUrl.searchParams.append("deleted", deleted);
    // baseUrl.searchParams.append("user_reference", user_reference);
    return baseUrl.href;
}