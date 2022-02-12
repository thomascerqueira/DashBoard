import express, { response } from 'express'
import axios from 'axios'
import authenticateToken from '../Function/authenticateToken.js'
import pkg from 'cors';
const { cors } = pkg;

var router = express.Router();
router.use(pkg());

router.post('/get_cinema', authenticateToken, pkg(), (req, res) => {
  const Countrycode = req.body.Countrycode;
  const route = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + process.env.REACT_APP_CINEMA_API_KEY + "&region=" + Countrycode;
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