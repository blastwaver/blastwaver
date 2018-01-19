import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent implements OnInit {
  
  @Input('modal') modalOn :boolean;
  @Input('data') data :User;
  @Output() notify = new EventEmitter();

  constructor() { }

  ngOnInit() {
    
  }

  close($event, position) {
    if(position == 'out'){
      this.modalOn = false;
    }
    this.notify.emit(this.modalOn);
    event.stopPropagation();
  }
}
