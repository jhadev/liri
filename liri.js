require('dotenv').config();
const dataKeys = require("./keys.js");
const fs = require('fs');
const Spotify = require('node-spotify-api');
const request = require('request');
const inquirer = require('inquirer');

//spotify function

let spotifyThis = function (songChoice) {
  let spotify = new Spotify(dataKeys.spotify);

  spotify.search({
    type: 'track',
    query: songChoice
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    const getArtist = function (artist) {
      return artist.name;
      };

    const response = data.tracks.items;
  
    for (var i = 0; i < response.length; i++) {
      console.log(
      `==========
      ${i}
      Artist(s): ${response[i].artists.map(getArtist)}
      Song: ${response[i].name}
      Preview URL: ${response[i].preview_url}
      Album: ${response[i].album.name}
      ==========`);
    }
  });

}

let movieThis = function (movieName) {


  if (!movieName) {
    movieName = "Mr Nobody";
  }

  const queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=ee5329ae";

  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      
      console.log(
      `==========
      Title: ${JSON.parse(body).Title}
      Year: ${JSON.parse(body).Year}
      IMDB Rating: ${JSON.parse(body).imdbRating}
      Country: ${JSON.parse(body).Country}
      Language: ${JSON.parse(body).Language}
      Plot: ${JSON.parse(body).Plot}
      Actors: ${JSON.parse(body).Actors}`)
    }
  });
}

let bandsInTown = function (artist) {


  const artistUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  console.log("this doesn't work")
 // request(artistUrl, function (error, response, body) {

  //});
}


let doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function (data) {
    spotifyThis(data);
  });
}

let questions = [{
    type: 'list',
    name: 'choices',
    message: 'Pick a choice, any choice',
    choices: ['Spotify', 'Movie', 'Bands In Town']
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
    message: 'What song would you like to search for?',
    when: function (answers) {
      return answers.choices == 'Spotify';
    }
  },
  {
    type: 'input',
    name: 'bandChoice',
    message: 'What artist would you like to search for?',
    when: function (answers) {
      return answers.choices == 'Bands In Town';
    }
  },

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
      case 'Bands In Town':
        bandsInTown(answers.bandChoice);
        break;
      case 'Do What It Says':
        doWhatItSays();
        break;
      default:
        console.log("Liri is confused");

    }
  });