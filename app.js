
const express = require('express'),
  app = express(),
  PORT = process.env.PORT || 8081,
  bodyParser = require('body-parser'),
  { graphqlExpress } = require('apollo-server-express'),
  { mergeSchemas } = require('graphql-tools'),
  { getIntrospectSchema } = require('./graphql-utils/introspection');

  const endpoints = [
     'https://graphql.brandfolder.com/graphql',
     'https://graphql.cosmicjs.com/v1',  
  ];

  (async function () {
    try {
      //promise.all to grab all remote schemas at the same time, we do not care what order they come back but rather just when they finish
      allSchemas = await Promise.all(endpoints.map(ep => getIntrospectSchema(ep)));
      //create function for /graphql endpoint and merge all the schemas
      app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: mergeSchemas({ schemas: allSchemas }) }));
      //start up a graphql endpoint for our main server
      app.listen(PORT, () => console.log('GraphQL API listening on port:' + PORT));
    } catch (error) {
      console.log('ERROR: Failed to grab introspection queries', error);
    }
  })();