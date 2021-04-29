"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAccessToken = fetchAccessToken;
exports.fetchAllReviews = fetchAllReviews;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var axios = require('axios');

var yotpoHelpers = require('./helpers');

function fetchAccessToken(_x, _x2) {
  return _fetchAccessToken.apply(this, arguments);
} // TODO: add pagination


function _fetchAccessToken() {
  _fetchAccessToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(apiKey, apiSecret) {
    var grantType,
        url,
        res,
        data,
        access_token,
        token_type,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            grantType = _args.length > 2 && _args[2] !== undefined ? _args[2] : "client_credentials";
            url = 'https://api.yotpo.com/oauth/token';
            _context.next = 4;
            return axios.get(url, {
              params: {
                "client_id": apiKey,
                "client_secret": apiSecret,
                "grant_type": grantType
              }
            });

          case 4:
            res = _context.sent;
            data = res["data"];
            access_token = data ? data["access_token"] : null;
            token_type = data ? data["token_type"] : null; // TODO: throw error if access_token and token_type is null

            return _context.abrupt("return", access_token);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _fetchAccessToken.apply(this, arguments);
}

function fetchAllReviews(_x3, _x4) {
  return _fetchAllReviews.apply(this, arguments);
} // {
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
// export async function fetchSpecificReview(reviewId) { 
//     const url = 'https://api.yotpo.com/reviews/'+reviewId;
//     const res = await axios.get(url); 
//     const status = res["status"]["code"]; 
//     const review = res["response"]["review"]; 
// }
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


function _fetchAllReviews() {
  _fetchAllReviews = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(apiKey, accessToken) {
    var optionalSearchParams,
        url,
        res,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            optionalSearchParams = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            url = yotpoHelpers.constructRetrieveAllReviewsUrl(apiKey, accessToken, optionalSearchParams);
            _context2.next = 4;
            return axios.get(url);

          case 4:
            res = _context2.sent;
            return _context2.abrupt("return", res["data"]["reviews"]);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _fetchAllReviews.apply(this, arguments);
}