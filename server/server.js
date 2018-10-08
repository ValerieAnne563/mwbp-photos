var express = require('express')
var trails = require('./trails.js')

app = express();
app.use(express.static('public'))

app.get('index');

// process.env.PORT as set by Heroku
var port = process.env.PORT || 8081;
app.listen(port);

app.get('/', function(req, res){
	var locations = [
    
        {lng: -106.953405, lat: 39.094387 },
        {lng: -106.97621,  lat: 39.055635 },
        {lng: -107.061588, lat: 39.089718 },
        {lng: -107.0511,   lat: 39.098863 },
        {lng: -106.982591, lat: 39.095804 }
      ]

      trails.load_all(function(trail_lines){
          all_trails = trail_lines

          res.locals = {name: 'Fancy Pants',                        
                        trail_locations: JSON.stringify(all_trails),
                        locations: JSON.stringify(locations),
                        initial_center: JSON.stringify({lat: 39.089864, lng: -107.059379}),
                        initial_zoom: 11,
                        gmaps_api_key: process.env.GMAPS_API_KEY
                      }
          res.render('map.ejs');
      });

});

//404 must be after all url handlers
app.use(function (req, res, next) {
  res.status(404).send("Not all who wander are lost, but there's nothing to find here.")
})