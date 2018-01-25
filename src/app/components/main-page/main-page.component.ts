import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';



@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  private innerWidth: any;
  private opened: boolean;


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

