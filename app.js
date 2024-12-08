if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const { storage } = require('./Cloudinary');
const upload = multer({ storage });
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user');
const Staycity = require('./model/staycity');
const Beach = require('./model/beaches');
const Hillstation = require('./model/hillstations')
const Adventure = require('./model/adventure')
const Heritage = require('./model/heritage');
const Pilgrimage = require('./model/pilgrimage')
const Hotel = require('./model/hotel');
const Review = require('./model/review');
const Room = require('./model/room')
const Book = require('./model/book')
const ExpressError = require('./utils/ExpressError');
const storeReturnTo = require('./middleware');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Advetour');
  console.log("Database connected");
}

const app = express();

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'thisshouldbebettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/home', async (req, res) => {
  const staycities = await Staycity.find({});
  const beaches = await Beach.find({});
  const Hillstations = await Hillstation.find({});
  const adventures = await Adventure.find({});
  const heritages = await Heritage.find({});
  const pilgrimages = await Pilgrimage.find({});
  res.render('home', { staycities, beaches, Hillstations, adventures, heritages, pilgrimages });
});

app.get('/staycities/:id', async (req, res) => {
  const staycity = await Staycity.findById(req.params.id).populate('hotels');
  res.render('staycities/show', { staycity });
});

app.post('/staycities/uprequest/:id', upload.array('image'), async (req, res) => {
  try {
    const staycityId = req.params.id;
    const staycity = await Staycity.findById(staycityId);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    staycity.images = imgs;
    await staycity.save();

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/staycities/delete/:id', async (req, res) => {
  try {
    const staycityId = req.params.id;
    const staycity = await Staycity.findById(staycityId);
    const staycities = await Staycity.find({});

    const idx = staycities.indexOf(staycity);
    delete staycities[idx];
    console.log("deleted")
    await Staycity.deleteOne({ _id: staycity._id });
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
})


// Beaches routes
app.get('/beaches/:id', async (req, res) => {
  const beach = await Beach.findById(req.params.id);
  res.render('beaches/show', { beach });
});

app.post('/beaches/uprequest/:id', upload.array('image'), async (req, res) => {
  try {
    const beachId = req.params.id;
    const beach = await Beach.findById(beachId);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    beach.images = imgs;
    await beach.save();

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/beaches/delete/:id', async (req, res) => {
  try {
    const beachId = req.params.id;
    const beach = await Beach.findById(beachId);
    const beaches = await Beach.find({});

    const idx = beaches.indexOf(beach);
    delete beaches[idx];
    console.log("deleted");
    await Beach.deleteOne({ _id: beach._id });
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Hillstations routes
app.get('/hillstations/:id', async (req, res) => {
  const hillstation = await Hillstation.findById(req.params.id);
  res.render('hillstations/show', { hillstation });
});

app.post('/hillstations/uprequest/:id', upload.array('image'), async (req, res) => {
  try {
    const hillstationId = req.params.id;
    const hillstation = await Hillstation.findById(hillstationId);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hillstation.images = imgs;
    await hillstation.save();

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/hillstations/delete/:id', async (req, res) => {
  try {
    const hillstationId = req.params.id;
    const hillstation = await Hillstation.findById(hillstationId);
    const hillstations = await Hillstation.find({});

    const idx = hillstations.indexOf(hillstation);
    delete hillstations[idx];
    console.log("deleted");
    await Hillstation.deleteOne({ _id: hillstation._id });
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to show a specific adventure
app.get('/adventures/:id', async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);
    res.render('adventures/show', { adventure });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to upload images for a specific adventure
app.post('/adventures/uprequest/:id', upload.array('image'), async (req, res) => {
  try {
    const adventureId = req.params.id;
    const adventure = await Adventure.findById(adventureId);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    adventure.images = imgs;
    await adventure.save();

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to delete a specific adventure
app.post('/adventures/delete/:id', async (req, res) => {
  try {
    const adventureId = req.params.id;
    const adventure = await Adventure.findById(adventureId);
    await Adventure.deleteOne({ _id: adventure._id });
    console.log("deleted");

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


// Route to show a specific heritage
app.get('/heritages/:id', async (req, res) => {
  try {
    const heritage = await Heritage.findById(req.params.id);
    res.render('heritages/show', { heritage });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to upload images for a specific heritage
app.post('/heritages/uprequest/:id', upload.array('image'), async (req, res) => {
  try {
    const heritageId = req.params.id;
    const heritage = await Heritage.findById(heritageId);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    heritage.images = imgs;
    await heritage.save();

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to delete a specific heritage
app.post('/heritages/delete/:id', async (req, res) => {
  try {
    const heritageId = req.params.id;
    const heritage = await Heritage.findById(heritageId);
    await Heritage.deleteOne({ _id: heritage._id });
    console.log("deleted");

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


// Route to get a specific pilgrimage by ID
app.get('/pilgrimages/:id', async (req, res) => {
  try {
    const pilgrimage = await Pilgrimage.findById(req.params.id);
    res.render('pilgrimages/show', { pilgrimage });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to upload images for a specific pilgrimage
app.post('/pilgrimages/uprequest/:id', upload.array('image'), async (req, res) => {
  try {
    const pilgrimageId = req.params.id;
    const pilgrimage = await Pilgrimage.findById(pilgrimageId);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    pilgrimage.images = imgs;
    await pilgrimage.save();

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to delete a specific pilgrimage
app.post('/pilgrimages/delete/:id', async (req, res) => {
  try {
    const pilgrimageId = req.params.id;
    const pilgrimage = await Pilgrimage.findById(pilgrimageId);
    await Pilgrimage.deleteOne({ _id: pilgrimage._id });
    console.log("deleted");

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/hotels/:id', async (req, res) => {

  const hotel = await Hotel.findById(req.params.id).populate('staycity').populate('reviews').populate('rooms');
  res.render('hotel/show', { hotel });
})


app.get('/hotels/add/:id', async (req, res) => {
  const staycity = await Staycity.findById(req.params.id);
  res.render('staycities/Addhotel', { staycity });
});

app.post('/hotels/add/:id', upload.array('image'), async (req, res) => {

  const staycity = await Staycity.findById(req.params.id);
  const hotel = new Hotel(req.body.hotel);



  const geodata = await geocoder.forwardGeocode({
    query: hotel.address,
    limit: 1
  }).send();

  hotel.geometry = geodata.body.features[0].geometry;



  hotel.staycity = staycity._id;
  hotel.owner = req.user._id;


  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  hotel.images.push(...imgs);
  console.log(hotel)
  await hotel.save();
  staycity.hotels.push(hotel);
  await staycity.save();
  req.flash('success', `Successfully added hotel`);
  res.redirect(`/staycities/${staycity._id}`);
});

app.get('/hotels/edit/:stayId/:hotelId', async (req, res) => {
  const staycity = await Staycity.findById(req.params.stayId);
  const hotel = await Hotel.findById(req.params.hotelId);
  res.render('staycities/Edithotel', { staycity, hotel });
});

app.post('/hotels/edit/:stayId/:hotelId', async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.hotelId, { ...req.body.hotel }, { new: true, runValidators: true });
  req.flash('success', 'Successfully updated campground!');
})

app.post('/hotels/delete/:id', async (req, res) => {
  try {

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      req.flash('error', 'Hotel not found!');
      return res.redirect('/error');
    }


    const staycityId = hotel.staycity;


    await Hotel.findByIdAndDelete(req.params.id);


    await Staycity.findByIdAndUpdate(staycityId, { $pull: { hotels: req.params.id } });

    req.flash('success', 'Successfully deleted hotel and associated stay records!');
    res.redirect(`/staycities/${staycityId}`);
  } catch (error) {
    req.flash('error', 'An error occurred while deleting the hotel.');
    res.redirect('/error');
  }
});



app.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { email, username, password, userType } = req.body;
    const photo = req.file;
    const user = new User({ email, username, userType, image: { url: photo.path, filename: photo.filename } });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', `Welcome to Advetour, ${username}`);
      res.redirect('/home');
    });
  } catch (e) {
    if (e.code === 11000) {
      e.message = `${req.body.email} is already registered`;
    }
    req.flash('error', e.message);
  }
});

app.post('/login', (req, res, next) => {
  console.log('Request body:', req.body); // Debug log
  next();
}, passport.authenticate('local', {
  failureRedirect: '/home',
  failureFlash: true
}), (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectUrl = req.session.returnTo || '/home';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
});


app.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/home');
  });
});

app.get('/hotel/:hotelId/rooms/add',async (req,res)=>{
   const hotel = await Hotel.findById(req.params.hotelId);
   res.render('hotel/rooms',{hotel})
})


app.post('/hotels/:hotelId/rooms/add', upload.array('image'), async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId);
  const room = new Room(req.body.room);
  
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  room.images.push(...imgs);
  

  await room.save();
  
  hotel.rooms.push(room);
  await hotel.save();
  req.flash('success', 'Successfully added room');
  res.redirect(`/hotels/${hotel._id}`);
});





app.post('/reviews/:id', async (req, res) => {
  let hotel = await Hotel.findById(req.params.id);
  let Excellent=0;
  let very_good=0;
  let average=0;
  let poor=0;
  let bad=0;

  if (!hotel) {
    req.flash('error', 'Hotel not found!');
    return res.redirect('/hotels');
  }

  let reviewObject = req.body.review;
  
  if (typeof reviewObject === 'object' && reviewObject !== null) {
    const date = new Date();
    reviewObject.date = date.toISOString(); 
    const sumOfRatings =
      parseInt(reviewObject.locationrating) +
      parseInt(reviewObject.roomrating) +
      parseInt(reviewObject.foodrating) +
      parseInt(reviewObject.cleanlinessrating) +
      parseInt(reviewObject.valueformoneyrating);


    const averageRating = sumOfRatings / 5;

    reviewObject.rating = Math.floor(averageRating);
  }
  else {
    req.flash('error', 'Invalid review data!');
    return res.redirect(`/hotels/${req.params.id}`);
  }
  const review = new Review(reviewObject);
  await review.save();

  

  if(review.rating > 4 ){
    Excellent++;
    hotel.excellent=Excellent;
  }
  if(review.rating <= 4 && review.rating >3){
    very_good++;
    hotel.v_good=very_good;
  }
  if(review.rating <= 3 && review.rating >2){
    average++;
    hotel.average=average;
  }
  if(review.rating <= 2 && review.rating >1){
    poor++;
    hotel.poor=poor;
  }
  if(review.rating <=1){
    bad++;
    hotel.bad=bad;
  }

  hotel.reviews.push(review._id);
  await hotel.save();

  req.flash('success', 'Review added successfully!');
  res.redirect(`/hotels/${hotel._id}`);

})


app.post('/hotel/:hotelId/room/:roomId/booking',async (req, res) => {
  const { hotelId, roomId } = req.params;
  const { checkin, checkout, people } = req.body.book;
  const room=await Room.findById(roomId);
  const h=await Hotel.findById(hotelId);

 
  let book=req.body.book;

  const payment=parseInt((1.12)*(book.people)*(room.price)) ;
  const hotel=h.title;

  book.payment=payment;
  book.hotel=hotel;

  req.user.Booking.push(book)

  await req.user.save();

  res.redirect('/home')
 
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render('error', { status, message });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
