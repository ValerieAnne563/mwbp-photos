var express = require('express')
var trails = require('./trails.js')

app = express();
app.use(express.static('public'))

app.get('index');

// process.env.PORT as set by Heroku
var port = process.env.PORT || 8081;
app.listen(port);

app.get('/trails', function(req, res){
  trails.load_all(function(trail_locations){
    res.end(JSON.stringify(trail_locations))
  })
});

app.get('/', function(req, res){
	var locations = [
        {lat: -31.563910, lng: 147.154312},
        {lat: -33.718234, lng: 150.363181},
        {lat: -33.727111, lng: 150.371124},
        {lat: -33.848588, lng: 151.209834},
        {lat: -33.851702, lng: 151.216968},
        {lat: -34.671264, lng: 150.863657},
        {lat: -35.304724, lng: 148.662905},
        {lat: -36.817685, lng: 175.699196},
        {lat: -36.828611, lng: 175.790222},
        {lat: -37.750000, lng: 145.116667},
        {lat: -37.759859, lng: 145.128708},
        {lat: -37.765015, lng: 145.133858},
        {lat: -37.770104, lng: 145.143299},
        {lat: -37.773700, lng: 145.145187},
        {lat: -37.774785, lng: 145.137978},
        {lat: -37.819616, lng: 144.968119},
        {lat: -38.330766, lng: 144.695692},
        {lat: -39.927193, lng: 175.053218},
        {lat: -41.330162, lng: 174.865694},
        {lat: -42.734358, lng: 147.439506},
        {lat: -42.734358, lng: 147.501315},
        {lat: -42.735258, lng: 147.438000},
        {lat: -43.999792, lng: 170.463352}
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