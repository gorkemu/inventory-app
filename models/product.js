const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // reference to the associated category
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
});

// Virtual for bookinstance's URL
ProductSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/product/${this._id}`;
});

// Export model
module.exports = mongoose.model("Product", ProductSchema);
