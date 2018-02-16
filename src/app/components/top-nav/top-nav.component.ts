import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { Ng2DeviceService } from 'ng2-device-detector';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { Message } from '../../models/Message';
import { CONNECT_NOTICE, DISCONNECT_NOTICE } from '../../messageTypes';
import { Router } from '@angular/router';




@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit,OnDestroy  {

  public modalOn = false;

  public newNotificationNumber :number; 
  
  public loginState =false;

  public notificationOn = false;

  public loginStateSubscription$ :ISubscription;

  public messageSubscription$ :ISubscription;

  public browser :string;
  
  @ViewChild('menuTrigger') menu: any;

  constructor(private ngRedux: NgRedux<IAppState>,
              private auth: AuthService,
              private socketService :SocketService,
              private deviceService: Ng2DeviceService,
              private router :Router) { }
  
  ngOnInit() {
    this. browser = this.deviceService.getDeviceInfo().browser;
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
    if(this.browser != 'firefox')
      this.notificationOn = false;
  }
  
  //click inside of notificationcomponent
  clickInsideOfNofication(event) {
    event.preventDefault();
    event.stopPropagation();
  }

 signOut() {
    let fList = this.ngRedux.getState().friends;
    let user = this.ngRedux.getState().user;
    //sort friends id
    let friends_id = fList.map((friend) => {
      return friend._id;
    });

    //send a message
    let message = {from: user._id, to:friends_id, type:DISCONNECT_NOTICE,
                    message: `${user.username} has disconnected`, contents: {connected:false}};
    this.socketService.socket.emit('message',message);
 
    
    //auth sign out
    this.auth.signOut();

    //navigate to home
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.loginStateSubscription$.unsubscribe();
  }

}

