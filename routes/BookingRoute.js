const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingcontroller.js");
const { auth } = require("../middleware/auth.js");
const { isCustomer } = require("../middleware/role.js");

router.post("/", auth, isCustomer, bookingController.createBooking);
router.get("/", bookingController.getBookings);
router.put("/:id/cancel", auth, isCustomer, bookingController.cancelBooking);

module.exports = router;
