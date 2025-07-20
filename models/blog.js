const mongo = require("mongoose");
const blogSchema = new mongo.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  coverimg: {
    type: String,
  },
  createdby: {
    type: mongo.Schema.Types.ObjectId,
    ref:"user"
  },
},{timestamps:true});
module.exports = mongo.model("blog",blogSchema)
