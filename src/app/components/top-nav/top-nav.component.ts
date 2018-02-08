import { Component, OnInit, OnDestroy } from '@angular/core';

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
  
  private loginState =false;

  private notificationOn = false;

  private subForloginState :ISubscription;

  constructor(private ngRedux: NgRedux<IAppState>,
              private auth: AuthService,
              private socketService :SocketService) { }
  
  ngOnInit() {
    this.subForloginState =  this.ngRedux.select('loginState').subscribe((state) =>{
      this.loginState = (state) ? true : false;
    });
  }

  openModal(){
    this.modalOn = true;
  }

  closeModal(modalState) {
    this.modalOn = modalState;
  }



  toggleNotification() {
    this.notificationOn = (this.notificationOn)? false :true;
  }

  ngOnDestroy() {
    this.subForloginState.unsubscribe();
  }
 
}

