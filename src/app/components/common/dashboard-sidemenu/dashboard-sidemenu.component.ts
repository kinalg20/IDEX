import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';

@Component({
  selector: 'app-dashboard-sidemenu',
  templateUrl: './dashboard-sidemenu.component.html',
  styleUrls: ['./dashboard-sidemenu.component.scss']
})
export class DashboardSidemenuComponent implements OnInit {

  roleName : any ;
  // adminRoutes : any = [];

  state: boolean = false;

  adminRoutes = [
    {
        id: '1',
        title: 'Dashboard',
        icon: 'bx bx-home-circle',
        url: '/dashboard',
    },
    {
        id: '2',
        title: 'Masters',
        icon: 'bx bx-layer',
        url: '',
        subMenu : [
          {
            id: '21',
            title: 'Link Generation',
            icon: 'bx bx-plus-circle',
            url: '/dashboard-add-listings',
          },
          {
            id: '21',
            title: 'Part Master',
            icon: 'bx bx-wallet',
            url: '/itemMaster',
          },
        ]
    }
  ]
  constructor(private router : Router , private apiService : ApiServiceService) { }

  userRole : any;
  ngOnInit(): void {      
    let Storage = localStorage.getItem('UserObject');
    if(Storage){
      this.userRole = JSON.parse(Storage)
      this.roleName = JSON.parse(Storage).roleName;
    }

  }

  logOut(){
    this.apiService.showMessage('Logout Successfully' , 'success')
    localStorage.removeItem('UserObject');
    this.router.navigateByUrl('/')
  }
}
