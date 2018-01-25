import { Component, OnInit,OnDestroy, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState } from '../../../store';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'side-bar-table',
  templateUrl: './side-bar-table.component.html',
  styleUrls: ['./side-bar-table.component.css']
})
export class SideBarTableComponent implements OnInit, OnDestroy {

  private subscriptiton$ :ISubscription;
  
  
  dataSource ;

  constructor(private ngRedux: NgRedux<IAppState>) { }
  
  ngOnInit() {
    this.subscriptiton$ = this.ngRedux.select('friends').subscribe((state) => {
      let array =[];  array.push(state); 
      // let emtyLines = [{},{},{},{},{},{}];
      // let friends =  [...array[0],emtyLines];
      this.dataSource = new MatTableDataSource(array[0]);
    }); 
  }

  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  displayedColumns = ['_id', 'photoUrl', 'username', 'status'];
 



  ngOnDestroy(){
    this.subscriptiton$.unsubscribe();
  };
}


// export interface Elements {
//   id: string,
//   conState: string;
//   photo: string;
//   username: string;
//   state: string;
// }

const ELEMENT_DATA = [
  {_id:"asd",email: "true", photoUrl: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg', username: "nanana", status: "string"},
  
];

