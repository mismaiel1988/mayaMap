var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
 
app.use(bodyParser.json())

var Schema = mongoose.Schema

var mongodbUri = 'mongodb://mayapoo:q1w2e3r4@ds011902.mlab.com:11902/mayapoop';

mongoose.connect(mongodbUri);

var db = mongoose.connection;  

PostSchema = new Schema({
  userId: String,
  elev: Number,
  lat: Number,
  long: Number,
  address: String,
  time: String
}, { collection : 'locations' });

var Post = mongoose.model('Post', PostSchema);

app.use('piedparker.herokuapp.com', express.static(__dirname + '/public'));

app.post('/update', function(req, res){
  
	
	var mypost = new Post()
    mypost.userId = req.body.userId;
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

  res.send(JSON.stringify({id:mypost.id}));

});

app.post('/delete', function(req, res){
  var id = req.body.id;
  console.log('id is: '+id);
  Post.findByIdAndRemove(id).exec();
  var deleted=  true;
/*  
  var post = Post.find({id: id});
  if(post.remove())
    deleted = true;
  else 
    deleted = false;
*/
    res.send( JSON.stringify({success: deleted}));
});

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.get('/newUser', function(req, res){
  res.sendFile(path.join(__dirname+'/public/new.html'));
});

UserSchema = new Schema({
  username: String,
  password: String
}, { collection : 'users' });

var User = mongoose.model('User', UserSchema);

app.post('/new', function(req, res){
  var username1 = req.body.username
  ,   password1 = req.body.password
  
    var newUser = new User()
      newUser.username = username1
      newUser.password = password1
      newUser.save(
      function(err){
        newUser.save()
      }
    );

  console.log("new account created");
 
 res.json(newUser);
});

app.post('/login', function(req, res){
  var username1 = req.body.username
  ,   password1 = req.body.password
  var userAccount = User.findOne({username: username1, password: password1}, function(err, data) {
    if(err){
      res.send(JSON.stringify({success: false}));
    }
    else {
        res.send(JSON.stringify({success: true, userId: data.id}));
    }
  })
});

app.get("/records", function(req, res) {
       Post.find({userId : req.query.userId},function(err, data) {
        if (err) {
            console.log('error'+err);
            return res(err);
        } else {
            //console.log('data: '+data.toString());
            return res.json(data);
        }
    });
});

// app.get('/records', function(req, res){
// 	var data = db.locations.find();
// 	console.log(data)
// });

app.listen(process.env.PORT || 3000);
