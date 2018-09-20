const fetch = require('node-fetch');
const { makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools');
const { createHttpLink } = require('apollo-link-http');

module.exports = {
	getIntrospectSchema: async (url) => {
		// Create a link to a GraphQL instance by passing fetch instance and url
		const serviceLink = () => createHttpLink({
			uri: url,
			fetch
		});

		// Fetch our schema
		const schemaDefinition = await introspectSchema(serviceLink());

		// make an executable schema
		return makeRemoteExecutableSchema({
			schema: schemaDefinition,
			link: serviceLink()
		});
	}
};