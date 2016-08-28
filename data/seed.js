//load file system module
var fs = require('fs');
//file path to CSV file
var input = './data/airports.csv';

var file = fs.readFileSync(input, "utf8");
//synchronously returns content of file and converts buffer to a string
// var file = fs.readFileSync(input).toString();

//creates an array of strings for each line of airport data
var fileRows = file.split('\n');

//converts array to readable JSON
var jsonStr = JSON.stringify(createJSON(fileRows), null, 2);

//save final output as JSON file
fs.writeFileSync('./data/us-airports.json', jsonStr);

//filter airport data to JSON with only US airports that have a code
function createJSON(fileRows) {
  var airportsJson = [];
  for (var i = 0; i < fileRows.length; i++) {
    var airportInfoStr = fileRows[i];
    var airportInfoArr = airportInfoStr.split(',');

    if (airportInfoArr[3] === 'United States' && airportInfoArr[4] !== '') {
      var airportObj = {
        name: airportInfoArr[1],
        city: airportInfoArr[2],
        code: airportInfoArr[4],
        lat: airportInfoArr[6],
        lng: airportInfoArr[7]
      };
      airportsJson.push(airportObj);
    }
  }
  return airportsJson;
}