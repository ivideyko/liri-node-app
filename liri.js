require('dotenv').config();
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');    
var fs = require('fs');
var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var param = process.argv[3];

runCommand();


/////////////////////////////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////////////////////////////

function runCommand() {

    switch (command) {

        case "my-tweets":
            getTweets();
            break;

        case "spotify-this-song":
            getSong();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhatItSays();
            break; 

        default:
            console.log("\n");
            console.log("Invalid command");
            console.log("\n");
            console.log("Valid commands:");
            console.log("    my-tweets");
            console.log("    spotify-this-song 'song name'");
            console.log("    movie-this 'movie title'");
            console.log("    do-what-it-says");
    }
}

function getTweets () {

    var params = {screen_name: 'unh_ivideyko'};

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log("\n");
            console.log("--------------------------------------------------");
            console.log("MY TWITTER FEED");
            console.log("--------------------------------------------------");

            tweets.forEach(function(element) {
                console.log("\n");
                console.log(element.created_at);
                console.log("--------------------------------------------------");
                console.log(element.text);
            });
        }
    });
}
 
function getSong () {

    if (!param) {param = "The Sign";}

    spotify.search({ type: 'track', query: param, limit: 1}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        var track = data.tracks.items[0];
        var artists = track.artists;
        var song = track.name;
        var link = track.external_urls.spotify;
        var album = track.album.name;
        
        console.log("\n");
        console.log("--------------------------------------------------");
        console.log("SONG SEARCH");
        console.log("--------------------------------------------------");

        // display song info
        console.log("Artist(s):")
        artists.forEach(function (element) {
            console.log("    " + element.name);
        });
        console.log(`Song: ${song}`);
        console.log(`Album: ${album}`);
        console.log(`Link: ${link}`);
        console.log("\n");
      });
}

function getMovie () {

    if (!param) {param = "Mr. Nobody";}

    request("http://www.omdbapi.com/?t=" + param + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
            var title = movie.Title;
            var year = movie.Year;
            if (movie.Ratings[0]) {
                var imdbRating = movie.Ratings[0].Value;
            }
            if (movie.Ratings[1]) {
                var rottenRating = movie.Ratings[1].Value;
            }
            var country = movie.Country;
            var language = movie.Language;
            var plot = movie.Plot;
            var actors = movie.Actors;

            console.log("\n");
            console.log("--------------------------------------------------");
            console.log("MOVIE SEARCH");
            console.log("--------------------------------------------------");
            console.log(`Title: ${title}`);
            console.log(`Year: ${year}`);
            if (imdbRating) {
                console.log(`IMDB Rating: ${imdbRating}`);
            }
            if (rottenRating) {
                console.log(`Rotten Tomatoes Rating: ${rottenRating}`);
            }
            console.log(`Country: ${country}`);
            console.log(`Language: ${language}`);
            console.log(`Plot: ${plot}`);
            console.log(`Actors: ${actors}`);
            console.log("\n");
        }
    });
}

function doWhatItSays () {

    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        // re-assign command and param from text file
        command = dataArr[0];
        param = dataArr[1];
        
        runCommand();
    });
}