import express, { response } from 'express'
import axios from 'axios'
import authenticateToken from '../Function/authenticateToken.js'
import pkg from 'cors';
const { cors } = pkg;

var router = express.Router();
router.use(pkg());

router.post('/get_pokemon', authenticateToken, pkg(), (req, res) => {
  const Pokemon = req.body.pokemon;
  const route = "https://pokeapi.co/api/v2/pokemon/" + Pokemon;
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