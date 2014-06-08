function Repos(){

}
//Repos object has a fetch function
Repos.prototype = {
  fetch: function(){
    return $.ajax({
      url: "https://api.github.com/users/ajkim/repos",
      type: "GET"
    })
  }
}

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
  getSize: function(){
    return "Commits: " + this.size;
  },
  getUrl: function(){
    return "URL: " + this.url;
  },
  setName: function(name){
    this.name = name;
  }
}

function Handler(blah){

  
  console.log(template(repos));

}




$(function(){

  var repos = Object.create(Repos.prototype);
  var array = [];
  var response = repos.fetch().done(function(p){

    for(var i = 0; i < p.length; i++) {
      var repo = new Repo(p[i].name, p[i].size, p[i].owner.html_url);

      // $('#theDiv').append(repo.getName());
      // $('#theDiv').append(repo.getSize());
      array.push(repo);

    }
    console.log(array);
    
    var source = $('#this-template').html();
    var template = Handlebars.compile(source);
    var context = { repos : array };
    $('#theDiv').html(template(context));
  
  }).fail(function(){
    alert("error!");
  });


});







