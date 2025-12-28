const db = require("../config/connection.js")

module.exports.getEvents = async (req, res) => {
  try {
    const [events] = await db.query("SELECT * FROM events")
    res.status(200).json(events)
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data events",
      error: error.message
    })
  }
}

module.exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params

    const [events] = await db.query(
      "SELECT * FROM events WHERE id_event = ?",
      [id]
    )

    if (events.length === 0) {
      return res.status(404).json({
        message: "Event tidak ditemukan"
      })
    }

    res.status(200).json(events[0])
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data event",
      error: error.message
    })
  }
}


module.exports.createEvent = async (req, res) => {
  try {
    const {
      id_user,
      title,
      description,
      date,
      location,
      capacity,
      price
    } = req.body

    if (!id_user || !title || !date || !location || !capacity || !price) {
      return res.status(400).json({
        message: "Field wajib belum lengkap"
      })
    }

    await db.query(
      `INSERT INTO events 
      (id_user, title, description, date, location, capacity, available_tickets, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_user,
        title,
        description,
        date,
        location,
        capacity,
        capacity, 
        price
      ]
    )

    res.status(201).json({
      message: "Event berhasil dibuat"
    })
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat event",
      error: error.message
    })
  }
}


module.exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params

    const [events] = await db.query(
      "SELECT * FROM events WHERE id_event = ?",
      [id]
    )

    if (events.length === 0) {
      return res.status(404).json({
        message: "Event tidak ditemukan"
      })
    }

    const {
      title,
      description,
      date,
      location,
      capacity,
      price
    } = req.body

    await db.query(
      "UPDATE events SET ? WHERE id_event = ?",
      [
        {
          title: title ?? events[0].title,
          description: description ?? events[0].description,
          date: date ?? events[0].date,
          location: location ?? events[0].location,
          capacity: capacity ?? events[0].capacity,
          price: price ?? events[0].price
        },
        id
      ]
    )

    res.status(200).json({
      message: "Event berhasil diupdate"
    })
  } catch (error) {
    res.status(500).json({
      message: "Gagal update event",
      error: error.message
    })
  }
}

module.exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params

    const [events] = await db.query(
      "SELECT id_event FROM events WHERE id_event = ?",
      [id]
    )

    if (events.length === 0) {
      return res.status(404).json({
        message: "Event tidak ditemukan"
      })
    }

    await db.query(
      "DELETE FROM events WHERE id_event = ?",
      [id]
    )

    res.status(200).json({
      message: "Event berhasil dihapus"
    })
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus event",
      error: error.message
    })
  }
}
