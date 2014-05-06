
//on load, render linkedin login
function onLinkedInLoad() {
  IN.Event.on(IN, "auth", onLinkedInAuth);
}
 //Runs when the viewer has authenticated
function onLinkedInAuth() {
  //api call for current user profile data
  IN.API.Profile("me").fields("first-name", "last-name", "headline", "picture-url", "location").result(profileData);
  //api call for current user connection data
  IN.API.Connections("me").fields("first-name", "last-name", "headline", "picture-url", "location", "public-profile-url").result(connectionsData);
  //on auth, create scroll functionality
  $("#login").append("<h1>Login Success! Sweet. Scroll down ...</h1>")
  $(".hide").show();
  $("#intro").addClass("hide");
}

//current user profile data
function profileData(profiles) {
  var person = profiles.values[0];

  //if no photo or location, add these values instead
  if (!person.pictureUrl) { person.pictureUrl = "images/nophoto.jpeg"; }
  if (!person.location.name) { person.location.name = "secret location"; }

  var first = person.firstName;
  var last = person.lastName;
  var avatar = person.pictureUrl;
  var headline = person.headline;
  var location = person.location.name;
  
  //smidge of jQuery to populate current user info within webapp
  $("#avatar").append("<img src="+avatar+">");
  $(".first").text(first);
  $("#name").append("<h2 class='emph'>" + first+ " " + last + ".</h2>");
  $(".headline").text(headline);

  //check if their location is/is not austin, run code accordingly
  var str = location;
  var x = str.indexOf("Austin");
  if (str === "secret location") {
    $('#loc_statement').text("It looks like you keep your location secret on LinkedIn.  Which makes me think you're a spy.  ...Are you a spy?");
  } $('#location h1').last().remove();
  else if (x === -1){
    $('#loc_statement').text("You're from the" + location + "? My best friend's cousins college roommate is from around there!");
  } 
  else {
    $('#loc_statement').text("And I see you live in Austin! Me too!");
    $('#photo').append("<img src='images/austin.jpg'>");
    $('#location').append("<h1>Keep Austin Weird, amaright?</h1>");
  }
}

//Pull current user connections data, use backbone to manage and render
function connectionsData(results) {  
  console.log(results);
  //format data for use in backbone collection
  var connections = [];
  var counter = 0;
  var count = results._count;
  // var count = results._count;
  $("#count").append("<h3>" + count + " to be exact.</h3>");
  
  for (var i in results.values) {

  var profile = results.values[i];
  
  if (!profile.pictureUrl) { profile.pictureUrl = "images/nophoto.jpeg"; } 
  var pos = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    pictureUrl: profile.pictureUrl,
    headline: profile.headline,
    industry: profile.industry,
    location: profile.location,
    profile: profile.publicProfileUrl
  };

  connections[counter] = pos;
  counter++;
  } //close for loop

  //define individual contact model
  var Connection = Backbone.Model.extend({
    defaults: {}
  });
  //define collection for managing contacts
  var Directory = Backbone.Collection.extend({
      model: Connection
  });
  //define view to render individual contacts
  var ConnectionView = Backbone.View.extend({
    tagName: "article",
    className: "contact-container",
    template: $("#contactTemplate").html(),

    render: function () {
      var tmpl = _.template(this.template);

      $(this.el).html(tmpl(this.model.toJSON()));
      return this;
    }
  });
  //define collection view
  var DirectoryView = Backbone.View.extend({
    el: $("#contacts"),

    initialize: function () {
      this.collection = new Directory(connections);
      this.render();
    },

    render: function () {
      var that = this;
      _.each(this.collection.models, function (item) {
        that.renderConnection(item);
      }, this);
    },

    renderConnection: function (item) {
      var contactView = new ConnectionView({
        model: item
      });
      this.$el.append(contactView.render().el);
    }
  });

  //initialize directory view
  var directory = new DirectoryView();

} //close connectionsData




