require("dotenv").config();
const express = require("express");
const app = express();
const userroute = require("./routes/user");
const editroute = require('./routes/edit')
const PORT = process.env.PORT;
const path = require("path");
const mongo = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkauth } = require("./middleware/auth");
const blogroute = require("./routes/blog");
const Blog = require("./models/blog");
mongo.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB connceted"));

//Server-Side Rendering
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(cookieParser());

//middleware
app.use(checkauth("token"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("./public")));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


//routes
app.get("/", async (req, res) => {
  const allblog = await Blog.find({});
  return res.render("home", {
    user: req.user,
    blog: allblog,
  });
});
app.use("/user", userroute);
app.use("/blog", blogroute);
app.use("/edit",editroute)

app.listen(PORT, () => {
  console.log(`Server Listening on ${PORT}`);
});
