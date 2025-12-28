require("dotenv").config()
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const usersRoutes = require("./routes/UserRoute.js");
app.use("/users", usersRoutes);
const eventRoutes = require ("./routes/EventRoute.js")
app.use("/events", eventRoutes)
const bookinRoutes = require("./routes/BookingRoute.js")
app.use("/bookings", bookinRoutes)
const authRoutes = require("./routes/AuthRoute");
app.use("/login", authRoutes);


app.get("/", (req, res) => {
  res.send("API Event Ticketing Running")
})



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
