const jwt = require("jsonwebtoken")

module.exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: "silakan login"
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded 
    next()
  } catch (error) {
    return res.status(401).json({
      message: "token tidak valid"
    })
  }
}
