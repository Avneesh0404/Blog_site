const mongo = require("mongoose");
const comment = new mongo.Schema({
  content: {
    type: String,
    required: true,
  },
  blogid: {
    type: mongo.Schema.Types.ObjectId,
    ref: "blog",
  },
  postby: {
    type: mongo.Schema.Types.ObjectId,
    ref: "user",
  },
},{timestamps:true});
module.exports=mongo.model("comment",comment)
