import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Friend } from '../../models/Friend';
import { ISubscription } from 'rxjs/Subscription';
import { UPDATE_CHAT_ROOM, SEARCHED_USER_MODAL_ON, SEARCHED_USER_DATA } from '../../actions';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'side-bar-contents',
  templateUrl: './side-bar-contents.component.html',
  styleUrls: ['./side-bar-contents.component.css']
})
export class SideBarContentsComponent implements OnInit, OnDestroy {

  friends :Array<Friend>;

  private fListSubscription$ :ISubscription;

  constructor( private ngRedux :NgRedux<IAppState>,
               private snackBar :MatSnackBar,) { }

  ngOnInit() {
    this.fListSubscription$ =  this.ngRedux.select('friends').subscribe((fList) => {
      let array = []; array.push(fList);
      // console.log(array[0]);
      this.friends = array[0];
    })
  }

  chat(data :Friend) {
    switch(data.status) {
      case 'friend': 
        this.ngRedux.dispatch({type:UPDATE_CHAT_ROOM, body:data.chatRoom});
        break;
      case 'request':
        this.openSnackBar("Wait until accept your firend request");
        break;
      case 'recieve': 
        this.openModal(data);
        this.openSnackBar("Need to accept the request first");
        break;
    }
  }


  openSnackBar(message: string, action?: string, duration? :number) {
    this.snackBar.open(message, action, {
      duration: duration | 5000,
    });
  }

  openModal(user){
    this.ngRedux.dispatch({type:SEARCHED_USER_MODAL_ON});
    this.ngRedux.dispatch({type:SEARCHED_USER_DATA, body:user});
  }

  ngOnDestroy() {
    this.fListSubscription$.unsubscribe();
  }
  
}
