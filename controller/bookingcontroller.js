const db = require("../config/connection.js")


module.exports.createBooking = async (req, res) => {
  const { id_user, id_event, quantity } = req.body

  try {
    const [event] = await db.query(
      "SELECT * FROM events WHERE id_event = ?",
      [id_event]
    )

    if (event.length === 0)
      return res.status(404).json({ message: "Event tidak ditemukan" })

    if (event[0].available_tickets < quantity)
      return res.status(400).json({ message: "Tiket tidak mencukupi" })

    const price = event[0].price
    const total_price = price * quantity

    await db.query(
      `INSERT INTO bookings 
       (id_user, id_event, quantity, price, total_price, status)
       VALUES (?, ?, ?, ?, ?, 'confirmed')`,
      [id_user, id_event, quantity, price, total_price]
    )

    await db.query(
      `UPDATE events 
       SET available_tickets = available_tickets - ?
       WHERE id_event = ?`,
      [quantity, id_event]
    )

    res.status(201).json({ message: "Booking berhasil" })

  } catch (error) {
    res.status(500).json({
      message: "Booking Gagal",
      error: error.message
    })
  }
}


module.exports.getBookings = async (req, res) => {
  const [bookings] = await db.query("SELECT * FROM bookings")
  res.json(bookings)
}


module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params

  try {
    const [booking] = await db.query(
      "SELECT * FROM bookings WHERE id_booking = ?",
      [id]
    )

    if (booking.length === 0)
      return res.status(404).json({ message: "Booking tidak ditemukan" })

    if (booking[0].status === "cancelled")
      return res.status(400).json({ message: "Booking sudah dibatalkan" })

    await db.query(
      `UPDATE events 
       SET available_tickets = available_tickets + ?
       WHERE id_event = ?`,
      [booking[0].quantity, booking[0].id_event]
    )

    await db.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id_booking = ?"
    )

    res.json({ message: "Booking dibatalkan" })

  } catch (error) {
    res.status(500).json({
      message: "Gagal cancel booking",
      error: error.message
    })
  }
}
