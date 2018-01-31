import { Component, OnInit,OnDestroy, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { FriendService } from '../../services/friend.service';
import { UPDATE_FRIENDS, UPDATE_CHAT_ROOM } from '../../actions';

@Component({
  selector: 'side-bar-table',
  templateUrl: './side-bar-table.component.html',
  styleUrls: ['./side-bar-table.component.css']
})
export class SideBarTableComponent implements OnInit, OnDestroy {

  private subscriptiton$ :ISubscription;
  
  private dataSource;
  
  constructor(private ngRedux: NgRedux<IAppState>,
              private friendService :FriendService) { }
  
  ngOnInit() {
    this.subscriptiton$ = this.ngRedux.select('friends').subscribe((state) => {
      let array =[];  array.push(state); 
      this.dataSource = new MatTableDataSource(array[0]);
    }); 
  }

  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  displayedColumns = ['_id', 'photoUrl', 'username', 'status'];
 


  acceptFriend(f_id) {
    let obj ={my_id:"",f_id:""};
    obj.my_id = this.ngRedux.getState().user._id;
    obj.f_id = f_id;
    this.friendService.acceptFriend(obj).subscribe((result) =>{
      if(result.result == 'succeed') {
        this.friendService.getFriendsList(obj.my_id).subscribe((result)=>{   
          this.ngRedux.dispatch({type:UPDATE_FRIENDS, body: result })
        },(err) => {console.log(err)})
      }
    },(err) =>{console.log(err)});
  }


  openChatRoom(element) {
    this.ngRedux.dispatch({type: UPDATE_CHAT_ROOM, body: element.chatRoom});
  }

  ngOnDestroy(){
    this.subscriptiton$.unsubscribe();
  };
}





