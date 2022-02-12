import express from 'express'
import authenticateToken from '../Function/authenticateToken.js';
import pkg from 'cors';
import { ref, get, child } from "firebase/database";
import { db } from '../Function/firebaseConfig.js'
import get_real_name from '../Function/get_real_name.js'
const { cors } = pkg;

var router = express.Router();
router.use(pkg());

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

router.post('/get_info_db/', authenticateToken, pkg(), async (req, res) => {
    get_info_db(req.body.name, req.body.route)
        .then((val) => {
            res.json(val)
        })
        .catch((err) => {
            res.json({ "status": 84, 'message': err })
        })
})

export default router