const db = require("../config/connection.js")  
const bcrypt = require ("bcrypt")

module.exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "gagal mengambil data users",
      error: error.message
    });
  }
};

module.exports.getUsersById =async (req,res) => {
     try {
    const { id } = req.params;
    const [users] = await db.query(
      "SELECT * FROM users WHERE id_user = ?",
      [id]
    )
    if (users.length === 0) {
      return res.status(404).json({
        message: "user tidak ditemukan"
      });
    }else {
    res.status(200).json(users[0]);
    }
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data user",
      error: error.message
    });
  }
}

module.exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Semua field wajib diisi"
      })
    }

    const [tesEmail] = await db.query(
      "SELECT id_user FROM users WHERE email = ?",
      [email]
    )

    if (tesEmail.length > 0) {
      return res.status(400).json({
        message: "Email sudah terdaftar"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    )

    res.status(201).json({
      message: "User berhasil dibuat"
    })
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat user",
      error: error.message
    })
  }
}

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE id_user = ?",
      [id]
    )

    if (users.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      })
    }

    let hashedPassword = users[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await db.query(
      `UPDATE users 
       SET name = ?, email = ?, password = ?, role = ?
       WHERE id_user = ?`,
      [
        name || users[0].name,
        email || users[0].email,
        hashedPassword,
        role || users[0].role,
        id
      ]
    )

    res.status(200).json({
      message: "User berhasil diupdate"
    })
  } catch (error) {
    res.status(500).json({
      message: "Gagal update user",
      error: error.message
    })
  }
}

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      "SELECT id_user FROM users WHERE id_user = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      });
    }

    await db.query(
      "DELETE FROM users WHERE id_user = ?",
      [id]
    )

    res.status(200).json({
      message: "User berhasil dihapus"
    })
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus user",
      error: error.message
    })
  }
}

