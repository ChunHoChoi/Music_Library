// import express into this file
const { kStringMaxLength } = require('buffer');
const express = require('express');
const mongoose = require('mongoose');


// initialize an instance of express
const app = express();
const path = require("path");

// define the port that the web server should run on
const port = 3000;
app.use(express.urlencoded({ extended: true }));
const mongoURI
= "mongodb+srv://GBC_Learn:GBC_Learn@atlascluster.gpospvj.mongodb.net/?retryWrites=true&w=majority"
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
 };
 
app.set("view engine", "ejs");

// Connect to MongoDB
const connectToDatabase = async () => {
    try {
      await mongoose.connect(mongoURI, mongoOptions);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  };
 
const MusicSchema = new mongoose.Schema ({
    id: Number, 
    Title: String, 
    Artist: String, 
    img: String, 
});
const Musiclist = mongoose.model("Music_lists" , MusicSchema);

const Playlists = mongoose.model("Playlists", MusicSchema)

// Create a route
// url endpoint = "/"
// http://localhost:3000/
app.get('/', async (req, res) => {
   console.log("Request received at the / endpoint")
   try {
    const results = await Musiclist.find();
    const playlists = await Playlists.find();
    return res.render("Playlist.ejs",{Musiclists:results, Playlists:playlists});
   } catch (err) {
    console.log("Error")
    return res.send ("Error")
   }
   
})

app.post('/AddSongToPlaylist/:SongID', async (req, res) => {
    console.log("Post request at the /AddSongToPlaylist endpoint")
    const SongID = req.params.SongID
    try {
    const songtoadd = await Musiclist.find({_id:`${SongID}`})
    const playlistsongdata = {
    Title: songtoadd[0].Title, 
    Artist: songtoadd[0].Artist,
    img: songtoadd[0].img

    }    
    const playlistadd = new Playlists(playlistsongdata)
    const savedtoplaylist = await playlistadd.save();
    console.log("Song Added:")
    console.log(savedtoplaylist)
    return res.redirect("/")
    } catch (err) {
    console.log("Error adding song to playlist")
    return res.send ("Error adding song to playlist")
    }

})

app.post('/RemoveSongFromPlaylist/:SongID', async (req,res) => {
    console.log("Post request at the /RemoveSongToPlaylist endpoint")
    const SongID= req.params.SongID
    try { 
        const songtoremove = await Playlists.find({_id:`${SongID}`})
        console.log("Song to Remove:")
        console.log(songtoremove)
        const removesong = await Playlists.findByIdAndDelete({_id:`${SongID}`})
        console.log("Song Deleted")
        return res.redirect("/")
    }catch (err) {
    console.log("Error removing song from playlist")
    return res.send ("Error removing song from playlist")
    }

})

app.post('/add', async (req, res) => {
    console.log("Post request at the /add endpoint")
    const newsongdata ={
    Title: req.body.newsongname,
    Artist: req.body.newsongartist, 
    img: req.body.newsongimg
    }
    console.log("New Song Data:")
    console.log(newsongdata)
    const Musictoadd = new Musiclist(newsongdata)
    try {
        const newmusic = await Musictoadd.save();
        console.log("song added:")
        console.log(newmusic)
        return res.redirect("/")
    } catch(err){
        console.log("Error adding song")
        return res.send ("Error adding song")
    }
})



// Start the server
app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
   console.log("I am running forever until you manually stop me")  
   console.log("To manually stop me, press CTRL + C in the terminal")
    // after server starts, attempt to connect to database   
    connectToDatabase()
});
