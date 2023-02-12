import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  loginAuth : any;
  authorizedflag : boolean = false;
  constructor(private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.loginAuth = localStorage.getItem('UserObject');
    if(route.routeConfig.path == 'login'){
      if(!this.loginAuth){
        return true;
      }

      else{
        this.router.navigateByUrl('/dashboard-my-profile');
        return false;
      }
    }

    else{
    if(this.loginAuth){  
      this.loginAuth = JSON.parse(this.loginAuth);
      let roles = route.data.roles as Array<string>;
      this.authorizedflag = false;
      if(roles){
        for(var i = 0; i< roles.length; i++){
          if( roles[i].toString() == this.loginAuth.roleName){
            this.authorizedflag = true;
          }    
        }
    
        if(this.authorizedflag == true){
          return true;
        }
  
        else {
          this.router.navigateByUrl('/dashboard-my-profile');
          return false;
        }
      }
    }

    else{
      localStorage.removeItem('UserObject');  
      this.router.navigateByUrl('/login');
      return true;
    }
    }
    
  }
  
}
