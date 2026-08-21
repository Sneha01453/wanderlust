// if(process.env.NODE_ENV!="production"){
// require("dotenv").config();
// };
const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

require("dotenv").config();
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const initdata = require("./init/data.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");


//login 
const userRouter = require("./routes/user.js");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";   //localhost db
const db_url = process.env.ATLASDB_URL;
console.log("MongoDB URL exists:", !!db_url);
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(db_url);
}

const store = MongoStore.create({
  mongoUrl: db_url,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,

});
const sessionOptions = {
  store,
  secret:process.env.SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demoUser",async(req,res) =>{
//     let demoUser = new User({
//       email :" student234@gmail.com",
//       username: "first-user"
//     });
//    let registeredUser= await User.register(demoUser,"helloUser");
//    res.send(registeredUser);
// });

// app.get("/", (req, res) => {
//   console.log("Hi..i'm root.");
//   res.send("hi...i'm root");
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.use((req, res, next) => {
  next(new ExpressError(404, "oops! page not found !"));
});



//error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });

  // res.status(statusCode).send(message);
});
app.listen(8080, () => {
  console.log("app is listening");
});