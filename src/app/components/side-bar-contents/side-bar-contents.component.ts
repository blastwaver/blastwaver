import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Friend } from '../../models/Friend';
import { ISubscription } from 'rxjs/Subscription';
import { UPDATE_CHAT_ROOM } from '../../actions';

@Component({
  selector: 'side-bar-contents',
  templateUrl: './side-bar-contents.component.html',
  styleUrls: ['./side-bar-contents.component.css']
})
export class SideBarContentsComponent implements OnInit, OnDestroy {

  private friends :Array<Friend>;

  private fListSubscription$ :ISubscription;

  constructor( private ngRedux :NgRedux<IAppState>) { }

  ngOnInit() {
    this.fListSubscription$ =  this.ngRedux.select('friends').subscribe((fList) => {
      let array = []; array.push(fList);
      // console.log(array[0]);
      this.friends = array[0];
    })
  }

  chat(room) {
    this.ngRedux.dispatch({type:UPDATE_CHAT_ROOM, body:room});
  }

  ngOnDestroy() {
    this.fListSubscription$.unsubscribe();
  }

}
