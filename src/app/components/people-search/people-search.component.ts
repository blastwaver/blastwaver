import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { SEARCHED_USER_MODAL_ON, SEARCHED_USER_DATA, SEARCHED_USER_MODAL_OFF } from '../../actions';

@Component({
  selector: 'people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.css']
})

export class PeopleSearchComponent implements OnInit {

  search_result :string[];

  searchInput: Subject<string> = new Subject<string>();
  
  modalOn :boolean = false;

  // clickedUser;

  private dataSource :MatTableDataSource<any>;

  constructor(private userService: UserService,
              private ngRedux: NgRedux<IAppState> ) {

    this.searchInput
      .debounceTime(1000) // wait 1s after the last event before emitting last event
      .distinctUntilChanged() // only emit if value is different from previous value
      .subscribe((value) => {
        this.userService.searchUsers(value).subscribe(result =>{
          this.dataSource = new MatTableDataSource(result);
        }, err => {console.log(err)});
      });
  }

  ngOnInit() {
  }

  search(value: string) {
    if(value)
      this.searchInput.next(value);
  }

  displayedColumns = ['Users', 'Name', 'Email', 'State'];

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  
  openModal(user){
    // this.clickedUser = user; 
    // this.modalOn = true;
    this.ngRedux.dispatch({type:SEARCHED_USER_MODAL_ON});
    this.ngRedux.dispatch({type:SEARCHED_USER_DATA, body:user});

    // console.log(this.ngRedux.getState().searchUserData);
  }

  // closeModal(modalState) {
  //   this.modalOn = modalState;
  // }

}

