import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import { Message } from '../../models/Message';
import { SocketService } from '../../services/socket.service';
import { FREIND_REQUEST, FREIND_ACCEPT, CONNECT_NOTICE } from '../../messageTypes';
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
      switch(data.type) {
        case FREIND_REQUEST :  return this.handleFriendRequest(data);
        case FREIND_ACCEPT : return this.handleFriendAceept(data);
        case CONNECT_NOTICE : return this.handleConnectNotice(data);
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
    let fList = this.ngRedux.getState().friends;
    let ss = fList;
    
    //fList becomes fList - sender 
    let sender = fList.splice(fList.findIndex((friend) => {return friend._id == data._id;},1));

    if(sender[0]) {
      let newInfo = data.contents.connected;
      let oldInfo = sender[0].connected;
      //connected
      if(!oldInfo && newInfo) {
        sender[0].connected =true;
        fList.push(sender[0]);
        // console.log(fList)
        this.ngRedux.dispatch({type:UPDATE_FRIENDS, body:fList});
      }
      //disconnected
      if(oldInfo && !newInfo){
        sender[0].connected =false;
        fList.push(sender[0]);
        // console.log(fList)
        this.ngRedux.dispatch({type:UPDATE_FRIENDS, body:fList});
      }
    }
  }
  
  openSnackBar(message: string, action?: string, duration? :number) {
    this.snackBar.open(message, action, {
      duration: duration | 5000,
    });
  }W
}
