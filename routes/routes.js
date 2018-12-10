var bcrypt = require('bcrypt-nodejs');
var myHash;
var email_patt = /\w+@\w{2,}\.\w{2,}/;

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {

});

var personSchema = mongoose.Schema({
    username: String,
    age: String,
    password: String,
    email: String,
    RPS: String,
    RSA: String,
    NMS: String
  });

  var Person = mongoose.model('People_Collection', personSchema);

  function makeHash(the_str) {
    bcrypt.hash(the_str, null, null, function(err, hash){
      myHash = hash;
    });
  }

  exports.index = function (req, res) {
    Person.find(function (err, person) {
      if (err) return console.error(err);
      res.render('index', {
        title: 'Home',
        people: person,
        session: req.cookies.userID
      });
    });
  };

  exports.register = function (req, res) {
    res.render('register', {
        title: 'Register an Account',
        session: req.cookies.userID
    });
  };
  
  exports.registerPerson = function (req, res) {
    if(email_patt.test(req.body.email)){
      makeHash(req.body.password);

      var person = new Person({
        username: req.body.username,
        age: req.body.age,
        password: myHash,
        email: req.body.email,
        RPS: req.body.RPS,
        RSA: req.body.RSA,
        NMS: req.body.NMS
      });
      person.save(function (err, person) {
        if (err) return console.error(err);
        console.log(req.body.name + ' added');
        
        req.session.name = person.id;
        console.log(req.sessionID);
      });

      res.cookie('userID', person.id);
    }
    res.redirect('/');
  };

  exports.edit = function (req, res) {
    Person.findById(req.params.id, function (err, person) {
      if (err) return console.error(err);
      res.render('edit', {
        title: 'Update Account',
        person: person,
        session: req.cookies.userID
      });
    });
  };
  
  exports.editPerson = function (req, res) {
    Person.findById(req.params.id, function (err, person) {
      if (err) return console.error(err);
      
      if(email_patt.test(req.body.email)){
        makeHash(req.body.password);
        person.username = req.body.username;
        person.age = req.body.age;
        person.password = myHash;
        person.email = req.body.email;
        person.RPS = req.body.RPS;
        person.RSA = req.body.RSA;
        person.NMS = req.body.NMS;
      }
      person.save(function (err, person) {
        if (err) return console.error(err);
        console.log(req.body.name + ' updated');
      });
    });

    res.redirect('/');
  };

  exports.login = function (req, res) {
    Person.findById(req.params.id, function (err, person) {
      if (err) return console.error(err);
      res.render('login', {
        title: 'Login',
        session: req.cookies.userID
      });
    });
  };
  
  exports.loginPerson = function (req, res) {
    var results = mdb.getCollection('People_Collection').find({}).toArray();

    for(var i = 0; i <= results.length -1; i++)
    {
      makeHash(req.body.password);

      var person = results[i];
      
      if(bcrypt.compare(person.password, myHash)) {
     
      // bcrypt.compare(person.password, myHash, function(err, res){
      //   console.log(res);
      // });

        person.save(function (err, person) {
          if (err) return console.error(err);
          console.log(req.body.name + ' updated');
          
          req.session.name = person.id;
          console.log(req.sessionID);
        });

        res.cookie('userID', person.id);

        res.redirect('/');
      }
    }
  };

  exports.logout = function (req, res) {
    Person.findByIdAndRemove(req.params.id, function (err, person) {
      if (err) return console.error(err);
      res.redirect('/');
    });
  };
