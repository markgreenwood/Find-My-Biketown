var express = require('express'),
  requestProxy = require('express-request-proxy'),
  port = process.env.PORT || 3000,
  app = express(),
  superagent = require('superagent');

app.use(express.static('./'));
app.get('/googleMaps', proxyGoogle);

function proxyGoogle(request, response) {
  (requestProxy({
    url: 'https://maps.googleapis.com/maps/api/js',
    query: {
      key: process.env.API_KEY,
      libraries: 'places',
      callback: 'initMap'
    }
  }
))(request, response);
};

// work around the issue: the request to http:// biketown api is insecure
app.get('/bikedata', function(request, response){
  // superagent is like $.ajax 
  superagent.get('http://biketownpdx.socialbicycles.com/opendata/station_information.json')
    .end(function(error, res){
      response.json(res.body);
    });
});

app.get('*', function(request, response) {
  console.log('New request:', request.url);
  response.sendFile('index.html', { root: '.' });
});

app.listen(port, function() {
  console.log('Server started on port ' + port + '!');
});
