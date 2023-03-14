const bigML = require("../../bigML/bigml")

function create_sendResults(data, res){
    function sendResult(results) {
        data['rows'] = results;
        res.render("pages/association", data)
    }
    return sendResult;
} 

function createPredictions(startDate, endDate, sendResult) {
    startDate = Date.parse(startDate +' 00:00:00 GMT')
    endDate = Date.parse(endDate +' 23:59:59 GMT')
    console.log(startDate)
    console.log(endDate)
    if (startDate <= endDate) {
        bigML.createPredictions(startDate,endDate , sendResult)
    }
}

module.exports = {
    create_sendResults: create_sendResults,
    createPredictions:createPredictions
}