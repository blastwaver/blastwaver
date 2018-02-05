import { Pipe, PipeTransform } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';

@Pipe({
  name: 'imgUrl'
})
export class ImgUrlPipe implements PipeTransform {


  constructor(private ngRedux:NgRedux<IAppState>) {

  }

  transform(value: any, args?: any): any {
    let me = this.ngRedux.getState().user;
    let photoUrl :string = "";
    if(value == me._id) {
      photoUrl = me.photoUrl;
    }
    this.ngRedux.getState().friends.forEach((friend) =>{
      let friendBox=[]; friendBox.push(friend);
      if(friendBox[0]._id == value)
      photoUrl = friendBox[0].photoUrl;
    });
    
    return photoUrl;
  }
}
