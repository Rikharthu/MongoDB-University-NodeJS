// Get title of a movie from the year 2013 that is rated PG-13 and won no awards
db.movieDetails.find({rated:"PG-13", year:{$gte:2013},"awards.wins":0},{title:1,_id:0}).pretty()
/*
{ "title" : "Woman in Gold" }
{ "title" : "The Woman in Black 2: Angel of Death" }
{ "title" : "A Decade of Decadence, Pt. 2: Legacy of Dreams" }
{ "title" : "Before We Go" }
*/