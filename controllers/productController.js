const Product = require("../models/product");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");

// Display list of all Products.
exports.product_list = async function (req, res, next) {
  try {
    const list_products = await Product.find().exec();
    res.render("product_list", {
      title: "Products",
      product_list: list_products,
    });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific Product.
exports.product_detail = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .exec();
    if (product == null) {
      const err = new Error("Product not found");
      err.status = 404;
      return next(err);
    }
    res.render("product_detail", {
      title: `Category: ${product.category.name}`,
      product,
    });
  } catch (err) {
    return next(err);
  }
};

// Display Product create form on GET.
exports.product_create_get = async (req, res, next) => {
  try {
    const categories = await Category.find({}, "name").exec();
    res.render("product_form", {
      title: "Add Product",
      category_list: categories,
    });
  } catch (err) {
    next(err);
  }
};

// Handle Product create on POST.

exports.product_create_post = [
  // Validate and sanitize fields.
  body("category", "Category must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("name", "Name must be specified").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped and trimmed data.
    const product = new Product({
      category: req.body.category,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      image: undefined === req.file ? "" : req.file.filename,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.
      try {
        const categories = await Category.find({}, "name").exec();
        // Successful, so render.
        res.render("product_form", {
          title: "Create Product",
          category_list: categories,
          selected_category: product.category._id,
          errors: errors.array(),
          product,
        });
      } catch (err) {
        return next(err);
      }
      return;
    }

    // Data from form is valid.
    try {
      await product.save();
      // Successful: redirect to new product.
      res.redirect(product.url);
    } catch (err) {
      return next(err);
    }
  },
];

// Display Product delete form on GET.
exports.product_delete_get = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .exec();
    if (product == null) {
      // No results.
      res.redirect("/catalog/products");
    } else {
      // Successful, so render.
      res.render("product_delete", {
        title: "Delete Product",
        product,
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Handle Product delete on POST.
exports.product_delete_post = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.body.productid);
    res.redirect("/catalog/products");
  } catch (err) {
    return next(err);
  }
};

// Display Product update form on GET.
exports.product_update_get = async (req, res, next) => {
  try {
    const results = await Promise.all([
      Product.findById(req.params.id).populate("category").exec(),
      Category.find(),
    ]);
    if (results[0] == null) {
      // No results.
      const err = new Error("Product not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("product_form", {
      title: "Update Product",
      category_list: results[1],
      selected_category: results[0].category._id,
      product: results[0],
      image: results[0].image,
    });
  } catch (err) {
    return next(err);
  }
};

// Handle Product update on POST.
exports.product_update_post = [
  // Validate and sanitize fields.
  body("category", "Category must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("name", "Name must be specified").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be specified").trim().isLength({ min: 1 }).escape(),
  body("number_in_stock", "Number in stock must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      let product;
      // Create a Product object with escaped and trimmed data and current id.
      if (req.file) {
        product = new Product({
          category: req.body.category,
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          number_in_stock: req.body.number_in_stock,
          _id: req.params.id,
          image: undefined === req.file ? "" : req.file.filename,
        });
      } else {
        product = new Product({
          category: req.body.category,
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          number_in_stock: req.body.number_in_stock,
          _id: req.params.id,
          image: req.body.image,
        });
      }

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values and error messages.
        const categories = await Category.find({}, "title").exec();
        // Successful, so render.
        res.render("product_form", {
          title: "Update Product",
          category_list: categories,
          selected_category: product.category._id,
          errors: errors.array(),
          product,
        });
        return;
      }

      // Data from form is valid.
      const theproduct = await Product.findByIdAndUpdate(
        req.params.id,
        product,
        {}
      );
      // Successful: redirect to new record.
      res.redirect(theproduct.url);
    } catch (err) {
      next(err);
    }
  },
];
