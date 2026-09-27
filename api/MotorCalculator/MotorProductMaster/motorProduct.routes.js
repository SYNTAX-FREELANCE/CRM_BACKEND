const express = require("express");

const router = express.Router();

const MotorProductController = require("./motorProduct.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE

router.post(
    "/create",
    verifyAccessToken,
    MotorProductController.createProduct
);


// GET ALL

router.get(
    "/getall",
    verifyAccessToken,
    MotorProductController.getAllProducts
);


// GET BY ID

router.get(
    "/getbyid/:productId",
    verifyAccessToken,
    MotorProductController.getProductById
);


// UPDATE

router.put(
    "/update/:productId",
    verifyAccessToken,
    MotorProductController.updateProduct
);


// DELETE

router.delete(
    "/delete/:productId",
    verifyAccessToken,
    MotorProductController.deleteProduct
);


// GET ACTIVE

router.get(
    "/get-active",
    verifyAccessToken,
    MotorProductController.getActiveProducts
);


module.exports = router;