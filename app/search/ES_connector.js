const ES = require('../../elasticsearch/kafka_elasticsearch_connector')

async function search(branch_name, date) {
    return ES.eSearchAll(ES.indexName(branch_name), date) 
}

module.exports = {
    search: search
}