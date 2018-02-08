import { Component, OnInit, Renderer2 } from '@angular/core';
import { Message } from '../../models/Message';
import { NgRedux } from '@angular-redux/store/lib/src/components/ng-redux';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { FREIND_ACCEPT, FREIND_REQUEST } from '../../messageTypes';
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

  constructor(private renderer :Renderer2,
              private ngRedux :NgRedux<IAppState>,
              private messageService :MessageService) { }
  ngOnInit() {
    this.messageSubscription$ = this.ngRedux.select('messages').subscribe((state) => {
      let messagesBox = []; messagesBox.push(state);
      this.messages = messagesBox[0];
      // console.log(this.messages)
    }, (err) => console.log(err));
  }


  trackNotification(index, massage){
    return massage ? massage.createdAt : undefined;
  }

  listClick(event :any, messageType :string) {
    let li = event.currentTarget;
    let hidden = event.currentTarget.children[0].children[0].children[1];
    // console.log(hidden)
    if(messageType ==  FREIND_REQUEST ){
      if(li.classList.contains("expand")) {
        this.renderer.removeClass(li,"expand");
      if(hidden)
        this.renderer.removeClass(hidden, "display");
      } else {
          this.renderer.addClass(li, "expand");
        if(hidden)
          this.renderer.addClass(hidden, "display");
      }
    }
  }


  deleteMessage(_id :string ,m_id :string) {
    console.log(_id)
    this.messageService.deleteMessage(_id, m_id).subscribe((result) => {
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
