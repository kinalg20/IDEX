import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss']
})

export class SuccessPageComponent implements OnInit {
  // @Input() statusMsg: any;
  role: any;
  redirectMessage: string = '';
  state: boolean = true;

  constructor(private router: Router, private apiService: ApiServiceService, private _utility : AppUtility) {}

  ngOnInit(): void {
    this.redirectMessage = 'Thank you for registration';
  }
}