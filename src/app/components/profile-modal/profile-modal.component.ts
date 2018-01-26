import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges} from '@angular/core';
import { User } from '../../models/user';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { FriendService } from '../../services/friend.service';
import { UPDATE_FRIENDS } from '../../actions';


@Component({
  selector: 'profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent implements OnInit, OnChanges, OnDestroy {
  
  @Input('modal') modalOn :boolean;
  @Input('data') data :User;
  @Output() notify = new EventEmitter();

  private subscriptiton$ :ISubscription;
  
  private buttonState :string = null ;
  
  constructor(private ngRedux: NgRedux<IAppState>,
              private friendService :FriendService) { }

  ngOnInit() {
    
  }

  //@Input data is undefined initailly before click button from parent compoenet
  //when the data come from the parent component ngOnchage works
  ngOnChanges() {
    this.buttonState = null;
    if(this.data) {
      this.subscriptiton$ = this.ngRedux.select('friends').subscribe((state) => {
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
      }); 
      console.log(this.buttonState)
      
    }
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
    if(position == 'out'){
      this.modalOn = false;
    }
    this.notify.emit(this.modalOn);
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.subscriptiton$.unsubscribe();
  }
}
