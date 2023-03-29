const Product = require("../models/product");

// Display list of all Products.
exports.product_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Product list");
};

// Display detail page for a specific Product.
exports.product_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Product detail: ${req.params.id}`);
};

// Display Product create form on GET.
exports.product_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Product create GET");
};

// Handle Product create on POST.
exports.product_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Product create POST");
};

// Display Product delete form on GET.
exports.product_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Product delete GET");
};

// Handle Product delete on POST.
exports.product_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Product delete POST");
};

// Display Product update form on GET.
exports.product_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Product update GET");
};

// Handle Product update on POST.
exports.product_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Product update POST");
};
