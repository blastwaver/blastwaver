import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAppState } from '../../store';
import { NgRedux } from '@angular-redux/store';
import { FriendService } from '../../services/friend.service';
import { User } from '../../models/user';
import { ISubscription } from 'rxjs/Subscription';
import { UPDATE_FRIENDS, SEARCHED_USER_MODAL_OFF, SEARCHED_USER_DATA, SEARCHED_USER_MODAL_ON } from '../../actions';

@Component({
  selector: 'users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.css']
})
export class UsersModalComponent implements OnInit, OnDestroy {
  
  subscriptitonModal$ :ISubscription;
  subscriptitonUserData$ :ISubscription;
  buttonState :string = null ;
  modalOn :boolean = false;
  data :User = null;
  
  constructor(private ngRedux: NgRedux<IAppState>,
              private friendService :FriendService) { }

  ngOnInit() {
    this.subscriptitonModal$ = this.ngRedux.select('searchUserModal').subscribe((modalState) => {
      this.modalOn = modalState ? true : false;
      // console.log(this.modalOn)
    });

    this.subscriptitonUserData$ = this.ngRedux.select('searchUserData').subscribe((userState) => {
      let array = []; array.push(userState);
      this.data = array[0];
      let my_id = this.ngRedux.getState().user._id; 
      
      this.buttonState = null;
      if(this.data) {
        let state = this.ngRedux.getState().friends
        let array =[];  array.push(state); 
        array[0].forEach(element => {
          //check the clicked user profile is one of my friend in my f list.  
          if(element._id === this.data._id ) 
            this.buttonState = element.status;
        });
        //check if this is my profile
        let my_id = this.ngRedux.getState().user._id; 
        if(my_id === this.data._id)
        this.buttonState = "me";
      }
        
    });
  }

  addFriend() {
    let obj ={my_id:"",f_id:""};
    obj.my_id = this.ngRedux.getState().user._id;
    obj.f_id = this.data._id;
    // console.log("my_id" + this.ngRedux.getState().user._id );
    // console.log("f_id" + obj.f_id );
    this.friendService.addFriend(obj).subscribe((result) =>{
      if(result.result == 'succeed') {
        this.buttonState = 'request';
        this.friendService.getFriendsList(obj.my_id).subscribe((result)=>{   
          this.ngRedux.dispatch({type:UPDATE_FRIENDS, body: result })
        },(err) => {console.log(err)})
      }
    },(err) =>{console.log(err)});
  }

  acceptFriend() {
    let obj ={my_id:"",f_id:""};
    obj.my_id = this.ngRedux.getState().user._id;
    obj.f_id = this.data._id;
    // console.log("my_id" + this.ngRedux.getState().user._id );
    // console.log("f_id" + obj.f_id );
    this.friendService.acceptFriend(obj).subscribe((result) =>{
      if(result.result == 'succeed') {
        this.buttonState = 'friend';
        this.friendService.getFriendsList(obj.my_id).subscribe((result)=>{   
          this.ngRedux.dispatch({type:UPDATE_FRIENDS, body: result })
        },(err) => {console.log(err)})
      }
    },(err) =>{console.log(err)});
  }

  close($event, position) {
    // console.log(position);
    if(position == 'out'){
      
      this.ngRedux.dispatch({type: SEARCHED_USER_MODAL_OFF});
    }
    this.ngRedux.dispatch({type: SEARCHED_USER_MODAL_OFF});
    // console.log(this.modalOn)
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.subscriptitonModal$.unsubscribe();
    this.subscriptitonUserData$.unsubscribe();
  }
}
