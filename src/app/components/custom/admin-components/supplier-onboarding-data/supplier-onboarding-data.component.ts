import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-supplier-onboarding-data',
  templateUrl: './supplier-onboarding-data.component.html',
  styleUrls: ['./supplier-onboarding-data.component.scss']
})
export class SupplierOnboardingDataComponent implements OnInit {
  @ViewChild ('dt2') FilteredData:Table;
  msgs: Message[] = [];
  constructor(private route: Router, public _apiService: ApiServiceService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig, private _utility: AppUtility) { }
  errorMsg: string = ''
  errorMsgCheck: string = ''
  suppliers: any = [];
  header: string = 'Document Status'
  loading: boolean = true;
  document_dropdown: any = [];
  supplier_dropdown: any = [];
  supplierId: any;
  userDetails: any;
  display: boolean = false;

  ngOnInit(): void {
    this.getStatic();
    this.getAllTableData();
    this.loading = false;
    this.primengConfig.ripple = true;
    this.userDetails = this._utility.getLocalStorageDetails();
    console.log(this.supplierId);
    this.supplierId = this.userDetails.supplierId;
  }

  breadcrumb = [
    {
      title: 'Supplier Documents',
      subTitle: 'Dashboard'
    }
  ]

  getStatic() {
    this._apiService.dropdowndata('document')
      .then((res: any) => {
        this.document_dropdown = res.returnValue;
      })
  }

  clear(table: any) {
    table.clear();
  }

  filePath: any = {};
  getDocument(value: any) {
    this.filePath = this._utility.onFileChange(value);
  }

  getAllTableData() {
    this._utility.loader(true);
    this._apiService.getAllSupplierUploadedDoc().then((res: any) => {
      this._utility.loader(false);
      console.log(res);
      if (res.success == true) {
        this.suppliers = res.returnValue;
        // res.returnValue.forEach(element => {
        //   if (element.documentPath != '')
        //     this.suppliers?.push(element);
        // });
      }
      else {
        this.suppliers = [];
        this.errorMsg = res.message;
        this.errorMsgCheck = 'error'
        this._apiService.showMessage(this.errorMsg, this.errorMsgCheck);
      }
    })

    console.log(this.suppliers);    
  }


  default_status: any;
  documentData: any;
  openModel(document: any) {
    this.default_status = document.isApproved ? 1 : 3
    this.documentData = document;
    console.log(this.default_status);
    this.display = true;
  }


  filterval : string = '';
  dateFilterVal : string = '';
  reset(dt2) {
    dt2.reset();
    this.filterval = '';
    this.dateFilterVal = ''
  }

  updateStatus(document: any, isApproved: any) {
    console.log(isApproved);
    this._utility.loader(true);
    this.documentData = document;
    this.display = true;
    let userRole = this._utility.getLocalStorageDetails();
    let object = new FormData();
    object.append("onboardingId", this.documentData.onboardingId),
      object.append("isApproved", isApproved)
    object.append("roleName", userRole.roleName)
    object.append("statusId", JSON.stringify(isApproved == 'Approved' ? 1 : 2))
    console.log(this.default_status, object, this.documentData);
    this._apiService.updateDocStatus(object).then((res: any) => {
      this._utility.loader(false);
      console.log(res);
      if (res.success == true) {
        this.display = false;
        this.errorMsg = res.message
        this.errorMsgCheck = "success"
        this._apiService.showMessage(this.errorMsg, this.errorMsgCheck)
        this.getAllTableData();
      }

      else {
        this.display = false;
        this.errorMsg = res.message
        this.errorMsgCheck = "success"
        this._apiService.showMessage(this.errorMsg, this.errorMsgCheck)
      }
    })

      .catch((error: any) => {
        this.display = false;
      })
  }

}
