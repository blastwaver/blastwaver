import { Pipe, PipeTransform } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';
import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  constructor(private ngRedux:NgRedux<IAppState>) {

  }

  transform(value: any, args?: any): any {
    let me = this.ngRedux.getState().user;
    let name :string = "";
    if(value == me._id) {
      name = me.username;
    }
    this.ngRedux.getState().friends.forEach((friend) =>{
      let friendBox=[]; friendBox.push(friend);
      if(friendBox[0]._id == value)
        name = friendBox[0].username;
    });
    
    return name;
  }

}
