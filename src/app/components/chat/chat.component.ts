import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { Chat } from '../../models/Chat';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/Message';
import { SocketService } from '../../services/socket.service';
import { Router, NavigationStart } from '@angular/router';
import { UPDATE_CHAT_ROOM, UPDATE_TYPING_USERS } from '../../actions';
import { TypingUsers } from '../../models/TypingUser';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('scrollContainer') private scrollContainer: ElementRef;

  private contents = new Array();

  private messageContainerNumber: string;

  private roomNumber :string;

  private chatRoomSubscription$ :ISubscription;
  
  private userSubscription$ :ISubscription;

  private routerChangeSubscription$ :ISubscription;

  private emojiOn: boolean = false;

  private placeholder :string = "Type here";

  constructor(private ngRedux :NgRedux<IAppState>,
              private chatService :ChatService,
              private socketService :SocketService,
              private router: Router ) {}

  ngOnInit() {
    
    this.connectSokcetForMassage();
    this.observeRouterChangeForResetChatRoom();
    this.connectSokcetForChat();
    
  }
  
  //it allow refesh only changed element on html
  trackContents(index, content) {
    //content.chat 을 시간으로 바꾸어야함
   return content ? content.chat : undefined;
  }


  send(content) {
    if(!content.value || !this.roomNumber )
      return;

    let myProfile = this.ngRedux.getState().user;
    let array = []; array.push(myProfile);
    let data :Chat = { 
                       _id: array[0]._id,
                       room: this.roomNumber,
                       chat: content.value,
                       time: new Date().getTime().toString()
                      }
    this.socketService.socket.emit('chat', data);
    this.scrollBottom();
    
    //if it fails then someting has to be done for recall the chat
      //***something******/
    // this.chatService.addChat(data).subscribe(result =>{
      
    // }, err => {console.log(err)});
  }

  scrollBottom() {
    setTimeout(() =>{
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; 
    }, 50);
  }

  openEmojiDialog() {
    this.emojiOn = !this.emojiOn;
  }

  connectSokcetForMassage() {
    this.userSubscription$ = this.ngRedux.select('user').subscribe((user) => {
      this.messageContainerNumber = this.ngRedux.getState().user._id;  //defualt roomNumber(user _id) for recieving message
      this.socketService.socket.emit('room.join', this.messageContainerNumber);
    });
  }

  connectSokcetForChat() {
    this.chatRoomSubscription$ = this.ngRedux.select('chatRoom').subscribe((state)=> {
      
      //whenever the room number changes client should joined new room
      let array =[];  array.push(state); 
      this. roomNumber = array[0]; //the room want to join
      this.socketService.socket.emit('room.join', [this.messageContainerNumber, this.roomNumber]);
      
      //also get new data from radis server
      this.chatService.getChat(this.roomNumber).subscribe(result =>{
        this.contents = result; 
        this.scrollBottom();
      }, err => {console.log(err)});

      //reset typing User state
      this.ngRedux.dispatch({type: UPDATE_TYPING_USERS, body: []});
    });  
    
    //listen new chat through socket and add it to chat page
    this.socketService.socket.on('chat', (data :Chat) =>{
      // console.log(data);
      this.contents.push(data);
      this.scrollBottom();
    });  

    //knows the users who is typing 
    this.socketService.socket.on('typing', (data :TypingUsers) => {
      let users :Array<string> = this.ngRedux.getState().typingUsers;
      
      if(data.typing && !users.includes(data.username)){
        users.push(data.username);
      }
       
      if(!data.typing && users.includes(data.username)) {
        let index = users.indexOf(data.username);
        if (index !== -1) {
          users.splice(index, 1);
        // console.log(users)          
        }
      }
      
      //update state typing user
      this.ngRedux.dispatch({type:UPDATE_TYPING_USERS, body: users});
      //change the placeholder
      this.handleTypingUsers(this.ngRedux.getState().typingUsers);
      // console.log(this.ngRedux.getState().typingUsers)
    });

  }
  


  observeRouterChangeForResetChatRoom() {
    this.routerChangeSubscription$ = this.router.events.filter(event => event instanceof NavigationStart).subscribe((val) => {
      let array=[]; array.push(val);
      
      //if user move to another page or tep then rest the charRoom for clear
      this.ngRedux.dispatch({type: UPDATE_CHAT_ROOM, body: null});

      //if user move to another page send a typinguser false signal
      let name = this.ngRedux.getState().user.username;
      let roomNum = this.ngRedux.getState().chatRoom;
      let data :TypingUsers = {room: roomNum, username: name, typing:false };
      this.socketService.socket.emit('typing', data);
    }, (err) => {console.log(err)});
  }

  handleTypingUsers(array) {  
   let users =  array.join(); 
    if(array == 0)
      this.placeholder = "Type here";
    if(array.length == 1)
      this.placeholder = users + " is typing...";
    if(array.length > 1)
      this.placeholder = users + " are typing..." 
  }

  onBlur(){
    let name = this.ngRedux.getState().user.username;
    let roomNum = this.ngRedux.getState().chatRoom;
    let data :TypingUsers = {room: roomNum, username: name, typing:false };
    this.socketService.socket.emit('typing', data);
  }

  onFocus(){
    let name = this.ngRedux.getState().user.username;
    let roomNum = this.ngRedux.getState().chatRoom;
    let data :TypingUsers = {room: roomNum, username: name, typing: true};
    this.socketService.socket.emit('typing', data);
  }

  ngOnDestroy(){
    this.chatRoomSubscription$.unsubscribe();
    this.routerChangeSubscription$.unsubscribe();
    this.chatRoomSubscription$.unsubscribe();

  }
}

