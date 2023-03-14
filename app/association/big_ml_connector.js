const bigML = require("../../bigML/bigml")

function create_sendResults(data, res){
    function sendResult(results) {
        data['rows'] = results;
        res.render("pages/association", data)
    }
    return sendResult;
} 

function createPredictions(startDate, endDate, sendResult) {
    bigML.createPredictions(Date.parse(startDate +' 00:00:00 GMT'), Date.parse(endDate +' 23:59:59 GMT'), sendResult)
}

module.exports = {
    create_sendResults: create_sendResults,
    createPredictions:createPredictions
}