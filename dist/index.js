"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var apiClient = require('./yotpoMerchantApiClient');

var child_process = require('child_process');

require("babel-register");

require("babel-polyfill");

require("dotenv").config();

var PORT = process.env.PORT || 5000;
var API_KEY = process.env.APP_KEY;
var API_SECRET = process.env.SECRET_KEY;
var app = express();
app.use('/', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_req, _res, next) {
    var err, accessToken, accessTokenCreatedAt, two_weeks_ago_utc_ms, accessTokenExpired, cmd, cmd2;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(API_KEY == null || API_SECRET == null)) {
              _context.next = 4;
              break;
            }

            err = new Error("Missing API_KEY and/or API_SECRET"); // TODO: add env var values here

            next(err);
            return _context.abrupt("return");

          case 4:
            accessToken = process.env.ACCESS_TOKEN;
            accessTokenCreatedAt = process.env.ACCESS_TOKEN_CREATED_AT; // TODO: test accessTokenExpired
            // Check if access token has expired (older than 14 days)

            two_weeks_ago_utc_ms = Math.floor(new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).getTime() / 100);
            accessTokenExpired = accessTokenCreatedAt ? two_weeks_ago_utc_ms >= accessTokenCreatedAt : true;
            _context.prev = 8;

            if (!(accessToken == null || accessTokenExpired)) {
              _context.next = 20;
              break;
            }

            _context.next = 12;
            return apiClient.fetchAccessToken(API_KEY, API_SECRET);

          case 12:
            accessToken = _context.sent;
            // TODO: test below line
            // User Heroku CLI to save access token as env variable
            cmd = "heroku config:set ACCESS_TOKEN=" + accessToken;
            child_process.exec(cmd); // Use Heroku CLI to save time when access token was created as env variable

            accessTokenCreatedAt = Math.floor(new Date().getTime() / 1000);
            cmd2 = "heroku config:set ACCESS_TOKEN_CREATED_AT=" + accessTokenCreatedAt;
            child_process.exec(cmd2); // Save as regular env var for local testing

            process.env["ACCESS_TOKEN"] = accessToken;
            process.env["ACCESS_TOKEN_CREATED_AT"] = accessTokenCreatedAt;

          case 20:
            next();
            _context.next = 26;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](8);
            next(_context.t0);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 23]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
app.get('/reviewer-profile/:selectedReviewId', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var accessToken, selectedReviewId, allReviews, selectedReview, reviewerEmail, relevantReviews;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            accessToken = process.env.ACCESS_TOKEN;
            selectedReviewId = req.params.selectedReviewId; // TODO: check that accessToken and reviewId are not null
            // const data = await apiClient.getReviewerProfileForReviewId(reviewId, API_KEY, accessToken, {}); 

            if (!(selectedReviewId == null)) {
              _context2.next = 5;
              break;
            }

            throw new Error("Must provide selectedReviewId.");

          case 5:
            _context2.next = 7;
            return apiClient.fetchAllReviews(API_KEY, accessToken);

          case 7:
            allReviews = _context2.sent;
            selectedReview = allReviews.find(function (r) {
              return r["id"] == selectedReviewId;
            });

            if (!(selectedReview == null)) {
              _context2.next = 11;
              break;
            }

            throw new Error("Provided Review id was not found.");

          case 11:
            reviewerEmail = selectedReview["email"];
            relevantReviews = allReviews.filter(function (r) {
              return r["email"] == reviewerEmail;
            });
            res.status(200).send(relevantReviews);
            _context2.next = 19;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 16]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
app.use(function (err, _req, res, _next) {
  // Log Error + send back generic message 
  res.status(500).send(err.message);
});
app.listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
});