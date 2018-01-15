import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  @Input('modal') modalOn;
  @Output() notify = new EventEmitter();

  
  constructor() { }

  ngOnInit() {
    console.log(this.modalOn);
  }

  close($event, position) {
    if(position == 'out'){
      this.modalOn = false;
    }
    this.notify.emit(this.modalOn);
    event.stopPropagation();
  }
}
