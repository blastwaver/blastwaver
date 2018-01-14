import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'side-bar-table',
  templateUrl: './side-bar-table.component.html',
  styleUrls: ['./side-bar-table.component.css']
})
export class SideBarTableComponent implements OnInit {

  dataSource: MatTableDataSource<any>;

  @Input('columns') displayedColumns: string[] ;
  @Input('data') data :any[];
  @Input('title') title: string;
  @Input('filter') filter: boolean;

  constructor() { }

  ngOnInit() {
    
    this.dataSource = new MatTableDataSource(this.data);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}

