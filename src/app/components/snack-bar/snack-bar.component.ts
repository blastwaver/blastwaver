import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import { Message } from '../../models/Message';
import { SocketService } from '../../services/socket.service';
import { FREIND_REQUEST, FREIND_ACCEPT, CONNECT_NOTICE, CONNECT_ANSWER, DISCONNECT_NOTICE } from '../../messageTypes';
import { FriendService } from '../../services/friend.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { UPDATE_FRIENDS } from '../../actions';

@Component({
  selector: 'snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent implements OnInit {

  constructor(private snackBar :MatSnackBar,
              private socketService :SocketService,
              private ngRedux :NgRedux<IAppState>,
              private friendService :FriendService 
             ) { }

  ngOnInit() {
    this.handleMessage();

  }

  handleMessage() {
    this.socketService.socket.on('message', (data :Message) =>{
      console.log(data)
      switch(data.type) {
        case FREIND_REQUEST :  return this.handleFriendRequest(data);
        case FREIND_ACCEPT : return this.handleFriendAceept(data);
        case CONNECT_NOTICE : return this.handleConnectNotice(data);
        case CONNECT_ANSWER : return this.handeleConnectAnswer(data);
        case DISCONNECT_NOTICE: return this.handleDisconnectNotice(data);
      }  
    });  
  }
  
  handleFriendRequest(data :Message) {
    
    let _id = this.ngRedux.getState().user._id;
    let f_name ="";
    this.friendService.getFriendsList(_id).subscribe((fList) => {
      
      //refresh fList from db
      this.ngRedux.dispatch({type:UPDATE_FRIENDS, body: fList });

      //find the sender's name with data.from(sender id) from friend list 
      let fListBox = []; fListBox.push(fList);
      fListBox[0].forEach((val) => {
        if(val._id = data.from)
          f_name = val.username;
      });
      let message = `${f_name} ${data.message}`;
      this.openSnackBar(message);
    });    
  }

  handleFriendAceept(data :Message) {
    
    let _id = this.ngRedux.getState().user._id;
    let f_name ="";
    this.friendService.getFriendsList(_id).subscribe((fList) => {
      //refresh fList from db
      this.ngRedux.dispatch({type:UPDATE_FRIENDS, body: fList });
      
      //find the sender's name with data.from(sender id) from friend list 
      let fListBox = []; fListBox.push(fList);
      
      fListBox[0].forEach((val) => {
        if(val._id = data.from)
          f_name = val.username;
      });
      let message = `${f_name} ${data.message}`;
      this.openSnackBar(message);
    });   
  }

  handleConnectNotice (data :Message) {
    let friendsList = this.ngRedux.getState().friends;

    /*Object.assign is critical part here not to change the this.this.ngRedux.getState().friends */
    let  fList = Object.assign([], friendsList);
    
    //fList becomes fList - sender
    let sender = fList.splice(fList.findIndex((friend) => {return friend._id == data.from;}),1);

    //send a answer
    if(data.contents.connected) {
      let message ={from:data.to, to:data.from, message:"", type:CONNECT_ANSWER};
      this.socketService.socket.emit('message',message);
    }

    //update friends list
    if(sender[0]) {
      sender[0].connected =true;
      fList.push(sender[0]);
      this.openSnackBar(data.message);
      this.ngRedux.dispatch({type:UPDATE_FRIENDS, body:fList});
    }
  }

  handeleConnectAnswer(data :Message) {
    let friendsList = this.ngRedux.getState().friends;
    let  fList = Object.assign([], friendsList);
    //fList becomes fList - sender 
    let sender = fList.splice(fList.findIndex((friend) => {return friend._id == data.from;}),1);
    if(sender[0]) {
      sender[0].connected =true;
      fList.push(sender[0]);
      this.ngRedux.dispatch({type:UPDATE_FRIENDS, body:fList});
    }
  }

  handleDisconnectNotice(data) {
    let friendsList = this.ngRedux.getState().friends;

    /*Object.assign is critical part here not to change the this.this.ngRedux.getState().friends */
    let  fList = Object.assign([], friendsList);
    
    //fList becomes fList - sender
    let sender = fList.splice(fList.findIndex((friend) => {return friend._id == data.from;}),1);

    //disconnected
    if(sender[0]){
      sender[0].connected =false;
      fList.push(sender[0]);
      this.ngRedux.dispatch({type:UPDATE_FRIENDS, body:fList});
    }
  }

  openSnackBar(message: string, action?: string, duration? :number) {
    this.snackBar.open(message, action, {
      duration: duration | 5000,
    });
  }
}
