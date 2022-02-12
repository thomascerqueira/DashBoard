import express from 'express'
import axios from 'axios'
import authenticateToken from '../Function/authenticateToken.js'
import pkg from 'cors';
const { cors } = pkg;

var listGame;

axios.get(process.env.REACT_APP_STEAM_LIST)
  .then((response) => {
    listGame = response.data.applist.apps
  })
  .catch((err) => {
    console.error(err)
  })

var router = express.Router();
router.use(pkg());

async function get_game_info(route, config) {
    try {
        var result = await axios.get(route, config)
        return ({ 'count': result.data.response.player_count, 'status': 1 })

    } catch (error) {
        // console.error("Error in get_game_info", error);
        return ({ 'count': error, 'status': 84, 'count': -1 })
    }

}


async function get_best_fit_game(allId, route, config) {
    let best = -1;
    let name = "";
    let id = -1;
    var i = 0;

    while (i < allId.length) {
        try {
            var val = await get_game_info(route + allId[i].appid, config)
            i += 1;
            if (val.count > best) {
                best = val.count
                name = allId[i].name
                id = allId[i].appid
            }
        } catch (error) {
            i += 1
        }
        if (i >= allId.length) {
            return ({ 'status': 1, 'count': best, 'name': name, 'id': id })
        }
    }
}

function get_game_id(game) {
    var name;
    var prefid = -1;
    var tempId = []

    try {
        listGame.some((gam) => {
            let upper = gam.name.toUpperCase();
            if (upper == game) {
                prefid = gam.appid;
                name = gam.name;
                return
            } else if (upper.includes(game)) {
                tempId.push({ 'appid': gam.appid, 'name': gam.name })
            }
        })
    } catch (error) {
        
    }
    

    return ({ "prefid": prefid, "name": name, "allId": tempId })
}


router.post('/get_steam', authenticateToken, pkg(), async (req, res) => {
    if (req.body.game == undefined) {
        res.json({ 'status': 1, 'number': -2, 'game': '', 'header_img': '' })
        return
    }
    const game = req.body.game.toUpperCase();
    var route = process.env.REACT_APP_STEAM_URL;

    let config = {
        headers: {
            'Client-ID': process.env.REACT_APP_KEY_STEAM
        }
    }

    let response = get_game_id(game)
    if (response.prefid === -1) {
        get_best_fit_game(response.allId, route, config)
            .then((result) => {
                try {
                    if (result.count == -1)
                        res.json({ 'status': 84, 'number': -1, 'game': 'GAME NOT FOUND', 'header_img': "" })
                    else {
                        try {
                            axios.get(process.env.REACT_APP_STEAM_INFO_GAME + result.id)
                                .then((resu) => {
                                    let header = ""
                                    if (resu.data[result.id].success == true)
                                        header = resu.data[result.id].data.header_image
                                    res.json({ 'status': 1, 'number': result.count, 'game': result.name, 'header_img': header })
                                })
                        } catch (error) {
                            console.error(error)
                        }
                    }
                } catch (error) {
                    res.json({ 'status': 84, 'number': -1, 'game': 'GAME NOT FOUND', 'header_img': "" })
                }

            })
    } else {
        get_game_info(route + response.prefid, config)
            .then((resp) => {
                try {
                    axios.get(process.env.REACT_APP_STEAM_INFO_GAME + response.prefid)
                        .then((result) => {
                            let header = ""
                            if (result.data[response.prefid].success == true)
                                header = result.data[response.prefid].data.header_image
                            res.json({ 'status': 1, 'number': resp.count, 'game': response.name, 'header_img': header })
                        })
                } catch (error) {
                    res.json({ 'status': 84, 'number': -1, 'game': 'GAME NOT FOUND', 'header_img': "" })
                }
            })
    }
})

export default router