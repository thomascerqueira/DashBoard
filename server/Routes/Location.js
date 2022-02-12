import express, { response } from 'express'
import axios from 'axios'
import authenticateToken from '../Function/authenticateToken.js'
import pkg from 'cors';
const { cors } = pkg;

var router = express.Router();
router.use(pkg());

router.post('/get_location', authenticateToken, pkg(), (req, res) => {
  const Location = req.body.location;
  const route = "http://api.zippopotam.us/fr/" + Location;
    axios.get(route)
      .then((response) => {
        res.json(response.data)
      })
      .catch((error) => {
        console.error(error);
        res.json(error);
      })
  })

export default router