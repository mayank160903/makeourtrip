const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const fs = require("fs");
const mime = require('mime-types');
const multer = require("multer");
const nodemailer = require('nodemailer');

const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');

const UserModel = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");

require("dotenv").config();
const app = express();


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "oiuytrdxcvbnjkiuytrews";
const bucket = 'booking-app-mayank'

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));


app.use(
  cors({
    credentials: true,
    origin: "https://makeourtrip-rho.vercel.app",
  })
);

app.options('*', cors({
    origin: 'https://makeourtrip-rho.vercel.app',
    credentials: true
})); 

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://makeourtrip-rho.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});



async function uploadToS3(path, originalFileName, mimetype) {
    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCES_KEY,
        },
    });
    const parts = originalFileName.split('.');
    const ext = parts[parts.length - 1];
    const newFileName = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFileName,
        ContentType: mimetype,
        ACL: 'public-read',
    }));
    return `https://${bucket}.s3.amazonaws.com/${newFileName}`
}

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
    const token = req.headers['authorization'] || req.query.token || req.body.token;
    console.log(token);
      if (!token) {
        return reject(new Error('Token not provided'));
      }
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) {
          return reject(err);
        }
        resolve(userData);
      });
    });
  }
  
app.get("/test", (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

  res.json("test ok");

});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  const sendVerificationEmail = (email, otp) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Your OTP for email verification is: ${otp}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        
        console.log('Email sent: ' + info.response);
      }
    });
  };

app.post("/register", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { name, email, number, password } = req.body;
    try {
      const otp = generateOTP();
      const userDoc = await UserModel.create({
        name,
        email,
        number,
        password: bcrypt.hashSync(password, bcryptSalt),
        otp,
        verified: false,
      });
      sendVerificationEmail(email, otp);
  
      res.json({ message: "Registration successful. Please check your email for the OTP.", userId: userDoc._id });
    } catch (err) {
      res.status(422).json(err);
    }
});

app.post("/verify-email", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { userId, otp } = req.body;
    try {
      const user = await UserModel.findById(userId);
      if (user.otp === otp) {
        user.verified = true;
        user.otp = null;
        await user.save();
        res.json({ message: "Email verified successfully." });
      } else {
        res.status(400).json({ message: "Invalid OTP." });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error." });
    }
});


app.post("/login", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

  const { email, password } = req.body;
  const userDoc = await UserModel.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});


app.get("/profile", (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

  const { token } = req.cookies;
//   console.log({token});
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await UserModel.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { link } = req.body;
    const newName = "photo" + Date.now() + ".jpg";
    try {
        const { filename, image } = await imageDownloader.image({
            url: link,
            dest: '/tmp/' + newName,
        });
        const mimetype = mime.lookup(filename);

        if (!mimetype) {
            throw new Error('Unable to determine mime type');
        }

        const url = await uploadToS3(filename, newName, mimetype);
        res.json(url);
    } catch (error) {
        console.error('Error downloading image:', error);
        res.status(500).json({ error: 'Failed to download image' });
    }
});


const photosMiddleware = multer({dest: '/tmp'});
app.post("/upload", photosMiddleware.array('photos', 100) ,async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});


app.post("/places", (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    addLink,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      addLink,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { token } = req.cookies;
  
  // Check if the token exists
  if (!token) {
      return res.status(401).json({ error: "Token missing or invalid" });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
          // Handle token verification error
          return res.status(403).json({ error: "Token is invalid or expired" });
      }

      const { id } = userData;  // This will now safely destructure
      try {
          const places = await Place.find({ owner: id });
          res.json(places);
      } catch (error) {
          // Handle any database errors
          res.status(500).json({ error: "Database query failed" });
      }
  });
});

app.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { id } = req.params;
  try {
      const place = await Place.findById(id);
      if (!place) {
          return res.status(404).json({ error: "Place not found" });
      }
      res.json(place);
  } catch (error) {
      // Handle any database or request errors
      res.status(500).json({ error: "Database query failed" });
  }
});


app.post("/places", (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, jwtSecret, async (err, userData) => {
        if (err) return res.status(401).json({ error: "Invalid token" });

        const {
            title,
            address,
            addedPhotos,
            description,
            perks,
            addLink,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,
        } = req.body;

        try {
            const placeDoc = await Place.create({
                owner: userData.id,
                title,
                address,
                addedPhotos,
                description,
                perks,
                addLink,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price,
            });

            res.json(placeDoc);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});


app.get("/places", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const {query} = req.query;
    let places;
    if (query) {
        const searchRegex = new RegExp(query, 'i'); // 'i' for case-insensitive
        places = await Place.find({
            $or: [
                { title: { $regex: searchRegex } },
                { address: { $regex: searchRegex } }
            ]
        });
    } else {
        places = await Place.find();
    }
    res.json(places);
});



app.post("/bookings", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userData = jwt.verify(token, jwtSecret);
        const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;

        const booking = await Booking.create({
            place,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
            user: userData.id,
        });

        res.json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.get('/bookings', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.json("No token");
        }

        const userData = jwt.verify(token, jwtSecret);
        const bookings = await Booking.find({ user: userData.id }).populate('place');

        res.json(bookings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



app.listen(4000);


