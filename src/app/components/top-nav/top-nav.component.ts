import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';

import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { Message } from '../../models/Message';




@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit,OnDestroy  {

  private modalOn = false;

  private newNotificationNumber :number; 
  
  private loginState =false;

  private notificationOn = false;

  private loginStateSubscription$ :ISubscription;

  private messageSubscription$ :ISubscription;
  
  @ViewChild('menuTrigger') menu: any;

  constructor(private ngRedux: NgRedux<IAppState>,
              private auth: AuthService,
              private socketService :SocketService) { }
  
  ngOnInit() {
    this.loginstateSubscription();
    this.messageSubscription();
  }

  openModal(){
    this.modalOn = true;
  }

  closeModal(modalState) {
    this.modalOn = modalState;
  }

  loginstateSubscription() {
    this.loginStateSubscription$ =  this.ngRedux.select('loginState').subscribe((state) =>{
      this.loginState = (state) ? true : false;
    });
  }

  messageSubscription() {
    this.messageSubscription$ = this.ngRedux.select('messages').subscribe((messages) => {
      let messagesBox = []; messagesBox.push(messages);
      let counter = 0;
      messagesBox[0].forEach(message => {
        if(!message.read) counter++;
      });
      this.newNotificationNumber = counter;
    });
  }

  toggleNotification() {
      this.notificationOn = (this.notificationOn)? false :true;
      event.preventDefault();
      event.stopPropagation();
      this.menu.closeMenu();
  }

  //click out side notificationcomponent
  @HostListener('document:click', ['$event']) clickedOutsideOfNofication(event){
    this.notificationOn = false;
  }
  
  //click inside of notificationcomponent
  clickInsideOfNofication(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.loginStateSubscription$.unsubscribe();
  }

}

