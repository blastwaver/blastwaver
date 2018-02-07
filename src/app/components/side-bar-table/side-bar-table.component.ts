import { Component, OnInit,OnDestroy, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { FriendService } from '../../services/friend.service';
import { UPDATE_FRIENDS, UPDATE_CHAT_ROOM } from '../../actions';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/Message';
import { FREIND_ACCEPT } from '../../messageTypes';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'side-bar-table',
  templateUrl: './side-bar-table.component.html',
  styleUrls: ['./side-bar-table.component.css']
})
export class SideBarTableComponent implements OnInit, OnDestroy {

  private subscriptiton$ :ISubscription;
  
  private dataSource;
  
  constructor(private ngRedux: NgRedux<IAppState>,
              private friendService :FriendService,
              private messageService : MessageService,
              private socketServiece :SocketService) { }
  
  ngOnInit() {
    this.subscriptiton$ = this.ngRedux.select('friends').subscribe((state) => {
      let array =[];  array.push(state); 
      this.dataSource = new MatTableDataSource(array[0]);
    }); 
  }

  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  displayedColumns = ['_id', 'photoUrl', 'username', 'status'];
 


  acceptFriend(f_id) {
    let obj ={my_id:"",f_id:""};
    let user =this.ngRedux.getState().user;
    let name = user.username;
    obj.my_id = user._id;
    obj.f_id = f_id;
    //change status from both db
    this.friendService.acceptFriend(obj).subscribe((result) =>{
      if(result.result == 'succeed') {
        // refresh friend list
        this.friendService.getFriendsList(obj.my_id).subscribe((result)=>{   
          this.ngRedux.dispatch({type:UPDATE_FRIENDS, body: result })
        },(err) => {console.log(err)});
        //send a message to friend 
        let message :Message = { from: obj.my_id, to: obj.f_id, message:`accepted your friends request.`, type: FREIND_ACCEPT};  
        //send a message to friend's db
        this.messageService.addMessage(message).subscribe((result) => {
          //send a message by socket
          this.socketServiece.socket.emit('message', message);
        },(err) => {console.log(err)});
      }
    },(err) =>{console.log(err)});
  }


  openChatRoom(element) {
    this.ngRedux.dispatch({type: UPDATE_CHAT_ROOM, body: element.chatRoom});
  }

  ngOnDestroy(){
    this.subscriptiton$.unsubscribe();
  };
}





