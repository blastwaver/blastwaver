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

  private scroll :any;

  private socket :any;

  private information = new Array();

  private roomNumber :string;

  private subscription$ :ISubscription;

  constructor(private ngRedux :NgRedux<IAppState>) {}

  ngOnInit() {

    this.socket = io({transports:['websocket'], upgrade: false});
    this.socket.on('chat', (data) =>{
      console.log(data);
      this.information.push(data);
    });  

    this.subscription$ = this.ngRedux.select('chatRoom').subscribe((state)=> {
      //whenever the room number changes client should joined new room
      let array =[];  array.push(state); 
      this. roomNumber = array[0];
      this.socket.emit('room.join', this.roomNumber);
      //also get new data from radis server
  
    });    
  }


  send(say) {
    console.log(this.roomNumber)
    let data = { chat:say.value, room: this.roomNumber}
    this.socket.emit('chat', data);
  }

  test() {
    this.scroll = this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    // this.scroll = this.scrollContainer.nativeElement.scrollHeight;
    console.log(this.scroll);
  }

  ngOnDestroy(){
    this.subscription$.unsubscribe();
  }
}
