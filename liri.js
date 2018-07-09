require("dotenv").config();
var keys = require("./keys");
var request = require("request");
var fs = require("fs");
var node_twitter = require("twitter");
var node_spotify = require("node-spotify-api");

var spotify = new node_spotify(keys.spotify);
var twitter = new node_twitter(keys.twitter);
var arg = process.argv[2];
var userQuery = "";

for(var i = 3; i<process.argv.length; i++) {
    if(i>3 && i<process.argv.length) {
        userQuery = userQuery + "+" + process.argv[i];
    } else {
        userQuery = process.argv[3];
    }
};

switchArg(arg);

// console.log(userQuery);
function switchArg(arg) {
    switch(arg) {
        case "my-tweet":
            getTweets();
            break;
        case "spotify-this-song":
            getSongs(userQuery);
            break;
        case "movie-this":
            getMovies(userQuery);
            break;
        case "do-what-it-says":
            doStuff();
            break;
        default:
            console.log("Invalid argument.");
    };
}


function getTweets() {
    var params = {screen_name: 'DummyXinyi'};
    twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
        console.log(tweets);
        if (!error) {
            if(tweets.length <= 20) {
                for( var j = 0; j < tweets.length; j++) {
                    var date = tweets[j].created_at;
                    console.log("   @DummyXinyi: " + tweets[j].text + " Created At: " + date.substring(0, 19));
                    console.log("       ~*~*~*~*~*~*~*~*~*~*~");
                }
            } else { 
                for( var j = 0; j < 20; j++){
                    var date = tweets[j].created_at;
                    console.log("   @DummyXinyi: " + tweets[j].text + " Created At: " + date.substring(0, 19));
                    console.log("       ~*~*~*~*~*~*~*~*~*~*~");
                }
            };
        } else {
            throw error;
        }
    });
};

function getSongs(userQuery) {
    if(userQuery == "") {
        userQuery = "The Sign Ace of Base";
    };
    spotify.search( 
        { type: 'track',
          query: userQuery,
          limit: 1 },
        function(err, songData) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("   Title:   " + songData.tracks.items[0].name);
                console.log("   Artists:   " + songData.tracks.items[0].artists[0].name);
                console.log("   URL:   " + songData.tracks.items[0].external_urls.spotify);
                console.log("   Title:   " + songData.tracks.items[0].album.name);

            };
        }
    )
};



function getMovies(userQuery) {
    if(userQuery=="") {
        userQuery = "Mr.Nobody";
    }
    request("http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&r=json&apikey=trilogy", function(error, response, data) {
        if(!error && response.statusCode === 200) {
            var movieData = JSON.parse(data);
            console.log("   Movie title:    " + movieData.Title);
            console.log("   Year:   " + movieData.Year);
            console.log("   IMDB rating:    " + movieData.imdbRating);
            console.log("   Country of production:  " + movieData.Country);
            console.log("   Language of movie:  " + movieData.Language);
            console.log("   Movie plot:   " + movieData.Plot);
            console.log("   Actors in the movie:    " + movieData.Actors);
        }
    })
};

function doStuff() {
    fs.readFile("random.txt", "utf8", (err, data) => {
        if (err) {
            throw err;
        } else {
            var dataList = data.split(",");
            // console.log(dataList);
                // console.log(dataList[k]);
            arg = dataList[0];
            userQuery = dataList[1];
            switchArg(arg);
        }
    })
};