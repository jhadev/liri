require('dotenv').config();
const dataKeys = require("./keys.js");
const fs = require('fs');
const Spotify = require('node-spotify-api');
const request = require('request');
let inquirer = require('inquirer');


function spotifyThis() {
  console.log("sorry doesn't work yet")
  let spotify = new Spotify(dataKeys.spotify);

}

let movieThis = function (movieName) {


  if (!movieName) {
    movieName = "Mr Nobody";
  }

  const queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=ee5329ae";

  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      // console.log(JSON.parse(body, null, 2));
      console.log(
      `==========
      Title: ${JSON.parse(body).Title}
      Year: ${JSON.parse(body).Year}
      IMDB Rating: ${JSON.parse(body).imdbRating}
      Country of Production: ${JSON.parse(body).Country}
      Language of Movie: ${JSON.parse(body).Language}
      Plot of Movie: ${JSON.parse(body).Plot}
      Actors: ${JSON.parse(body).Actors}
      ==========`)
    }
  });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (data) {
    spotifyThis(data);
  });
}

let questions = [{
    type: 'list',
    name: 'choices',
    message: 'Pick a choice, any choice',
    choices: ['Spotify', 'Movie']
  },
  {
    type: 'input',
    name: 'movieChoice',
    message: 'What movie would you like to search for?',
    when: function (answers) {
      return answers.choices == 'Movie';
    }
  },
  {
    type: 'input',
    name: 'songChoice',
    message: 'What\'s the name of the song you would like?',
    when: function (answers) {
      return answers.choices == 'Spotify';
    }
  }

];

inquirer
  .prompt(questions)
  .then(answers => {

    switch (answers.choices) {
      case 'Spotify':
        spotifyThis(answers.songChoice);
        break;
      case 'Movie':
        movieThis(answers.movieChoice);
        break;
      case 'do-what-it-says':
        doWhatItSays();
        break;
      default:
        console.log("Liri is confused");

    }
  });