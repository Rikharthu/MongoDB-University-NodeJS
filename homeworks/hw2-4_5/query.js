// How many documents in our video.movieDetails collection list just the following two genres: "Comedy" and "Crime" with "Comedy" listed first.
db.movieDetails.find({genres:["Comedy","Crime"]}).count()

// As a follow up to the previous question, how many documents in the video.movieDetails collection list both "Comedy" and "Crime" as genres regardless of how many other genres are listed?
db.movieDetails.find({genres:{$all:["Comedy","Crime"]}}).count()