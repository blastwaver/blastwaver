import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {

  constructor(private router :Router) { }

  ngOnInit() {
  
  }

  form = new FormGroup({
    name: new FormControl('',[
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.email,
      Validators.required
    ]),
    subject: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.maxLength(200))
  })

  get name() { return this.form.get('name');}  
  get email() { return this.form.get('email');} 
  get subject() { return this.form.get('subject')} 
  get comment() { return this.form.get('comment');}

  submit(event) {
    let validation = true;
    if(this.name.errors) {
      validation = false;
    }
    if(this.email.errors) {
      validation = false;      
      if(this.email.errors.required){

      } else {

      }
    }
   
    if(this.subject.errors){
      validation = false;
      
    }
    if(this.comment.errors) {
      validation = false;
      
    }

    if(validation) {
      console.log(this.name.value)
    }


    event.preventDefault();
  }
}
