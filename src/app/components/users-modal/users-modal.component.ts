import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAppState } from '../../store';
import { NgRedux } from '@angular-redux/store';
import { FriendService } from '../../services/friend.service';
import { User } from '../../models/user';
import { ISubscription } from 'rxjs/Subscription';
import { UPDATE_FRIENDS, SEARCHED_USER_MODAL_OFF, SEARCHED_USER_DATA, SEARCHED_USER_MODAL_ON, UPDATE_CHAT_ROOM } from '../../actions';
import { Message } from '../../models/Message';
import { FREIND_ACCEPT, FREIND_REQUEST } from '../../messageTypes';
import { MessageService } from '../../services/message.service';
import { SocketService } from '../../services/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.css']
})
export class UsersModalComponent implements OnInit, OnDestroy {
  
  subscriptitonModal$ :ISubscription;
  subscriptitonUserData$ :ISubscription;
  buttonState :string = null ;
  modalOn :boolean = false;
  data :User = null;
  
  constructor(private ngRedux: NgRedux<IAppState>,
              private friendService :FriendService,
              private messageService :MessageService,
              private socketServiece :SocketService,
              private router :Router
            ) { }

  ngOnInit() {
    this.subscriptitonModal$ = this.ngRedux.select('searchUserModal').subscribe((modalState) => {
      this.modalOn = modalState ? true : false;
      // console.log(this.modalOn)
    }, (err) => console.log(err));

    this.subscriptitonUserData$ = this.ngRedux.select('searchUserData').subscribe((userState) => {
      let array = []; array.push(userState);
      this.data = array[0];
      let my_id = this.ngRedux.getState().user._id; 
      
      //reset button state
      this.buttonState = null;
      if(this.data) {
        let state = this.ngRedux.getState().friends;
        let array =[];  array.push(state); 
        array[0].forEach(element => {
          //check the clicked user profile is one of my friend in my f list.  
          if(element._id === this.data._id ) 
            this.buttonState = element.status;
        });
        //check if this is my profile
        let my_id = this.ngRedux.getState().user._id; 
        if(my_id === this.data._id)
        this.buttonState = "me";
      }
        
    }, (err) => console.log(err));
  }

  addFriend() {
    let obj ={my_id:"",f_id:""};
    obj.my_id = this.ngRedux.getState().user._id;
    obj.f_id = this.data._id;
    //add a firend to both side
    this.friendService.addFriend(obj).subscribe((result) =>{
      if(result.result == 'succeed') {
        //change the button text
        this.buttonState = 'request';
        //refresh friends list in redux
        this.friendService.getFriendsList(obj.my_id).subscribe((result)=>{   
          this.ngRedux.dispatch({type:UPDATE_FRIENDS, body: result });
        },(err) => {console.log(err)});
        
        //send a message
        let message :Message = { from: obj.my_id, to: obj.f_id, message:`requested to be your friend.`, type: FREIND_REQUEST};
        //send a message to friend's db
        this.messageService.addMessage(message).subscribe((result) => {
          //send a message by socket
          this.socketServiece.socket.emit('message', message);
        },(err) => {console.log(err)});  
      }
    },(err) =>{console.log(err)});
  }

  acceptFriend() {
    let obj ={my_id:"",f_id:""};
    obj.my_id = this.ngRedux.getState().user._id;
    obj.f_id = this.data._id;
    this.friendService.acceptFriend(obj).subscribe((result) =>{
      if(result.result == 'succeed') {
        //chage button text
        this.buttonState = 'friend';
        //refresh friends list in redux
        this.friendService.getFriendsList(obj.my_id).subscribe((result)=>{   
          this.ngRedux.dispatch({type:UPDATE_FRIENDS, body: result })
        },(err) => {console.log(err)});

        let message :Message = { from: obj.my_id, to: obj.f_id, message:`accepted your friends request.`, type: FREIND_ACCEPT};  
        //send a message to friend's db
        this.messageService.addMessage(message).subscribe((result) => {
          //send a message by socket
          this.socketServiece.socket.emit('message', message);
        },(err) => {console.log(err)});
        
      }
    },(err) =>{console.log(err)});
  }

  close($event, position) {
    // console.log(position);
    if(position == 'out'){
      
      this.ngRedux.dispatch({type: SEARCHED_USER_MODAL_OFF});
    }
    this.ngRedux.dispatch({type: SEARCHED_USER_MODAL_OFF});
    // console.log(this.modalOn)
    event.stopPropagation();
  }

  chat(user) {
    let friends = Object.assign([], this.ngRedux.getState().friends)
    let room = null;
    friends.forEach((friend) => {
    if(user._id == friend._id)
      this.ngRedux.dispatch({type: UPDATE_CHAT_ROOM, body:friend.chatRoom});
    });
    
    this.router.navigate(['/main']); 
  }

  ngOnDestroy() {
    this.subscriptitonModal$.unsubscribe();
    this.subscriptitonUserData$.unsubscribe();
  }
}
