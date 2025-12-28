const express = require("express")
const router = express.Router()
const eventsController = require("../controller/eventscontoller.js")
const { auth } = require ("../middleware/auth.js");
const { isOrganizer } = require ("../middleware/role.js");


router.get("/", eventsController.getEvents)
router.get("/:id", eventsController.getEventById)
router.post("/", auth, isOrganizer, eventsController.createEvent)
router.put("/:id", auth, isOrganizer, eventsController.updateEvent)
router.delete("/:id", auth, isOrganizer, eventsController.deleteEvent)

module.exports = router;
