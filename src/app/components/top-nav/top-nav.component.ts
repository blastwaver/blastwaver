import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';




@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent  {

  modalOn = false;
  
  constructor() { }
  
  openModal(){
    this.modalOn = true;
  }

  closeModal(modalState) {
    this.modalOn = modalState;
  }
 
}

