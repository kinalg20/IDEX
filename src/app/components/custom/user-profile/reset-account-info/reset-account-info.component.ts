import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-reset-account-info',
  templateUrl: './reset-account-info.component.html',
  styleUrls: ['./reset-account-info.component.scss']
})
export class ResetAccountInfoComponent implements OnInit {
  showOTP: boolean = false;
  buttonName: string = 'Get OTP'
  constructor(public _apiService: ApiServiceService , private router :Router , public _utility : AppUtility) { }

  ngOnInit(): void {
  }

  forgotPasswordControl = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    emailAddress: new FormControl('', [Validators.required , Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]),
    OTP: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  })


  getOtp(phone : FormGroupDirective) {
    if (this.buttonName == 'Get OTP') {
      let object = {
        mobileNo: this.forgotPasswordControl.value.phoneNumber,
        loginName: this.forgotPasswordControl.value.emailAddress
      }
      if (this.forgotPasswordControl.valid) {
        this._utility.loader(true);
        this._apiService.forgotPassword(object)
        .then((res: any) => {
          this._utility.loader(false);
          console.log(res);
          if (res.success == false) {
            this._apiService.showMessage(res.message , 'error')
          }
          else {
            this._apiService.showMessage(res.message , 'success')
            this.showOTP = true;
            this.buttonName = 'Submit'
            this.forgotPasswordControl.get('OTP').addValidators(Validators.required);
            this.forgotPasswordControl.get('password').addValidators([Validators.required]);
            this.forgotPasswordControl.get('confirmPassword').addValidators(Validators.required);
            phone.resetForm();
          }
        })

      }
      else {
        this._apiService.showMessage('Enter Registered Mobile Number & Email Address', 'error');
      }
    }
    else {
      this._utility.loader(true);
      console.log(this.forgotPasswordControl.value.OTP);
      let object = {
        otp: this.forgotPasswordControl.value.OTP,
        mobileNo: this.forgotPasswordControl.value.phoneNumber,
        loginPassword : this.forgotPasswordControl.value.password
      }
      this._apiService.matchOTP(object).then((res: any) => {
        console.log(res);
        this._utility.loader(false);
        if (res.success == false) {
          this._apiService.showMessage(res.message , 'error')
        }
        else {
          this._apiService.showMessage(res.message , 'success')
          this.router.navigateByUrl('/')
        }
      })
      .catch((error:any)=>{
        Object.keys(this.forgotPasswordControl.controls).forEach(key => {
          this.forgotPasswordControl.controls[key].setErrors(null)
        });
      })
    }
  }


}
