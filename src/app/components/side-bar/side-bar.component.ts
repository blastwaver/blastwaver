import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  innerWidth: any;
  opened: boolean;

  constructor() { 
    this.innerWidth = (window.screen.width);
  }

  ngOnInit() {
    this.changeOpenStatus(this.innerWidth);
  }

 
  onResize(event) {
    this.innerWidth =event.target.innerWidth
    this.changeOpenStatus(this.innerWidth);
  }

  changeOpenStatus(width){
    this.opened = (width > 799) ? true: false;
  }
}
