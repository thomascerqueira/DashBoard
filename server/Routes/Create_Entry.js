import express from 'express'
import pkg from 'cors';
import {db} from '../Function/firebaseConfig.js'
import { ref, set, get, child } from "firebase/database";
import get_real_name from '../Function/get_real_name.js';
import pkgJson from 'jsonwebtoken';
const { cors } = pkg;

var router = express.Router();
router.use(pkg());

export async function create_entry_name(name, email, fbToken = '', gmailToken = '') {
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
                    var rreff = ref(db, `users/${newName}/widgets/0`);
                    set(rreff, { name: "none", value: '{"value":"-1"}' })
                    var rreff = ref(db, `users/${newName}/widgets/1`);
                    set(rreff, { name: "none", value: '{"value":"-1"}' })
                    var rreff = ref(db, `users/${newName}/widgets/2`);
                    set(rreff, { name: "none", value: '{"value":"-1"}' })
                    var rreff = ref(db, `users/${newName}/widgets/3`);
                    set(rreff, { name: "none", value: '{"value":"-1"}' })
                    var rreff = ref(db, `users/${newName}/widgets/4`);
                    set(rreff, { name: "none", value: '{"value":"-1"}' })
                    var rreff = ref(db, `users/${newName}/widgets/5`);
                    set(rreff, { name: "none", value: '{"value":"-1"}' })
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

router.post('/name', pkg(), (req, res) => {
    create_entry_name(req.body.name, req.body.email, req.body.fbToken ? req.body.fbToken : "", req.body.gmailToken ? req.body.gmailToken : "")
        .then((val) => {
            res.json(val)
        })

})

export default router