const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const mongodb_username = process.env.MONGODB_USERNAME || 'shoaibwalid94_db_user';
const mongodb_password = process.env.MONGODB_PASSWORD || 'c715bWphjvcpK5ga';
const cluster_name = process.env.CLUSTER_NAME || 'Cluster0';
app.use(express.json());
app.use(cors());



// Database Connection with MongoDB
mongoose.connect(`mongodb+srv://${mongodb_username}:${mongodb_password}@cluster0.fnjlq0j.mongodb.net/?appName=${cluster_name}`)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });;

// API Creation
app.get("/", (req, res) => {
  res.send("Express app is running");
});

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`
  });
});

// Schema for creating products
const Product = mongoose.model('Product', {
  id: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  new_price: {
    type: Number,
    required: true,
  },

  old_price: {
    type: Number,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now(),
  },

  available: {
    type: Boolean,
    default: true,
  },
});

app.post('/addproduct', async (req, res) => {
  let products = await Product.find({});
  let id;
  if(products.length > 0){
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  }
  else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});


app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server running on port ${PORT}`);
  }
  else {
    console.error(`Error: ${error} \n Error Type: ${typeof error}`);
  }
});