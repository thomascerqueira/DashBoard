import express, { response } from 'express'
import axios from 'axios'
import authenticateToken from '../Function/authenticateToken.js'
import pkg from 'cors';
const { cors } = pkg;

var router = express.Router();
router.use(pkg());

router.post('/get_gif', authenticateToken, pkg(), (req, res) => {
  const name = req.body.name;
    const limit = req.body.limit;

  const route = `http://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_GIPHY_KEY}&q=${name}&limit=${limit}`;
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