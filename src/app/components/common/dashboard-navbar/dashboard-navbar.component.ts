import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.scss']
})
export class DashboardNavbarComponent implements OnInit {

  userProfile : any;
  errorMessage: string = ''
  errorMessageCheck: string = ''
  constructor(private _utility : AppUtility , private router : Router,private _apiService: ApiServiceService) { }

  ngOnInit(): void {
    let userData  = this._utility.getLocalStorageDetails();
    this.userProfile = userData;
  }

  logout(){
    localStorage.removeItem('UserObject');
    this.router.navigateByUrl('/login');
    this.errorMessage = "Log out successfully!",
    this.errorMessageCheck = 'success'
    this._apiService.showMessage(this.errorMessage , this.errorMessageCheck)
  }

}
