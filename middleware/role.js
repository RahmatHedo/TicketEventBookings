module.exports.isOrganizer = (req, res, next) => {
  if (req.user.role !== "organizer") {
    return res.status(403).json({
      message: "hanya orgsnizer yang bisa memesan tiket!"
    })
  }
  next()
}

module.exports.isCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({
      message: "hanya customer yang bisa memesan tiket!"
    })
  }
  next()
}
