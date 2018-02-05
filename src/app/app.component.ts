import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import * as firebase from 'firebase/app';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from './store';
import { UPDATE_USER, UPDATE_USER_ERROR, USER_LOG_IN, UPDATE_FRIENDS } from './actions';
import { UserService } from './services/user.service';
import { Observable } from 'rxjs/Observable';
import { User } from './models/user';
import { FriendService } from './services/friend.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy{
  title = 'app';

  constructor(private iconRegistry: MatIconRegistry, 
              private sanitizer: DomSanitizer,
              private ngRedux :NgRedux<IAppState>,
              private userService :UserService,
              private friendService :FriendService
              ) {
    iconRegistry.addSvgIcon('google',
                            sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/google.svg')); 
  }
  
  ngOnInit(){
  
    firebase.auth().onAuthStateChanged((authData) => {
      
      if (authData) {//in  case loged in 
        /* redux user state */
        this.userService.getUserByGoogle(authData.uid).subscribe((data) =>{
          let user: User ={
            _id: data[0]._id,
            googleId: data[0].googleId,
            username: data[0].username,
            email: data[0].email,
            photoUrl: data[0].photoUrl,
            comment: data[0].comment,
            cProfile: data[0].cProfile
          }
          // console.log(user);
          this.ngRedux.dispatch({type: UPDATE_USER, body: user});
          
          /* redux login state */
          this.ngRedux.dispatch({type: USER_LOG_IN});
       
          /* friends state */
          this.friendService.getFriendsList(data[0]._id).subscribe((fList) => {
            console.log(fList)
            this.ngRedux.dispatch({type:UPDATE_FRIENDS,body: fList })
          });
        }, err =>{
          this.ngRedux.dispatch({type: UPDATE_USER_ERROR, body: err});
        });
   
      } else { // incase not loged in  
        // console.log(user);
      }
    }); 
 
  }

  ngOnDestroy() {
    
  }

}
