import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private loginStateSubscription$ :ISubscription;

  loginState :boolean;

  modalOn :boolean;

  constructor(private ngRedux :NgRedux<IAppState>,
              private router :Router) { }

  ngOnInit() {
    this.handleLoginState();   
  }

  handleLoginState() {
    this.loginStateSubscription$ = this.ngRedux.select('loginState').subscribe((state) => {
      let array = []; array.push(state);
      this.loginState = array[0];
    });
  }

  start() {
    if(this.loginState) {
      this.router.navigate(['/main']);
    } else {
      this.modalOn = true;
    }
  }


  closeModal(modalState) {
    this.modalOn =modalState;
  }

  ngOnDestroy() {
    this.loginStateSubscription$.unsubscribe();
  }
}
