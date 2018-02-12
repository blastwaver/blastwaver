import { Component, HostListener } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import * as firebase from 'firebase/app';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgRedux, select, NgReduxModule } from '@angular-redux/store';
import { IAppState } from './store';
import { UPDATE_USER, UPDATE_USER_ERROR, USER_LOG_IN, UPDATE_FRIENDS, UPDATE_MESSAGES } from './actions';
import { UserService } from './services/user.service';
import { FriendService } from './services/friend.service';
import { MessageService } from './services/message.service';
import { Observable } from 'rxjs/Observable';
import { User } from './models/user';
import { SocketService } from './services/socket.service';
import { Friend } from './models/Friend';
import { CONNECT_NOTICE, DISCONNECT_NOTICE } from './messageTypes';



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
              private friendService :FriendService,
              private messageService :MessageService,
              private socketService :SocketService
              ) {
    iconRegistry.addSvgIcon('google',
                            sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/google.svg')); 
  }
  
  ngOnInit(){
    this.handleFirebaseAuth();
    
  }


  handleFirebaseAuth() {
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
            this.ngRedux.dispatch({type:UPDATE_FRIENDS, body: fList });

            //send a connect notice to friends
            this.sendConnectNotice(user, fList);

          });
          /* messages state */
          this.messageService.getMessages(data[0]._id).subscribe((messages) => {
            this.ngRedux.dispatch({type:UPDATE_MESSAGES, body: messages})
            // console.log(this.ngRedux.getState().messages);
          });

         
         
        }, err =>{
          this.ngRedux.dispatch({type: UPDATE_USER_ERROR, body: err});
        });
   
      } else { // incase not loged in  
        // console.log(user);
      }
    }); 
  }

  sendConnectNotice(user :User, fList :Array<Friend>){
    //join the room 
    this.socketService.socket.emit('room.join', user._id);

    //sort friends id
    let friends_id = fList.map((friend) => {
      return friend._id;
    });

    //send a message
    friends_id.forEach((f_id) => {
      let message = {from: user._id, to:f_id, type:CONNECT_NOTICE,
                     message: `${user.username} has connected`, contents: {connected:true}};
      this.socketService.socket.emit('message',message);
    });
  }
 
  //before app closed
  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    /*send logout notification */
    let fList = this.ngRedux.getState().friends;
    let user = this.ngRedux.getState().user;
    //sort friends id
    let friends_id = fList.map((friend) => {return friend._id;});

    //send a message
    let message = {from: user._id, to:friends_id, type:DISCONNECT_NOTICE,
      message: `${user.username} has disconnected`, contents: {connected:false}};
    this.socketService.socket.emit('message',message);
    
    /* 브라우저가 꺼지면 로그아웃 되는게 맞나??? 미정*/
    //auth sign out 
    // this.auth.signOut();
  }

  ngOnDestroy() {
    
  }

}
