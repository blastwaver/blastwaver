import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';



@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {

  private innerWidth: any;
  private opened: boolean;
  private roomTitle: string;
  private roomSubscription$: ISubscription;

  constructor(private ngRedux :NgRedux<IAppState>) { 
    this.innerWidth = (window.screen.width);
  }

  ngOnInit() {
    
    this.changeOpenStatus(this.innerWidth);
    
    this.roomSubscription$ = this.ngRedux.select('chatRoom').subscribe((state) => {
      if(state) {
        this.ngRedux.getState().friends.forEach(friend => {
          let arry = []; arry.push(friend);
          if(arry[0].chatRoom == state.toString()){
            this.roomTitle = arry[0].username;
          }
        })
      }
    }, (err) => console.log(err));
    

  }
 
  onResize(event) {
    this.innerWidth =event.target.innerWidth
    this.changeOpenStatus(this.innerWidth);
  }

  changeOpenStatus(width){
    this.opened = (width > 799) ? true: false;
  }

  test(test) {
    console.log(test
    );
  }

  ngOnDestroy() {
    this.roomSubscription$.unsubscribe();
  }
 
}

