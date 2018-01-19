import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UserService } from '../../../../services/user.service';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.css']
})

export class PeopleSearchComponent  {

  search_result :string[];

  searchInput: Subject<string> = new Subject<string>();
  
  modalOn = false;

  clickedUser;

  dataSource;

  constructor(private userService: UserService ) {

    this.searchInput
      .debounceTime(1000) // wait 1s after the last event before emitting last event
      .distinctUntilChanged() // only emit if value is different from previous value
      .subscribe((value) => {
        this.userService.searchUsers(value).subscribe(result =>{
          this.dataSource = new MatTableDataSource(result);
        }, err => {console.log(err)});
      });
  }

  search(value: string) {
    this.searchInput.next(value);
  }

  displayedColumns = ['position', 'name', 'weight', 'symbol'];


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  
  openModal(user){
    this.clickedUser = user; 
    this.modalOn = true;
  }

  closeModal(modalState) {
    this.modalOn = modalState;
  }

}

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: Element[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];