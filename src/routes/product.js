const express = require("express");
let product = require("../controllers/product/product");
let { userAuth } = require("../middleware/auth");
const router = express.Router();

router.post(
  "/create",
  product.createProduct
);
module.exports = router;
