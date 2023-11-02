import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState,
  User
} from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore, setDoc, doc, Unsubscribe, onSnapshot } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  userUnsubscribe!: Unsubscribe;

  constructor(public auth: Auth, private firestore: Firestore, private store: Store<AppState>) {}

  initAuthListener() {
    authState(this.auth).subscribe((fUser: User | null) => {
      if (fUser) {
        this.userUnsubscribe = onSnapshot(
          doc(this.firestore, `${fUser.uid}/usuario`),
          (docUser: any) => {
            let data: any = docUser.data();
            let user = Usuario.fromFirebase(data);

            this.store.dispatch(authActions.setUser({ user }));
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.userUnsubscribe ? this.userUnsubscribe() : null;
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then( ({user}) => {
        const newUser = new Usuario(user.uid, nombre, email);
        return setDoc(doc(this.firestore, user.uid, 'usuario'), {...newUser});
      });
  }

  loginUsuario(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logOut() {
    return signOut(this.auth);
  }

  isAuth(): Observable<boolean> {
    return authState(this.auth).pipe(
      map((firebaseUser) => firebaseUser !== null)
    );
  }
}
