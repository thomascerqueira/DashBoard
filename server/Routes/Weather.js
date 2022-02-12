import express, { response } from 'express'
import axios from 'axios'
import authenticateToken from '../Function/authenticateToken.js'
import pkg from 'cors';
const { cors } = pkg;

var router = express.Router();
router.use(pkg());

router.post('/get_weather', authenticateToken, pkg(), (req, res) => {
    const city = req.body.city;
    const route = process.env.REACT_APP_WEATHERURL + city + "&appid=" + process.env.REACT_APP_APIWEATHER + "&units=metric";

    console.log("Want weather from:", city)
    axios.get(route)
        .then((response) => {
            res.json(response.data)
        })
        .catch((error) => {
            res.json(error);
        })
})

export default router