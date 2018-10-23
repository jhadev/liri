require('dotenv').config();
const dataKeys = require("./keys.js");
const fs = require('fs');
const Spotify = require('node-spotify-api');
const request = require('request');
const inquirer = require('inquirer');
const moment = require('moment');

const divider = `======================================`

//inquirer questions array

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
//reference array in prompt
inquirer
  .prompt(questions)
  .then(answers => {
    //use switch case to choose which functions to run
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
  //spotify function
  const spotifyThis = (songChoice) => {
  //reference keys
    let spotify = new Spotify(dataKeys.spotify);
  //if there is no song input then default to Truckin
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
    
        response.forEach(function(response) {
        console.log(
        `
        Artist(s): ${response.artists.map(getArtist)}
        Song: ${response.name}
        Preview URL: ${response.preview_url}
        Album: ${response.album.name}
        ${divider}`);
      })
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