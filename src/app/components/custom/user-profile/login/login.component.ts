import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
import { md5 } from 'src/md5';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  invalidEmail: boolean;

  constructor(private _apiService: ApiServiceService, private activate: ActivatedRoute, private route: Router , private _utility : AppUtility) { }

  errorMessage: string = ''
  errorMessageCheck: string = ''

  ngOnInit(): void {
  }

  
   //formGroup
   userFormControl = new FormGroup({
    emailAddress: new FormControl('', [Validators.required , Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]),
    password: new FormControl('', [Validators.required]),
  })

  //Login Supplier
  signinWithEmail() {
    this._utility.loader(true);
    console.log(this.userFormControl.value, this.userFormControl.valid);
    if (this.userFormControl.valid && !this.invalidEmail) {
      let signInObject = {
        loginName: this.userFormControl.value.emailAddress,
        loginPassword: md5(this.userFormControl.value.password)
      }
      this._apiService.login(signInObject)
        .then((res: any) => {
          console.log(res);          
          this._utility.loader(false);
          if (res.success == false) {
            window.scroll(0, 0);
            this.errorMessage = res.message
            this.errorMessageCheck = 'error'
            this._apiService.showMessage(this.errorMessage , this.errorMessageCheck)
          }

          else {
            localStorage.setItem('UserObject', JSON.stringify(res.returnValue))
            this.userFormControl.reset();
            Object.keys(this.userFormControl.controls).forEach(key => {
              this.userFormControl.controls[key].setErrors(null)
            });
            this.errorMessage = res.message
            this.errorMessageCheck = 'success'
            this._apiService.showMessage(this.errorMessage , this.errorMessageCheck)
            this.route.navigateByUrl('/dashboard-my-profile');
          }
        })
    }

    else {
      this._utility.loader(false);
      this._apiService.showMessage('Please enter your email address or password' , 'error');
    }
  }

  validateEmail(event: any, string: any) {
    let value = this._apiService.validateEmail(event);
    console.log(value);
    if (string == 'signin') {
      this.invalidEmail = value;
    }
  }

}
