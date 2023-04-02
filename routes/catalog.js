const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Require controller modules.
const category_controller = require("../controllers/categoryController");
const product_controller = require("../controllers/productController");

/// CATEGORY ROUTES ///

// GET catalog home page.
router.get("/", category_controller.index);

// GET request for creating a Category. NOTE This must come before routes that display Category (uses id).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating category.
router.post(
  "/category/create",
  upload.single("uploaded_file"),
  category_controller.category_create_post
);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post(
  "/category/:id/update",
  upload.single("uploaded_file"),
  category_controller.category_update_post
);

// GET request for one category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all category items.
router.get("/categories", category_controller.category_list);

/// PRODUCT ROUTES ///

// GET request for creating product. NOTE This must come before route for id (i.e. display author).
router.get("/product/create", product_controller.product_create_get);

// POST request for creating product.
router.post(
  "/product/create",
  upload.single("uploaded_file"),
  product_controller.product_create_post
);

// GET request to delete product.
router.get("/product/:id/delete", product_controller.product_delete_get);

// POST request to delete product.
router.post("/product/:id/delete", product_controller.product_delete_post);

// GET request to update product.
router.get("/product/:id/update", product_controller.product_update_get);

// POST request to update product.
router.post(
  "/product/:id/update",
  upload.single("uploaded_file"),
  product_controller.product_update_post
);

// GET request for one product.
router.get("/product/:id", product_controller.product_detail);

// GET request for list of all products.
router.get("/products", product_controller.product_list);

module.exports = router;
