import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef
} from '@angular/core';
import { ScrollStrategyOptions } from '@angular/cdk/overlay/typings/scroll/scroll-strategy-options';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollContainer') private scrollContainer: ElementRef;

  scroll;

  constructor() { }

  ngOnInit() {
    // this.scrollContainer.nativeElement.style('height',window.screen.height - 300);
    this.scroll = this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    
  }

  test() {
    this.scroll = this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    // this.scroll = this.scrollContainer.nativeElement.scrollHeight;
    console.log(this.scroll);
  }
}
