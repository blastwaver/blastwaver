import { Component, OnInit, OnDestroy } from '@angular/core';

import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { AuthService } from '../../services/auth.service';




@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit,OnDestroy  {

  modalOn = false;
  
  loginState =false;

  private subForloginState :ISubscription;

  constructor(private ngRedux: NgRedux<IAppState>,
              private auth: AuthService) { }
  
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

  ngOnDestroy() {
    this.subForloginState.unsubscribe();
  }
 
}

