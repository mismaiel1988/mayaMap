var express = require('express');
var app = express();
var bodyParser = require('body-parser')
// mongoose 4.3.x
var mongoose = require('mongoose');
 
 app.use(bodyParser.json())

var Schema = mongoose.Schema

var mongodbUri = 'mongodb://mayapoo:q1w2e3r4@ds011902.mlab.com:11902/mayapoop';

mongoose.connect(mongodbUri);

var db = mongoose.connection;  

PostSchema = new Schema({
  elev: Number,
  lat: Number,
  long: Number,
  address: String,
  time: String
}, { collection : 'locations' });

var Post = mongoose.model('Post', PostSchema);

app.use('piedparker.herokuapp.com', express.static(__dirname + '/public'));

app.post('/update', function(req, res){
  
	console.log('body: ' + JSON.stringify(req.body));
	var mypost = new Post()
    mypost.elev = req.body.elev
		mypost.lat = req.body.lat
		mypost.long = req.body.long
		mypost.address = req.body.address
		mypost.time = req.body.time
		mypost.save(
	  function(err){
	    mypost.save()
	  }
	);

});

app.get("/records", function(req, res) {
    Post.find(function(err, data) {
        if (err) {
            console.log(err);
            return res(err);
        } else {
            console.log(data.toString());
            return res.json(data);
        }
    });
});


// app.get('/records', function(req, res){
// 	var data = db.locations.find();
// 	console.log(data)
// });

app.listen(process.env.PORT || 3000);
