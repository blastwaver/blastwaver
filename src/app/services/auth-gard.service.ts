import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';
import { ISubscription } from 'rxjs/Subscription';

@Injectable()
export class AuthGardService implements CanActivate {

  private loginStateSubscription$ :ISubscription; 
  
  constructor(private ngRedux :NgRedux<IAppState>, private router :Router)  { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(!this.ngRedux.getState().loginState) {
      this.router.navigate(['/home']);
    }
    return true;
  }
}
