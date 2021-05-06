const axios = require('axios');
const yotpoHelpers = require('./helpers'); 

export async function fetchAccessToken( 
    apiKey, 
    apiSecret, 
    grantType="client_credentials"
) { 
    const url = 'https://api.yotpo.com/oauth/token';
    const res = await axios.get(url, { 
        params: { 
            "client_id": apiKey, 
            "client_secret": apiSecret, 
            "grant_type": grantType, 
        }
    });
    const data = res["data"]; 
    const access_token = data ? data["access_token"] : null; 
    const token_type = data ? data["token_type"] : null; 
    // TODO: throw error if access_token and token_type is null
    return access_token; 
}

// TODO: add pagination
export async function fetchAllReviews(
    apiKey, 
    accessToken, 
    optionalSearchParams={}
) { 
    const url = yotpoHelpers.constructRetrieveAllReviewsUrl(apiKey, accessToken, optionalSearchParams);
    const res = await axios.get(url); 
    // TODO check types of all review objects https://stackoverflow.com/questions/20804163/check-if-a-key-exists-inside-a-json-object
    // TODO: create  review object? 
    return res["data"]["reviews"];
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
//       {
//         "id": 249048026,
//         "title": "test review 2",
//         "content": "test review 2",
//         "score": 4,
//         "votes_up": 0,
//         "votes_down": 0,
//         "created_at": "2021-04-22T04:15:42.000Z",
//         "updated_at": "2021-04-22T04:40:10.000Z",
//         "sentiment": 0.291341,
//         "sku": "6640762945709",
//         "name": "dittu 2.",
//         "email": "gundadittu@gmail.com",
//         "reviewer_type": "anonymous_user",
//         "deleted": false,
//         "archived": false,
//         "escalated": false
//       },
//       {
//         "id": 249048085,
//         "title": "test 2",
//         "content": "test 2",
//         "score": 5,
//         "votes_up": 0,
//         "votes_down": 0,
//         "created_at": "2021-04-22T04:16:23.000Z",
//         "updated_at": "2021-04-22T04:40:12.000Z",
//         "sentiment": 0.549975,
//         "sku": "6640762945709",
//         "name": "dittu g.",
//         "email": "dittukg@gmail.com",
//         "reviewer_type": "anonymous_user",
//         "deleted": false,
//         "archived": false,
//         "escalated": false
//       }
//     ]
//   }

export async function fetchSpecificReview(reviewId) { 
    const url = 'https://api.yotpo.com/reviews/'+reviewId;
    const res = await axios.get(url); 
    // TODO: add proper type checking
    const data = res["data"]["response"];
    const review = data["review"];
    return review; 
}
// {
//     "status":{
//        "code":200,
//        "message":"OK"
//     },
//     "response":{
//        "review":{
//           "account":{
//              "id":4,
//              "domain":"widget.yotpo.com"
//           },
//           "id":1010591,
//           "content":"Tolles Produkt zu fairen Preisen",
//           "title":"Tolles Produkt",
//           "score":5,
//           "sentiment":0.439879,
//           "user_type":"User",
//           "users":[
             
//           ],
//           "votes_up":1,
//           "votes_down":0,
//           "user_vote":0,
//           "created_at":"2014-03-18T09:27:45.000Z",
//           "deleted":false,
//           "new":false,
//           "verified_buyer":false,
//           "archived":false,
//           "social_pushed":false,
//           "facebook_pushed":0,
//           "twitter_pushed":0,
//           "products":[
//              {
//                 "Location_idx":[
//                    0,
//                    0
//                 ],
//                 "Product":{
//                    "id":1739260,
//                    "name":"Canon EOS 5D Mark II",
//                    "slug":"canon-eos-5d-mark-ii--2",
//                    "product_url":"http://my.yotpo.com",
//                    "shorten_url":"https://yotpo.com/go/sgCKCMPf",
//                    "images":[
//                       {
//                          "id":1705775,
//                          "image_url":"https://cdn-yotpo-images-production.yotpo.com/Product/1739260/1705775/square.jpg?1455184269",
//                          "big_image_url":"https://cdn-yotpo-images-production.yotpo.com/Product/1739260/1705775/big.jpg?1455184269"
//                       }
//                    ],
//                    "social_network_links":{
//                       "linkedin":"https://yotpo.com/go/gevejcJu",
//                       "facebook":"https://yotpo.com/go/cB9u1ZcN",
//                       "twitter":"https://yotpo.com/go/s0hx74VT",
//                       "google_oauth2":"https://yotpo.com/go/ur9oH1N7"
//                    },
//                    "facebook_testemonials_page_product_url":"https://yotpo.com/go/zBKLBNSy"
//                 }
//              }
//           ],
//           "user":{
//              "id":650200,
//              "display_name":"Wolfgang Mau",
//              "slug":"wolfgang-mau",
//              "social_image":"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
//              "is_social_connected":true,
//              "score":0,
//              "badges":[
//                 {
//                    "id":1,
//                    "name":"Newbie",
//                    "description":"Hooray, you wrote your first review with Yotpo! Now you have this cool profile page, and you can earn Yotpo score and have even more badges.",
//                    "image_100":"http://s3.amazonaws.com/yotpo-static-images/badges/100/1.png",
//                    "image_300":"http://s3.amazonaws.com/yotpo-static-images/badges/300/1.png"
//                 }
//              ]
//           },
//           "products_apps":[
//              {
//                 "id":1696312,
//                 "product_url":"http://my.yotpo.com",
//                 "domain_key":"B000HT3P7E",
//                 "product":{
//                    "id":1696312,
//                    "name":"Canon EOS 5D Mark II"
//                 }
//              }
//           ]
//        }
//     }
//  }