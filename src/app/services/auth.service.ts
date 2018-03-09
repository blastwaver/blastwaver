import { Injectable } from '@angular/core';
import { User } from '../models/User';
import * as firebase from 'firebase/app';
import  { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { googleUser } from '../models/googleUser';

//redux
import { IAppState } from '../store';
import { NgRedux, select, NgReduxModule } from '@angular-redux/store';
import { UPDATE_USER, USER_LOG_OUT, UPDATE_FRIENDS, USER_LOG_IN, UPDATE_MESSAGES, UPDATE_CHAT_ROOM } from '../actions';
import { MessageService } from './message.service';
import { Message } from '../models/Message';
import { GENERAL_MESSAGE, GREETING_MESSAGE } from '../messageTypes';



@Injectable()
export class AuthService {

  private user: Observable<googleUser>
  
  // @select('user') selectTest;

  constructor(private afAuth:AngularFireAuth,
              private afs: AngularFirestore,
              private userService: UserService,
              private ngRedux :NgRedux<IAppState>,
              private messageService :MessageService
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

    // console.log(user);

    const data: googleUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }
    
    
    return userRef.set(data).then( () => {
      // console.log(data);
      this.userService.getUserByGoogle(data.uid)
          .subscribe((result) => {
            // console.log(result)
            //this.for first user
            let newUser: User = {
              googleId: user.uid,
              username: user.displayName,
              email: user.email,
              photoUrl: user.photoURL,
              comment: user.comment,
              cProfile: user.cProfile
            }

            //new user
            if(result.length === 0) {
              this.userService.createUser(newUser).subscribe((nUser) => {
                //add mongo _id from newUser Object 
                newUser._id = nUser._id;
      
                //state change in redux
                this.ngRedux.dispatch({type: UPDATE_USER, body: newUser});
                this.ngRedux.dispatch({type:USER_LOG_IN});
                
                // send welcome message
                let joinMessage :Message = 
                {from:"admin", to: nUser._id, message:"Congratulations on joining this site", type: GREETING_MESSAGE };
                this.messageService.addMessage(joinMessage).subscribe((result) => {
                  if(result) {
                    this.messageService.getMessages(nUser._id).subscribe((messages) => {
                      this.ngRedux.dispatch({type:UPDATE_MESSAGES, body: messages});
                    },(err) => console.log(err));
                  }
                },(err) => {console.log(err)});
              },(err) => {console.log(err)})
            }
            
          },(err) => { console.log(err) }
        );
    });
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      let user: User ={ _id: null, googleId: null, username: null, email: null, photoUrl: null,comment: null, cProfile: false}
      this.ngRedux.dispatch({type: UPDATE_USER, body: user});
      this.ngRedux.dispatch({type:USER_LOG_OUT});
      this.ngRedux.dispatch({type:UPDATE_FRIENDS,body: []});
      this.ngRedux.dispatch({type:UPDATE_MESSAGES, body:[]});
      this.ngRedux.dispatch({type:UPDATE_CHAT_ROOM, body:null});
    });
  }
}