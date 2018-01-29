import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store';
import { ISubscription } from 'rxjs/Subscription';
import { Chat } from '../../../models/Chat';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('scrollContainer') private scrollContainer: ElementRef;

  private socket :any;

  private contents = new Array();

  private roomNumber :string;

  private subscription$ :ISubscription;

  private emojiOn: boolean = false;

  constructor(private ngRedux :NgRedux<IAppState>,
              private chatService :ChatService ) {}

  ngOnInit() {

    this.socket = io({transports:['websocket'], upgrade: false});
    this.socket.on('chat', (data :Chat) =>{
      console.log(data);
      this.contents.push(data);
      this.scrollBottom();
    });  

    this.subscription$ = this.ngRedux.select('chatRoom').subscribe((state)=> {
      //whenever the room number changes client should joined new room
      let array =[];  array.push(state); 
      this. roomNumber = array[0];
      this.socket.emit('room.join', this.roomNumber);
      //also get new data from radis server
      this.chatService.getChat(this.roomNumber).subscribe(result =>{
        console.log(result);
        this.contents = result; 
        //give a delay untill rendering is done.
        this.scrollBottom();
      }, err => {console.log(err)});

      
    });    
  }
  
  trackContents(index, content) {
    //content.chat 을 시간으로 바꾸어야함
   return content ? content.chat : undefined;
  }

  send(content) {
    
    if(!content.value|| content.value == undefined)
      return;
    let myProfile = this.ngRedux.getState().user;
    let array = []; array.push(myProfile);
    console.log(array[0]);
    let data :Chat = { username: array[0].username,
                       photoUrl: array[0].photoUrl,
                       room: this.roomNumber,
                       chat: content.value,
                       time: new Date().toString()
                      }
    this.socket.emit('chat', data);
    this.scrollBottom();
    
    this.chatService.addChat(data).subscribe(result =>{
      console.log(data.room);
      console.log(result);
    }, err => {console.log(err)});
  }

  scrollBottom() {
    setTimeout(() =>{
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; 
    }, 100);
  }

  openEmojiDialog() {
    this.emojiOn = !this.emojiOn;
  }

  ngOnDestroy(){
    this.subscription$.unsubscribe();
  }
}

