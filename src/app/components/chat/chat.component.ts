import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { Chat } from '../../models/Chat';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/Message';
import { SocketService } from '../../services/socket.service';
import { Router, NavigationStart } from '@angular/router';
import { UPDATE_CHAT_ROOM } from '../../actions';

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
    
    this.chatService.addChat(data).subscribe(result =>{
      //if it fails then someting has to be done for recall the chat
      //***something******/
    }, err => {console.log(err)});
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
      console.log(this.messageContainerNumber);
      this.socketService.socket.emit('room.join', this.messageContainerNumber);
    });

    // this.socketService.socket.on('message', (data :Message) =>{
    //   console.log(data);
    // });  
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
    });  
    
    //listen new chat through socket and add it to chat page
    this.socketService.socket.on('chat', (data :Chat) =>{
      // console.log(data);
      this.contents.push(data);
      this.scrollBottom();
    });  

  }
  

  observeRouterChangeForResetChatRoom() {
    this.routerChangeSubscription$ = this.router.events.filter(event => event instanceof NavigationStart).subscribe((val) => {
      let array=[]; array.push(val);
      
      //if user move to another page or tep then rest the charRoom for clear
      this.ngRedux.dispatch({type: UPDATE_CHAT_ROOM, body: null});

    }, (err) => {console.log(err)});
  }


  ngOnDestroy(){
    this.chatRoomSubscription$.unsubscribe();
    this.routerChangeSubscription$.unsubscribe();
  }
}

