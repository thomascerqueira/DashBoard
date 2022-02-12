import express from 'express'
import authenticateToken from '../Function/authenticateToken.js';
import pkg from 'cors';
import { ref, set, get, child } from "firebase/database";
import { db } from '../Function/firebaseConfig.js'
import get_real_name from '../Function/get_real_name.js'
const { cors } = pkg;

var router = express.Router();
router.use(pkg());

router.post('/set/', authenticateToken, pkg(), (req, res) => {
    var name = req.body.name;
    const rref = ref(db, `users/${get_real_name(name)}/${req.body.route}`);
    set(rref, {
        name: req.body.widget,
        value: req.body.value,
    })
        .then(() => {
            res.json({ "status": 1, "message": "OK" });
        })
        .catch((error) => {
            console.error(error);
            res.json({ 'status': 84, 'message': error.message });
        });
})

router.post('/info_user/', authenticateToken, pkg(), async (req, res) => {
    var name = req.body.name;
    const dbRef = ref(db);

    get(child(dbRef, `users/${name}/widgets/${req.body.widget}`)).then((snapshot) => {
        if (snapshot.exists()) {
            res.json(snapshot.val().description);
        } else {
            console.error("No data available");
            res.json({ 'status': 84, 'message': 'No data available' })
        }
    }).catch((error) => {
        console.error(error);
        res.json({ 'status': 84, 'message': error })
    });
})

export default router