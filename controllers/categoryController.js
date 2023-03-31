const Category = require("../models/category");
const Product = require("../models/product");
const { body, validationResult } = require("express-validator");

exports.index = async (req, res) => {
  try {
    const category_count = await Category.countDocuments({});
    const product_count = await Product.countDocuments({});
    res.render("index", {
      title: "Groceries in minutes",
      data: {
        category_count,
        product_count,
      },
    });
  } catch (err) {
    res.render("index", {
      title: "Inventory App Home",
      error: err,
    });
  }
};

// Display list of all categories.
exports.category_list = async function (req, res, next) {
  try {
    const list_categories = await Category.find()
      .sort({ name: 1 })
      .populate("name")
      .exec();
    res.render("category_list", {
      title: "Categories",
      category_list: list_categories,
    });
  } catch (err) {
    return next(err);
  }
};

// Display detail page for a specific category.
exports.category_detail = async (req, res, next) => {
  try {
    const results = await Promise.all([
      Category.findById(req.params.id).populate("name").exec(),
      Product.find({ category: req.params.id }).exec(),
    ]);
    if (results[0] == null) {
      // No results.
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    res.render("category_detail", {
      title: results[0].name,
      category: results[0],
      products: results[1],
    });
  } catch (err) {
    return next(err);
  }
};

// Display category create form on GET.
exports.category_create_get = async (req, res, next) => {
  await res.render("category_form", { title: "Create Category" });
};

// Handle category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      try {
        // Data from form is valid.
        // Check if Category with same name already exists.
        const found_category = await Category.findOne({
          name: req.body.name,
        }).exec();
        if (found_category) {
          // Category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          await category.save();
          // Category saved. Redirect to category detail page.
          res.redirect(category.url);
        }
      } catch (err) {
        return next(err);
      }
    }
  },
];

// Display category delete form on GET.
exports.category_delete_get = async (req, res) => {
  try {
    const results = await Promise.all([
      Category.findById(req.params.id).populate("name").exec(),
      Product.find({ category: req.params.id }).exec(),
    ]);
    if (results[0] == null) {
      // No results.
      res.redirect("/catalog/categories");
    }
    // Successful, so render.
    res.render("category_delete", {
      title: "Delete Category",
      category: results[0],
      products: results[1],
    });
  } catch (err) {
    return next(err);
  }
};

// Handle category delete on POST.
exports.category_delete_post = async (req, res) => {
  try {
    const results = await Promise.all([
      Category.findById(req.params.id).exec(),
      Product.find({ category: req.params.id }).exec(),
    ]);
    const category = results[0];
    const products = results[1];
    if (products.length > 0) {
      res.render("category_delete", {
        title: "Delete Category",
        category,
        products,
      });
    } else {
      await Category.findByIdAndRemove(req.body.categoryid);
      res.redirect("/catalog/categories");
    }
  } catch (err) {
    next(err);
  }
};

// Display category update form on GET.
exports.category_update_get = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category == null) {
      // No results.
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("category_form", {
      title: "Update Category",
      category: category,
    });
  } catch (err) {
    return next(err);
  }
};

// Handle category update on POST.
exports.category_update_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a Category object with escaped and trimmed data.
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id, //This is required, or a new ID will be assigned!
      });

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
        res.render("book_form", {
          title: "Update Category",
          category,
          errors: errors.array(),
        });
        return;
      }
      // Data from form is valid. Update the record.
      await Category.findByIdAndUpdate(req.params.id, category, {});
      // Successful: redirect to category detail page.
      res.redirect(category.url);
    } catch (err) {
      next(err);
    }
  },
];
