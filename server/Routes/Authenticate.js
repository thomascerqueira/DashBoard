import express, { response } from 'express'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import pkg from 'cors';
import get_real_name from '../Function/get_real_name.js';
import pkgJson from 'jsonwebtoken';
import { firebaseauth } from '../Function/firebaseConfig.js';
import {create_entry_name} from './Create_Entry.js';
const { cors } = pkg;

var router = express.Router();
router.use(pkg());

router.post('/authentification/', pkg(), (req, res) => {
    signInWithEmailAndPassword(firebaseauth, req.body.email, req.body.password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.emailVerified === false) {
                res.json({
                    email: "",
                    token: "",
                    status: 84,
                    message: "please verify your email address",
                });
            }
            else {
                var name = get_real_name(user.providerData[0].email.substr(0, user.providerData[0].email.indexOf('@')));
                const token = pkgJson.sign(name, process.env.REACT_APP_TOKEN)
                res.json({
                    email: user.providerData[0].email,
                    name: name,
                    status: 1,
                    message: "OK",
                    accessToken: token
                });
            }
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

router.post('/create_account/', pkg(), (req, res) => {
    createUserWithEmailAndPassword(firebaseauth, req.body.email, req.body.password)
        .then((userCredential) => {
            const user = userCredential.user;
            var name = get_real_name(user.providerData[0].email.substr(0, user.providerData[0].email.indexOf('@')));
            sendEmailVerification(user);
            create_entry_name(name, user.providerData[0].email)
                .then(() => {
                    const accessToken = pkgJson.sign(name, process.env.REACT_APP_TOKEN)
                    res.json({
                        email: user.providerData[0].email,
                        name: name,
                        status: 84,
                        message: "please verify your email address",
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

export default router