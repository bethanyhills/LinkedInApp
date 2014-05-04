
//create namespace
var app = {

//on load, authenticate viewer
onLinkedInLoad: function() {
  IN.Event.on(IN, "auth", app.onLinkedInAuth);
},
 //Runs when the viewer has authenticated
onLinkedInAuth: function() {
  IN.API.Profile("me").fields("first-name", "last-name", "headline", "picture-url", "location", "educations", "num-recommenders", "skills", "interests").result(function(profiles) {
  var person = profiles.values[0];
  console.log(person);
  

  $("#login").append("<h4>Sweet! Scroll down and lets get to know each other</h4>")
  $(".hide").show();
  $("#intro").addClass("hide");

    
  //create model
  app.Profile = Backbone.Model.extend({
    defaults: {
      first: '',
      last: '',
      avatar: '',
      headline: ''
    }
  });
  //instantiate my model with current user data
  var myprofile = new app.Profile({
    first: person.firstName,
    last: person.lastName,
    avatar: person.pictureUrl,
    headline: person.headline
  });

   //create a view to render 
  app.ProfileView = Backbone.View.extend({
    el: $('#container'),
    template: _.template($("#profile").html()),
    initialize: function(){
      this.render();
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
  });

  //create a view to render 
  app.PhotoView = Backbone.View.extend({
    el: $('#avatar'),
    template: _.template($("#photo").html()),
    initialize: function(){
      this.render();
    },
    render: function(){
      this.$el.append(this.template(this.model.toJSON()));
      return this;
    },
  });

  //instantiate the view
  var view = new app.ProfileView({model: myprofile});
  var photoview = new app.PhotoView({model: myprofile});

  }); //close api call
   
  IN.API.Connections("me").result(function(results) {
      var contacts = [];
      var counter = 0;
      
      for (var i in results.values) {

        profile = results.values[i];

          if (!profile.pictureUrl) { profile.pictureUrl = "images/nophoto.jpg"; } 
          var pos = {
            firstName: profile.firstName,
            lastName: profile.lastName,
            pictureUrl: profile.pictureUrl,
            headline: profile.headline,
            industry: profile.industry,
            location: profile.location
          };

          contacts[counter] = pos;
          counter++;
      } //close for loop

    console.log(contacts);

    var Contact = Backbone.Model.extend({
        defaults: {
         }
    });

    var Directory = Backbone.Collection.extend({
        model: Contact
    });

    var ContactView = Backbone.View.extend({
      tagName: "article",
      className: "contact-container",
      template: $("#contactTemplate").html(),

      render: function () {
        var tmpl = _.template(this.template);

        $(this.el).html(tmpl(this.model.toJSON()));
        return this;
      }
      });

    var DirectoryView = Backbone.View.extend({
      el: $("#contacts"),

      initialize: function () {
        this.collection = new Directory(contacts);
        this.render();
      },

      render: function () {
        var that = this;
        _.each(this.collection.models, function (item) {
          that.renderContact(item);
        }, this);
      },

      renderContact: function (item) {
        var contactView = new ContactView({
          model: item
        });
        this.$el.append(contactView.render().el);
      }
    });

  var directory = new DirectoryView();
  });//close api call

}, //close auth
} //close app namespace

//checks if element is on screen
$.fn.isOnScreen = function(){
  
  var win = $(window);
  
  var viewport = {
      top : win.scrollTop(),
      left : win.scrollLeft()
  };
  viewport.right = viewport.left + win.width();
  viewport.bottom = viewport.top + win.height();
  
  var bounds = this.offset();
  bounds.right = bounds.left + this.outerWidth();
  bounds.bottom = bounds.top + this.outerHeight();
  
  return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
  
};

 if ($('#avatar').isOnScreen()) {
    console.log("visible!");
  };

