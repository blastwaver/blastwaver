import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  
  private checked: boolean;
  
  private disabled: boolean;

  private user : User;
  
  private subscription$: ISubscription;

  constructor(private ngRedux :NgRedux<IAppState>) { }

  ngOnInit() {
    this.subscription$ = this.ngRedux.select('user').subscribe((state) => {
      let array = []; array.push(state);
      this.user = array[0];
      this.checked = this.user.cProfile;
    }, (err) => { console.log(err)})
  }

  toggleChange(check) {
    this.checked = check.checked;
    
    // console.log(this.checked)
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
