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

        // Guardar el token en una cookie segura
        res.cookie('authToken', token, {
        httpOnly: true,   // Evita acceso al token desde JavaScript en el cliente
        secure: true,     // Requiere HTTPS para la cookie
        sameSite: 'strict', // Protección contra CSRF
        maxAge: 3600000   // Expiración en 1 hora
        });

        res.status(200).send({ message: 'Login successful, token set in cookie' });
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

