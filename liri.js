require('dotenv').config();
const dataKeys = require("./keys.js");
const fs = require('fs');
const Spotify = require('node-spotify-api');
const request = require('request');
const inquirer = require('inquirer');
const moment = require('moment');

const divider = `======================================`


const questions = [{
    type: 'list',
    name: 'choices',
    message: 'Pick a choice, any choice',
    choices: ['Spotify', 'Movie', 'Bands In Town', 'Do What It Says']
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
    name: 'artistChoice',
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
        bandsInTown(answers.artistChoice);
        break;
      case 'Do What It Says':
        doWhatItSays();
        break;
    };
  });

  const spotifyThis = (songChoice) => {
    let spotify = new Spotify(dataKeys.spotify);
  
    if (!songChoice) {
      songChoice = "Truckin";
    }
  
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
        `${i}
        Artist(s): ${response[i].artists.map(getArtist)}
        Song: ${response[i].name}
        Preview URL: ${response[i].preview_url}
        Album: ${response[i].album.name}
        ${divider}`);
      }
    });
  
  }
  
  const movieThis = (movieName) => {
  
  
    if (!movieName) {
      movieName = "Mr Nobody";
    }
  
    const queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=ee5329ae";
  
    request(queryUrl, function (error, response, body) {
  
      if (!error && response.statusCode === 200) {
        
        console.log(
        `
        Title: ${JSON.parse(body).Title}
        Year: ${JSON.parse(body).Year}
        IMDB Rating: ${JSON.parse(body).imdbRating}
        Country: ${JSON.parse(body).Country}
        Language: ${JSON.parse(body).Language}
        Plot: ${JSON.parse(body).Plot}
        Actors: ${JSON.parse(body).Actors}
        ${divider}`)
      }
    });
  }
  
  const bandsInTown = (artistChoice) => {

    if (!artistChoice) {
      artistChoice = "Weezer";
    }

    const artistUrl = "https://rest.bandsintown.com/artists/" + artistChoice + "/events?app_id=codingbootcamp";
    
    request(artistUrl, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const results = JSON.parse(body);
  
        if (!results[0]) {
          console.log(`No results found`)
          return false;
        }
       
        results.forEach(function (result) {
          console.log(`
    Venue: ${result.venue.name}
    Location: ${result.venue.city}, ${result.venue.region}, ${result.venue.country}
    Date: ${moment(result.datetime, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY")}
    ${divider}`)
        })
  
        
      }
    });
  }
  
  const doWhatItSays = () => {
    fs.readFile("random.txt", "utf8", function (data, songChoice) {
      spotifyThis(songChoice);
    });
  }