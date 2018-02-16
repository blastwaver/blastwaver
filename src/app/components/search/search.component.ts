import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { User } from '../../models/user';
import { MessageService } from '../../services/message.service';
import { FriendService } from '../../services/friend.service';
import { SocketService } from '../../services/socket.service';
import { UPDATE_FRIENDS, UPDATE_CHAT_ROOM } from '../../actions';
import { Message } from '../../models/Message';
import { FREIND_REQUEST, FREIND_ACCEPT } from '../../messageTypes';
import { Router } from '@angular/router';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  private searchedUserDataSubscription$ :ISubscription;

  private selectedUser :User;

  private defaultSelect :boolean;

  private buttonState :string;
  
  constructor(private ngRedux :NgRedux<IAppState>,
              private friendService :FriendService,
              private messageService :MessageService,
              private socketServiece :SocketService,
              private router :Router  
            ) { }

  ngOnInit() {
    
    this.handleSelectedUserInfo();
  }

  handleSelectedUserInfo() {
    this.searchedUserDataSubscription$ = this.ngRedux.select('searchUserData').subscribe((state) => {
      let stateBox =[]; stateBox.push(state);
      this.selectedUser =  stateBox[0];
      if(!stateBox[0]) {
        this.selectedUser = {username: "John Doe", 
                             photoUrl:"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
                             comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro tempora ratione a autem. Porro itaque unde iure temporibus nulla placeat commodi dolores! Molestias dolores dignissimos expedita eligendi? Expedita, corporis quisquam!",  
                             email:"naky@blastwaver.com"};
        this.defaultSelect = true;
      } else {
        this.defaultSelect = false;
        this.selectedUser =  stateBox[0];
        //reset button state
        this.buttonState = null;
        let state = this.ngRedux.getState().friends;
        let array =[];  array.push(state); 
        array[0].forEach(element => {
          //check the clicked user profile is one of my friend in my f list.  
          if(element._id === stateBox[0]._id ) 
            this.buttonState = element.status;
        });
        //check if this is my profile
        let my_id = this.ngRedux.getState().user._id; 
        if(my_id === stateBox[0]._id)
          this.buttonState = "me";
      }
    });
  }


  addFriend() {
    let obj ={my_id:"",f_id:""};
    obj.my_id = this.ngRedux.getState().user._id;
    obj.f_id = this.selectedUser._id;
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
    obj.f_id = this.selectedUser._id;
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


  chat(user){
    let friends = Object.assign([], this.ngRedux.getState().friends)
    let room = null;
    friends.forEach((friend) => {
    if(user._id == friend._id)
      this.ngRedux.dispatch({type: UPDATE_CHAT_ROOM, body:friend.chatRoom});
    });
    
    this.router.navigate(['/main']); 
  }

  ngOnDestroy(){
    this.searchedUserDataSubscription$.unsubscribe();
  }
}
