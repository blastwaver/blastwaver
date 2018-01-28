import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store';
import { ISubscription } from 'rxjs/Subscription';

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

  constructor(private ngRedux :NgRedux<IAppState>) {}

  ngOnInit() {

    this.socket = io({transports:['websocket'], upgrade: false});
    this.socket.on('chat', (data) =>{
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
    });    
  }
  
  trackContents(index, content) {
    //content.chat 을 시간으로 바꾸어야함
   return content ? content.chat : undefined;
  }

  send(content) {
    let myProfile = this.ngRedux.getState().user;
    let array = []; array.push(myProfile);
    console.log(array[0]);
    let data = { username: array[0].username,
                 photoUrl: array[0].photoUrl,
                 room: this.roomNumber,
                 chat: content.value,
                 time: new Date()
                }
    this.socket.emit('chat', data);
    this.scrollBottom();
  }

  scrollBottom() {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  openEmojiDialog() {
    this.emojiOn = !this.emojiOn;
  }

  ngOnDestroy(){
    this.subscription$.unsubscribe();
  }
}

