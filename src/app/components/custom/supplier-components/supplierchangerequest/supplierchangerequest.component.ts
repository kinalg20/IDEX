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
    this.getBankDetails();
    let supplierId = this._utility.getLocalStorageDetails().supplierId;
  }

  supplierList : any;

  breadcrumb = [
    {
      title: 'Raise Request',
      subTitle: 'Dashboard'
    }
  ]

  //Login Supplier
  // registerUser(signup: FormGroupDirective) {
  //   if (this.userRegisterFormControl.valid) {
  //     this._utility.loader(true);
  //     let localStorageObject = this._utility.getLocalStorageDetails();
  //     let object = {
  //       raiseRemark: this.userRegisterFormControl.value.changeRequest,
  //       emailAddress: localStorageObject.loginName,
  //       supplierId: localStorageObject.supplierId
  //     }
  //     this._apiService.raiseRequest(object).then((res: any) => {
  //       console.log(res);
  //       if (res.success == true) {
  //         this._utility.loader(false);
  //         this._apiService.showMessage(res.message, 'success')
  //         this.userRegisterFormControl.reset();
  //         Object.keys(this.userRegisterFormControl.controls).forEach(key => {
  //           this.userRegisterFormControl.controls[key].setErrors(null)
  //         });
  //         signup.resetForm();
  //       }

  //       else {
  //         this._apiService.showMessage(res.message, 'error');
  //       }
  //     })
  //   }
  // }

  ChangeRequest: any = [];
  getBankDetails() {
    this._apiService.dropdowndata('CRChangeList').then((res: any) => {
      console.log(res);
      this.ChangeRequest = res.returnValue;
    })
  }

  submitRequest() {
    if(this.selectedRequest.length > 0){
      let supplierId = this._utility.getLocalStorageDetails()?.supplierId;
      this.selectedRequest.forEach((res:any)=>{
        res.supplierId = supplierId,
        res.CRChangeId = res.id,
        res.name = res.value
      })

      console.log(this.selectedRequest);
      let object : any = {};
      object['raiseRequestDetails'] = this.selectedRequest;
      object['supplierId'] = this.selectedRequest[0].supplierId;
      this._apiService.supplierRaiseRequest(object).then((res:any)=>{
        if(res.success){
          console.log(res);
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
