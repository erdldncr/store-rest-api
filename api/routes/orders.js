const express = require("express");
const checkAuth=require('../middleware/check-auth')
const { postOrder, getOrders,getOrder,deleteOrder } = require("../controllers/orders");

const router = express.Router();

router.route("/").get(checkAuth,getOrders).post(checkAuth,postOrder);

router.route("/:id").get(checkAuth,getOrder).delete(checkAuth,deleteOrder);

module.exports=router