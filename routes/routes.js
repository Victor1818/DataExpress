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
    email: String
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
        session: req.session.name
      });
    });
  };

  exports.register = function (req, res) {
    res.render('register', {
        title: 'Register an Account',
        session: req.session.name
    });
  };
  
  exports.registerPerson = function (req, res) {
    if(email_patt.test(req.body.email)){
      makeHash(req.body.password);

      var person = new Person({
        username: req.body.username,
        age: req.body.age,
        password: myHash,
        email: req.body.email
      });
      person.save(function (err, person) {
        if (err) return console.error(err);
        console.log(req.body.name + ' added');
        
        req.session.name = person.id;
        console.log(req.sessionID);
      });

    }
    res.redirect('/');
  };

  exports.edit = function (req, res) {
    Person.findById(req.params.id, function (err, person) {
      if (err) return console.error(err);
      res.render('edit', {
        title: 'Update Account',
        person: person,
        session: req.session.name
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
        session: req.session.name
      });
    });
  };
  
  exports.loginPerson = function (req, res) {
    Person.findById(req.params.id, function (err, person) {
      if (err) return console.error(err);
      
      makeHash(req.body.password);
     
      bcrypt.compare(person.password, myHash, function(err, res){
        console.log(res);
      });

      person.save(function (err, person) {
        if (err) return console.error(err);
        console.log(req.body.name + ' updated');
        
        req.session.name = person.id;
        console.log(req.sessionID);
      });
    });

    res.redirect('/');
  };

  exports.logout = function (req, res) {
    Person.findByIdAndRemove(req.params.id, function (err, person) {
      if (err) return console.error(err);
      res.redirect('/');
    });
  };
