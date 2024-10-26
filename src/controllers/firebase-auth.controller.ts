import { Request, Response } from 'express';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider, 
    signInWithCredential
} from "firebase/auth";

import { auth, db, admi, app } from "../config/firebase";
import { collection, doc, getDoc } from "firebase/firestore"; 



const firebase = require('firebase/app');
require('firebase/auth'); 

export const Login = async (req: Request, res: Response) => {
    const { token } = req.body;
    const auth = getAuth(app); // Inicializa Firebase Auth
    const provider = new GoogleAuthProvider(); // Crea una instancia del proveedor

    try {
        const credential = GoogleAuthProvider.credential(token); // Crea las credenciales
        const result = await signInWithCredential(auth, credential); // Sign in with credential
        const idToken = await result.user.getIdToken(); // Obtén el ID token
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

