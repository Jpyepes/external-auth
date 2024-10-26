import { Request, Response } from 'express';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import { auth, db, admi } from "../config/firebase";
import { collection, doc, getDoc } from "firebase/firestore"; 

const firebase = require('firebase/app');
require('firebase/auth'); 

export const Login = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        const credential = firebase.auth.GoogleAuthProvider.credential(token);
        const result = await firebase.auth().signInWithCredential(credential);
        const idToken = await result.user.getIdToken();
        // Guardar el token en una cookie segura
        res.cookie('jwt', idToken, {
            httpOnly: true,   
            secure: true,     
            sameSite: 'strict', 
            maxAge: 3600000   
            });
        res.status(200).send({ token: idToken });
      } catch (error) {
        res.status(401).send({ error: error.message });
      }

    
};

export const Validate = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        // Verificar el token del proveedor externo (emitido por Firebase)
        const decodedToken = await admi.auth().verifyIdToken(token);

        if (!decodedToken) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

