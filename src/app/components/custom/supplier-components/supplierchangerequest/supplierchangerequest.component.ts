import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
import { md5 } from 'src/md5';

@Component({
  selector: 'app-supplierchangerequest',
  templateUrl: './supplierchangerequest.component.html',
  styleUrls: ['./supplierchangerequest.component.scss']
})

export class SupplierchangerequestComponent implements OnInit {
  supplierId: any;

  constructor(private _apiService: ApiServiceService, private router : Router , private activate: ActivatedRoute, private route: Router, public _utility: AppUtility) { }
  errorMessage: string = ''
  errorMessageCheck: string = ''
  userArray: any;
  invalidEmail: boolean = false;
  submitButton: string = 'Submit'
  imageUploadShowHide: boolean = false;

  //formGroup
  userRegisterFormControl = new FormGroup({
    changeRequest: new FormControl('', [Validators.required])
  })


  ngOnInit(): void {
    this.supplierId = this._utility.getLocalStorageDetails().supplierId;
    this.getChangeRequest();
    this.getBankDetails();
  }

  supplierList : any;

  breadcrumb = [
    {
      title: 'Raise Request',
      subTitle: 'Dashboard'
    }
  ]

  getChangeRequest(){
    let object = {
      Cond3 : this.supplierId,
      Mode : 'SupplierRaiseRequest'
    }
    this._apiService.dropdowndata('',object).then((res: any) => {
      console.log(res);
      this.ChangeRequest = res.returnValue;
    })
  }

  ChangeRequest: any = [];
  async getBankDetails() {
    this._utility.loader(true);
    let object = {
      Cond3 : this.supplierId,
      Mode : 'CRChangeList'
    }
    await this._apiService.dropdowndata('',object).then((res: any) => {
      if(res.success){
        console.log(res);
        if(res.success){
          this.ChangeRequest = res.returnValue;
        }
      }
    })

    if(this.ChangeRequest[0].approved){
      this.showChangeList = false;
    }
    else{
      this.showChangeList = true;
    }

    this._utility.loader(false);
  }

  showChangeList : boolean = true;
  submitRequest() {
    if(this.selectedRequest.length > 0){
      let supplierId = this._utility.getLocalStorageDetails()?.supplierId;
      this.selectedRequest.forEach((res:any)=>{
        res.supplierId = supplierId,
        res.CRChangeId = res.id,
        res.name = res.value
      })
      let object : any = {};
      object['raiseRequestDetails'] = this.selectedRequest;
      object['supplierId'] = this.selectedRequest[0].supplierId;
      this._apiService.supplierRaiseRequest(object).then((res:any)=>{
        if(res.success){
          this._apiService.showMessage(res.message , 'success');
          this.ChangeRequest = [];
          this.getBankDetails();
          this.router.navigateByUrl('/supplierMaster')
        }

        else{
          this._apiService.showMessage(res.message , 'error');
        }
      })
    }

    else{
      this._apiService.showMessage('Please Select Atleast one Request' , 'error');
    }
  }

  selectedRequest: any = [];
  request(event, data, index) {
    if (event.target.checked) {
      this.selectedRequest.push(data);
    }

    else {
      let i = this.selectedRequest.indexOf(data);
      this.selectedRequest.splice(i, 1);
    }


    console.log(this.selectedRequest);
  }
}
