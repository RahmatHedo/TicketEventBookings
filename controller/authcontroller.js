const db = require("../config/connection")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi"
      })
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({
        message: "Email atau password salah"
      })
    }

    const user = users[0]

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        message: "Email atau password salah"
      })
    }

    const token = jwt.sign(
      {
        id_user: user.id_user,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    )

    res.status(200).json({
      message: "Login berhasil",
      token
    })

  } catch (error) {
    res.status(500).json({
      message: "Login gagal",
      error: error.message
    })
  }
}
