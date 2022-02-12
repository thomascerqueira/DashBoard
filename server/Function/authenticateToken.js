import pkgJson from 'jsonwebtoken';

export default function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) {
      console.error("no token")
      res.json({ "status": 406, 'message': 'Token missing' })
      return
    }
  
    pkgJson.verify(token, process.env.REACT_APP_TOKEN, (err, user) => {
      if (err) {
        console.error("Has token but not good")
        res.json({ "status": 405, message: err.message })
        return
      }
      req.user = user
      next()
    })
}