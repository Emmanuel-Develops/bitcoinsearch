const elasticsearch = require("@utils/elasticsearch");
const { buildQuery } = require("@utils/query_builder");
const client = elasticsearch.get()
const logger = require("@utils/logger");
const environment = require("dotenv").config();
const INDEX = environment.parsed.INDEX;

async function search(request, response){
    try {
        let searchString = request.body.searchString;
        let size = request.body.size;
        let from = request.body.from;
        let facets = request.body.facets
        let searchQuery = buildQuery(searchString, facets);

        const result = await client.search({
            index: INDEX,
            body: searchQuery,
            size,
            from
        });
        
        return response.status(200).json({
            success: true,
            data: {
              result
            }
        });

    } catch (error) {

        logger.error({ description: 'Search request failed', error });
    
        return response.status(400).json({
          success: false,
          message: error.errmsg || error.errors || error.message
        });
    }
}

module.exports.search = search;
