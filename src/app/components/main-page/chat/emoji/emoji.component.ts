import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.css']
})
export class EmojiComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


export function emoji () {
  return [
    {}
  ]
}