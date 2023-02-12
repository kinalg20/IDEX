import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit{
  myDate: Date;
  header: string;
  primengConfig: any;
  userroleName: any;
  stateDropdown: any;
  paymentDropdown: any;
  purposeDropdown: any;
  manufacturingData: any = [];
  materialConstructionData: any = [];
  otherCategoryArray: any;
  document_dropdown: any;
  currencyDropdown: any;
  @Input() supplierList : any;

  breadcrumb = [
    {
      title: 'Supplier List',
      subTitle: 'Dashboard'
    }
  ]

  constructor(private _utility : AppUtility , private _apiService : ApiServiceService){

  }
  ngOnInit(): void {
    this.getStatic();
    this.myDate = new Date();
    this.header = "Supplier Detail"
    this.userroleName = this._utility.getLocalStorageDetails();
  }

  getStatic() {
    let data = this._utility.getDropdownData();
    data.then((res) => {
      res.forEach((response: any) => {
        if (response.stateDropdown) {
          this.stateDropdown = response.stateDropdown;
        }
        else if (response.paymentDropdown) {
          this.paymentDropdown = response.paymentDropdown;
        }
        else if (response.purposeDropdown) {
          this.purposeDropdown = response.purposeDropdown;
        }
        else if (response.otherCategoryData) {
          this.otherCategoryArray = response.otherCategoryData;
        }
      });
    })

    this._apiService.dropdowndata('document').then((res: any) => {
      this.document_dropdown = res.returnValue;
    })

    this._apiService.dropdowndata('currency').then((res: any) => {
      this.currencyDropdown = res.returnValue;
    })
  }
}
