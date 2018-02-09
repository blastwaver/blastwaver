import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { Message } from '../../models/Message';
import { NgRedux } from '@angular-redux/store/lib/src/components/ng-redux';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { FREIND_ACCEPT, FREIND_REQUEST, GENERAL_MESSAGE, GREETING_MESSAGE } from '../../messageTypes';
import { MessageService } from '../../services/message.service';
import { UPDATE_MESSAGES } from '../../actions';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

 
  
  private messages :Array<Message> =[];

  private messageSubscription$ :ISubscription;

  private readonly FREIND_ACCEPT = FREIND_ACCEPT;

  private readonly FREIND_REQUEST = FREIND_REQUEST;

  private readonly GENERAL_MESSAGE = GENERAL_MESSAGE;
  
  private readonly GREETING_MESSAGE = GREETING_MESSAGE;
  
  constructor(private renderer :Renderer2,
              private ngRedux :NgRedux<IAppState>,
              private messageService :MessageService) { }
  ngOnInit() {
    this.messageSubscription$ = this.ngRedux.select('messages').subscribe((state) => {
      if(state) {
        let messagesBox = []; messagesBox.push(state);
      this.messages = messagesBox[0];
      }
      // console.log(this.messages)
    }, (err) => console.log(err));
  }


  trackNotification(index, massage){
    return massage ? massage.createdAt : undefined;
  }

  listClick(event :any, message :Message) {
    let li = event.currentTarget;
    let hidden = event.currentTarget.children[0].children[0].children[1];
    let angleIcon = event.currentTarget.children[0].children[0].children[0].children[2];

    
    if(li.classList.contains("expand")) {
      this.renderer.removeClass(li,"expand");
      if(hidden) {
        this.renderer.removeClass(hidden, "display");
        this.renderer.removeClass(angleIcon, "fa-angle-up");
        this.renderer.addClass(angleIcon, "fa-angle-down");
      }
    } else {
        this.renderer.addClass(li, "expand");
      if(hidden)
        this.renderer.addClass(hidden, "display");
        this.renderer.removeClass(angleIcon, "fa-angle-down");
        this.renderer.addClass(angleIcon, "fa-angle-up");
    }
    

    //change to read true
    if(!message.read) {
      this.messageService.setRead(message.to.toString(), message._id).subscribe((result) => {
        this.ngRedux.dispatch({type:UPDATE_MESSAGES, body:result});
      },(err) => {console.log(err)});
    }
  }


  deleteMessage(_id :string ,m_id :string) {
    // console.log(_id)
    event.stopPropagation();
    // this.ngRedux.getState()
    this.messageService.deleteMessage(_id, m_id).subscribe((result) => {
      this.ngRedux.dispatch({type:UPDATE_MESSAGES, body:result});
    },(err) => console.log(err));
  }

  readAll() {
    let _id = this.ngRedux.getState().user._id;
    this.messageService.setReadAll(_id).subscribe((result) => {
      this.ngRedux.dispatch({type:UPDATE_MESSAGES, body:result});
    });
  }

  removeAll() {
    let _id = this.ngRedux.getState().user._id;
    this.messageService.deleteMessageAll(_id).subscribe((result) => {
      this.ngRedux.dispatch({type:UPDATE_MESSAGES, body:result});
    },(err) => console.log(err));
  }

  stopPropagation(event) {  
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.messageSubscription$.unsubscribe();
  }
}
