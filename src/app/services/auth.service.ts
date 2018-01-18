import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { User } from '../models/user';

import * as firebase from 'firebase/app';
import  { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { googleUser } from '../models/googleUser';



@Injectable()
export class AuthService {

  user: Observable<googleUser>
  
  constructor(private afAuth:AngularFireAuth,
              private afs: AngularFirestore,
              private userService: UserService
              // private router: Router
  ) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState
      .switchMap(user =>{
        if(user) {
          return this.afs.doc<googleUser>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });

   }

   googleLogin(){
     const provider = new firebase.auth.GoogleAuthProvider();
     return this.oAuthLogin(provider);
   }

   facebookLogin() {
     const provider = new firebase.auth.FacebookAuthProvider();
     return this.oAuthLogin(provider);
   }

   twiitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

   private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    console.log(user)

    const data: googleUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    
    
    return userRef.set(data).then( () => {
      console.log(data);
      this.userService.getUserByGoogle(data.uid)
          .subscribe((result) => {
            
            let newUser: User = {
              googleId: user.uid,
              username: user.displayName,
              email: user.email,
              photoUrl: user.photoURL
            }

            if(result.length === 0) {
              this.userService.createUser(newUser).subscribe((result) => {console.log(result)},(err) => {console.log(err)})
            } 
          },(err) => { console.log(err) }
        );
    });
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
        // this.router.navigate(['/']);
    });
  }
}