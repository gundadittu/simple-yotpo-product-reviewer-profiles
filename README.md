# Yotpo UGC API Service

## Deploying to Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

or

```
$ heroku create
$ git push heroku main
$ heroku open
```

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ cd yotpo-ugc-api-service
$ npm install
$ npm run build
$ npm run start
```
App should now be running on [localhost:5000](http://localhost:5000/).

# File structure 
- webpack.config.js contains the necessary configurations to bundle this application for distribution
- Procfile contains the instructions for Heroku to start this application once deployed
- src/ contains the project's source code 
- src/index.js is the entry point for the express server
- src/yotpoClient contains all the necessary methods to interact with the Yotpo API
- src/assets/views contains EJS (embedded javascript) for rendering the reviewer profiles
- src/assets/scripts contains the scripts used to embed the profiles in a shopify website
- app.json contains metadata about this application to display when deploying it

## Heroku Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
