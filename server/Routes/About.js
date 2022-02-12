import express from 'express'
import authenticateToken from '../Function/authenticateToken.js';
import pkg from 'cors';
import { ref, get, child } from "firebase/database";
import { db } from '../Function/firebaseConfig.js'
const { cors } = pkg;

var router = express.Router();
router.use(pkg());

router.get("/about.json", pkg(), (req, res) => {
    var o = {}
    const weather = {
        'name': "weather",
        'widgets': [{
            'name': 'city_temp',
            'description': 'Display temperature for a city',
            'params': [{ 'name': 'city', 'type': "string" }]
        },
        {
            'name': 'humidity',
            'description': 'Display humidity for a city',
            'params': [{ 'name': 'city', 'type': 'string' }]
        },
        {
            'name': 'wind',
            'description': 'Display wind for a city',
            'params': [{ 'name': 'city', 'type': 'string' }]
        }
        ]
    }

    const steam = {
        'name': 'steam',
        'widgets': [{
            'name': 'number_players',
            'description': 'show the number of real time player for a game',
            'params': [{ 'name': 'game', 'type': 'string' }]
        }
        ]
    }

    const cinema = {
        'name': 'cinema',
        'widgets': [{
            'name': 'name',
            'description': 'show the name of the movie',
            'params': []
        },
        {
            'name': 'description',
            'description': 'show the description of the movie',
            'params': []
        }
        ]
    }

    const Giphy = {
        'name': 'Giphy',
        'widgets': [{
            'name': 'image',
            'description': 'show image of the gif search',
            'params': [
                {'name': 'name of the gif', 'type': 'string'},
                {'limit': 'number of gif', 'type': 'int'}]
        }]
    }

    const Location = {
        'name': 'Location',
        'widgets': [{
            'name': 'ZIP-CODE',
            'description': 'Show the city from a zip code',
            'params': [{'Location': 'Zip-code', 'type': 'string'}]
        }]
    }

    const Pokemon = {
        'name': 'Pokemon',
        'widgets': [{
            'name': 'Pokemon',
            'description': 'Show the image from the pokemon',
            'params': [{'Pokemon': 'Pokemon', 'type': 'string'}]
        }]
    }

    var host = req.socket.remoteAddress
    var currentTime = Math.floor(new Date().getTime() / 1000)

    var services = [weather, steam, cinema, Giphy, Location, Pokemon]

    o["client"] = ({ 'host': host })
    o['server'] = ({ 'current_time': currentTime, 'services': services })
    
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(o, null, 3));
})

export default router