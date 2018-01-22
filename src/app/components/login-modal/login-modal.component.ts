import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgRedux, select, NgReduxModule } from '@angular-redux/store';
import { IAppState } from '../../store';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AuthService } from '../../services/auth.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit,OnDestroy {

  @Input('modal') modalOn;
  @Output('notify') notify = new EventEmitter();

  private subscription :ISubscription;

  constructor(private ngRedux: NgRedux<IAppState>,
              private auth: AuthService,  
  ) {}

  ngOnInit() {
    this.subscription =  this.ngRedux.select('user').subscribe((user) =>{
      console.log(user);
      console.log(this.ngRedux.getState());
    }) 
  }

  close($event, position) {

    if(position == 'out'){
      this.modalOn = false;
    }
    this.notify.emit(this.modalOn);
    event.stopPropagation();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}