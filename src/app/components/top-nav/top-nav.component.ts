import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent  {

  modalOn = false;
  
  constructor( ) { }
  
  openModal(){
    this.modalOn = true;
    
  }

  closeModal(modalState) {
    this.modalOn = modalState;
  }
 
}

