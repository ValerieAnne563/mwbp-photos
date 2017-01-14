var path = require('path')
var fs = require('fs')
var _ = require('underscore')

const logger = require('log4js').getLogger();

format_linestring = function(ls_coordinates){
  logger.debug("Adding line with " + ls_coordinates.length + " points.")
  return _.map(ls_coordinates, function(point){
    {return {lat: point[1], lng: point[0]}}
  })
}

extract_feature = function(feature){
  linestrings = feature["geometry"]["coordinates"] //TODO Don't assume it's a MultiLineString
  return _.map(linestrings, format_linestring)
}

load_file = function(filename, callback){
  fs.readFile(filename, function when_read(error, data){
    if (error != null){
      logger.error("Unable to load file from " + filename + "due to error.")
      callback("[]")
    }
    else{
      features = JSON.parse(data)["features"]
      paths = _.chain(features).map(extract_feature).flatten(true).value()
      logger.debug("Extracted " + paths.length + " paths")

      callback(paths)

    }
  })
}

exports.load_all = function(callback){
    file = path.join(__dirname, "/resources/maroon_bells_trails/2016-08-17-0832.geojson")
    load_file(file, function(response){
    callback(response)
  });

}