//on load, authenticate viewer
function onLinkedInLoad() {
  IN.Event.on(IN, "auth", onLinkedInAuth);
}
 //Runs when the viewer has authenticated
function onLinkedInAuth() {
  IN.API.Profile("me").result(function(profiles) {
  person = profiles.values[0];
  console.log(person.firstName);
  
  var app = {}; //create namespace
    
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
    }
  });

  var view = new app.ProfileView({model: myprofile});
  
  }); 

} //close auth function



