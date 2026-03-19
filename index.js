const PORT = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://shoaibwalid94_db_user:c715bWphjvcpK5ga@cluster0.fnjlq0j.mongodb.net/?appName=Cluster0");

// API Creation
app.get("/", (req, res) => {
  res.send("Express app is running");
});


app.listen(PORT, (error) => {
  if(!error){
    console.log(`Server running on port ${PORT}`);
  }
  else {
    console.error(`Error: ${error} \n Error Type: ${typeof error}`);
  }
});