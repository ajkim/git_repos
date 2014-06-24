//Repo constructor function
function Repo(name, size, url) {
  this.name = name;
  this.size = size;
  this.url = url;
}

//Repo object has a getName and setName function
Repo.prototype = {
  fetchOne: $.noop(),
  getName: function(){
    return "Repo: " + this.name;
  },
  fetchCommits: function(){
    return $.ajax({
      url: 'https://api.github.com/repos/ajkim/' + this.name + "/commits",
      type: 'GET'
    }).then(function(commits){
      this.size = commits.length;
      return this;
    }.bind(this));
  },
  getSize: function(){
    return "Commits: " + this.size;
  },
  getUrl: function(){
    return "URL: " + this.url;
  },
  setName: function(name){
    this.name = name;
  }
};

function Repos(){}

//Repos object has a fetch function
Repos.prototype = {
  fetch: function(url){
    return $.ajax({
      url: url,
      type: "GET"
    }).then(function(repos){
      return repos.map(function(r){
        return new Repo(r.name, r.size, r.url);
      });
    });
  },
  updateStatus: function(){
    $('#status').html('Done...');
  }
}

function RepoView(model) {
  this.model = model;
}

RepoView.prototype = {
  render: function(){
    var source = $('#this-template').html();
    var template = Handlebars.compile(source);
    var context = { repos : this.model };
    $('#theDiv').html(template(context));
  }
}

function RepoController() {}

RepoController.prototype = {
  run: function(url) {
    var repos = Object.create(Repos.prototype);
    repos.on("finished", repos.updateStatus);

    url = url || "https://api.github.com/users/ajkim/repos";

    repos.fetch(url).done(function(array){

      var promises = [];

      array.forEach(function(repo){
        promises.push(repo.fetchCommits());
      });

      $.when.apply(null, promises)

        .done(function(){

          var view = new RepoView(arguments);
          view.render()
          repos.trigger("finished");

        })
        .fail(function(err){
          alert('Error: ' + err.message);
        });
    });
  }
}

var Evented = {
    listeners: {
      // finished: [updateStatus, anotherFunc]
    },
    on: function(name, func) {
        if (!this.listeners[name]) {
      this.listeners[name] = [];
        }

        this.listeners[name].push(func);
    },

    trigger: function(name, second, third) {
        // arguments = {0: name, 1: 1, 2: 2, length: 3}
      var args = Array.prototype.slice.call(arguments, 1);

      for(var i = 0; i < this.listeners[name].length; i ++) {
        var funcToCall = this.listeners[name][i];
        funcToCall.apply(this, args);
        }
    },

    off: function(name) {
      this.listeners[name] = null;
    }
}

$.extend(Repo.prototype, Evented);
$.extend(Repos.prototype, Evented);


$(function(){

  var controller = Object.create(RepoController.prototype);
  controller.run()



});







