import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';

@Component({
  selector: 'app-navbar-style-one',
  templateUrl: './navbar-style-one.component.html',
  styleUrls: ['./navbar-style-one.component.scss']
})
export class NavbarStyleOneComponent implements OnInit {
  constructor(private _apiService: ApiServiceService, private activate: ActivatedRoute , private route : Router) { }

  errorMessage: string = ''
  errorMessageCheck: string = ''
  password: string = '';
  confirmPassword: string = '';
  showRegisterForm: boolean = false;

  ngOnInit(): void {
  }

  userFormControl = new FormGroup({
    emailAddress: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })
  signinWithEmail() {
    console.log(this.userFormControl.value, this.userFormControl.valid);
    if (this.userFormControl.valid && !this.invalidEmail) {
      let signInObject = {
        loginName: this.userFormControl.value.emailAddress,
        loginPassword: this.userFormControl.value.password
      }
      this._apiService.login(signInObject)
        .then((res: any) => {
          console.log(res);
          if (res.success == false) {
            this.errorMessage = res.message
            this.errorMessageCheck = 'danger'
            setTimeout(() => {
              this.errorMessage = '',
                this.errorMessageCheck = ''
            }, 3000);
            this.userFormControl.reset();
            Object.keys(this.userFormControl.controls).forEach(key => {
              this.userFormControl.controls[key].setErrors(null)
            });

          }

          else {
            this.route.navigateByUrl('/dashboard');
            localStorage.setItem('UserObject' , JSON.stringify(res.returnValue))
          }
        })
        .catch((error: any) => {
          console.log(error);
          this.errorMessage = 'Please Fill the Form'
          this.errorMessageCheck = 'danger'
          setTimeout(() => {
            this.errorMessage = '',
              this.errorMessageCheck = ''
          }, 3000);
        })
    }

    else {
      this.errorMessage = 'Please Fill the Form'
      this.errorMessageCheck = 'danger'
      setTimeout(() => {
        this.errorMessage = '',
          this.errorMessageCheck = ''
      }, 3000);
    }
  }


  invalidMobile: boolean = false;
  //validate user mobile number
  inputMobile(event: any) {
    if (
      event.key?.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  validateMobile(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 10
    ) {
      this.invalidMobile = true;
    }

    else {
      this.invalidMobile = false;
    }
  }

  invalidEmail: boolean = false;
  invalidUserEmail: string = ''
  //validate user email
  validateUserEmail(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.target.value) == false) {
      this.invalidUserEmail = 'Invalid Email Address';
      return false;
    }
    this.invalidUserEmail = '';
    return true;
  }
  validateEmail(event: any) {
    const value = event.target.value;

    if (
      value &&
      !/^[0-9]*$/.test(value) &&
      !this.validateUserEmail(event)
    ) {
      this.invalidEmail = true;
    }

    else {
      this.invalidEmail = false;
    }
  }

}
