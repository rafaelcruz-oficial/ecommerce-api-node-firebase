import { FirebaseAppError } from "firebase-admin";
import { EmailAlreadyExistsError } from "../errors/email.already-exists.error.js";
import { User } from "../models/user.model.js";
import { getAuth, UpdateRequest, UserRecord } from "firebase-admin/auth"
import { getAuth as getFireBaseAuth, sendPasswordResetEmail, signInAnonymously, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { FirebaseError } from "firebase/app";



export class AuthService {
    async create(user: User): Promise<UserRecord> {
        try {
            return await getAuth().createUser({
                email: user.email,
                password: user.password,
                displayName: user.nome,
            });
        } catch (err) {
            if (err instanceof FirebaseAppError && err.code === "auth/email-already-exists") {
                throw new EmailAlreadyExistsError();
            }
            throw err;
        }
    }

    async update(id: string, user: User) {
        const props: UpdateRequest = {
            displayName: user.nome,
            email: user.email
        };
        if (user.password) {
            props.password = user.password;
        }

        await getAuth().updateUser(id, props);
    }

    async login(email: string, password: string) {
        return await signInWithEmailAndPassword(getFireBaseAuth(), email, password)
        .catch( err => {
            if(err instanceof FirebaseError) {
                if(err.code === "auth/invalid-credential"){
                    throw new UnauthorizedError();
                } 
            }
            throw err;
        });
    }

    async delete(id: string){
        getAuth().deleteUser(id);
    }

    async recovery(email: string) {
        await sendPasswordResetEmail(getFireBaseAuth(), email);
    }

    async signin(): Promise<UserCredential>{
        return signInAnonymously(getFireBaseAuth());
    }
}