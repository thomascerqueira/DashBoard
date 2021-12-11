import axios from 'axios'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import pkg from 'cors';
import pkgJson from 'jsonwebtoken';
const { cors } = pkg;
import express, { response } from 'express'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSASGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID
};

const fireapp = initializeApp(firebaseConfig);
const db = getDatabase(fireapp);
var firebaseauth = getAuth(fireapp);

const app = express()
const port = 8080
app.use(express.json())

app.use(pkg());

var listGame;

axios.get(process.env.REACT_APP_STEAM_LIST)
  .then((response) => {
    listGame = response.data.applist.apps
  })
  .catch((err) => {
    console.error(err)
  })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/authentification/', pkg(), (req, res) => {
  signInWithEmailAndPassword(firebaseauth, req.body.email, req.body.password)
    .then((userCredential) => {
      const user = userCredential.user;
      var name = get_real_name(user.providerData[0].email.substr(0, user.providerData[0].email.indexOf('@')));

      const token = pkgJson.sign(name, process.env.REACT_APP_TOKEN)
      res.json({
        email: user.providerData[0].email,
        name: name,
        status: 1,
        message: "OK",
        accessToken: token
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(error)
      res.json({
        email: "",
        token: "",
        status: 84,
        message: errorMessage
      });
    });
})

app.post('/create_account/', pkg(), (req, res) => {
  createUserWithEmailAndPassword(firebaseauth, req.body.email, req.body.password)
    .then((userCredential) => {
      const user = userCredential.user;
      var name = get_real_name(user.providerData[0].email.substr(0, user.providerData[0].email.indexOf('@')));
      create_entry_name(name, user.providerData[0].email)
        .then(() => {
          const accessToken = pkgJson.sign(name, process.env.REACT_APP_TOKEN)
          res.json({
            email: user.providerData[0].email,
            name: name,
            status: 1,
            message: "OK",
            accessToken: accessToken
          })
        }
        );

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorMessage, req.body.email)
      res.json({
        email: "",
        token: "",
        status: 84,
        message: errorMessage
      });
    });
})


app.post('/set_widget/', authenticateToken, pkg(), (req, res) => {
  var name = req.body.name;
  const rref = ref(db, `users/${name}/widgets/${req.body.widget}`);
  set(rref, {
    name: req.body.widget,
    description: req.body.value,
  })
    .then(() => {
      res.json({ "status": 1, "message": "OK" });
    })
    .catch((error) => {
      console.error(error);
      res.json({'status': 84, 'message': error.message});
    });
})

function get_real_name(name) {
  const searchRegExp = '.';
  const replaceWith = ' ';
  const newName = name.replaceAll(searchRegExp, replaceWith);
  return newName;
}

async function get_info_db(name, route) {
  const newName = get_real_name(name);
  const dbRef = ref(db);
  try {
    let snapshot = await get(child(dbRef, `users/${newName}/${route}`))
    if (snapshot.exists()) {
      return ({ "status": 1, "message": snapshot.val() });
    } else {
      return ({ "status": 84, "message": "NOT FOUND" })
    }
  } catch (err) {
    return ({ "status": 84, "message": err })
  }
}

app.post('/get_info_db', authenticateToken, pkg(), async (req, res) => {
  get_info_db(req.body.name, req.body.route)
    .then((val) => {
      res.json(val)
    })
    .catch((err) => {
      res.json({ "status": 84, 'message': err })
    })
})


app.post('/widget_info_user/', authenticateToken, pkg(), async (req, res) => {
  var name = req.body.name;
  const dbRef = ref(db);

  get(child(dbRef, `users/${name}/widgets/${req.body.widget}`)).then((snapshot) => {
    if (snapshot.exists()) {
      res.json(snapshot.val().description);
    } else {
      console.error("No data available");
      res.json({'status': 84, 'message': 'No data available'})
    }
  }).catch((error) => {
    console.error(error);
    res.json({'status': 84, 'message': error})
  });
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    console.log("no token")
    return res.json({ "status": 406, 'message': 'Token missing' })
  }

  pkgJson.verify(token, process.env.REACT_APP_TOKEN, (err, user) => {
    if (err) {
      console.log("Has token but not good")
      return res.json({ "status": 405, message: err.message })
    }
    req.user = user
    next()
  })
}


app.post('/get_weather', authenticateToken, pkg(), (req, res) => {
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

app.post('/get_cinema', authenticateToken, pkg(), (req, res) => {
  const route = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + process.env.REACT_APP_CINEMA_API_KEY;
  axios.get(route)
    .then((response) => {
      res.json(response.data)
    })
    .catch((error) => {
      console.error(error);
      res.json(error);
    })
})


async function create_entry_name(name, email, fbToken = '', gmailToken = '') {
  const dbRef = ref(db);
  const newName = get_real_name(name);
  var accessToken

  console.log("Try to connect", newName)
  try {
    var snapshot = await get(child(dbRef, `users/${newName}`))
    if (snapshot.exists()) {
      console.log("snapshot exist for", newName)
      accessToken = pkgJson.sign(newName, process.env.REACT_APP_TOKEN)
      let str = { "status": 1, "message": "OK", "email": email, "name": newName, 'accessToken': accessToken }
      return str
    } else {
      console.log("snapshot doesnt exist for:", newName)
      const rref = ref(db, `users/${newName}`);
      set(rref, {
        email: email,
        fbToken: fbToken,
        gmailToken: gmailToken
      })
        .then(() => {
          var rreff = ref(db, `users/${newName}/widgets/weather`);
          set(rreff, { name: "Weather", description: '{"city":"Paris"}' })
          rreff = ref(db, `users/${newName}/widgets/facebook`);
          set(rreff, { name: "Facebook", description: "" })
          rreff = ref(db, `users/${newName}/widgets/steam`);
          set(rreff, { name: "Steam", description: "" })
          rreff = ref(db, `users/${newName}/widgets/gmail`);
          set(rreff, { name: "Gmail", description: "" })
          rreff = ref(db, `users/${newName}/widgets/cinema`);
          set(rreff, { name: "Cinema", description: "" })
          accessToken = pkgJson.sign(newName, process.env.REACT_APP_TOKEN)
        })
        .catch((error) => {
          return { "status": 84, "message": error.message }
        })
    }
  } catch (error) {
    return { "status": 84, "message": error.message }
  }

  return { "status": 1, "message": "OK", "email": email, "name": newName, "accessToken": accessToken }
}

app.post('/create_entry/name', pkg(), (req, res) => {
  create_entry_name(req.body.name, req.body.email, req.body.fbToken ? req.body.fbToken : "", req.body.gmailToken ? req.body.gmailToken : "")
    .then((val) => {
      res.json(val)
    })

})

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

  return ({ "prefid": prefid, "name": name, "allId": tempId })
}


app.post('/get_steam', authenticateToken, pkg(), async (req, res) => {
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

  console.log("Want game:", game)
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

app.get("/about.json", pkg(), (req, res) => {
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
      'params': [{'name': 'city', 'type': 'string'}]
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

  var host = req.socket.remoteAddress
  var currentTime = Math.floor(new Date().getTime() / 1000)

  var services = [weather, steam, cinema]

  o["client"] = ({ 'host': host })
  o['server'] = ({ 'current_time': currentTime, 'services': services })
  res.json(o)
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})