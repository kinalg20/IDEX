import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
import { md5 } from 'src/md5';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  constructor(private _apiService: ApiServiceService, private activate: ActivatedRoute, private route: Router, public _utility: AppUtility) { }
  errorMessage: string = ''
  errorMessageCheck: string = ''
  userArray: any;
  invalidEmail: boolean = false;
  submitButton: string = 'Submit'

  userRoles : any = [
    {id : 'User' , Name : 'User'},
    {id : 'normalUser' , Name : 'Normal User'},
    {id : 'bussinessHead' , Name : 'Bussiness head'},
    {id : 'precurementHead' , Name : 'Precurement head'},
    {id : 'Finance' , Name : 'Finance'},
  ]
  //formGroup
  userRegisterFormControl = new FormGroup({
    emailAddress: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]),
    name: new FormControl('', [Validators.required]),
    address: new FormControl(''),
    mobile_no: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    userRole: new FormControl('', [Validators.required]),
    checker: new FormControl(''),
    isActive: new FormControl(true , [Validators.required])
  },
    [AppUtility.MatchValidator('password', 'confirmPassword')]
  )


  ngOnInit(): void {
    this.getRegisteredUser();
  }

  breadcrumb = [
    {
      title: 'Register User',
      subTitle: 'Dashboard'
    }
  ]

  //Login Supplier
  registerUser(signup: FormGroupDirective) {
    console.log(this.userRegisterFormControl.value, this.userRegisterFormControl.valid);
    // let checker2 : any;
    let checker1 = this.userRegisterFormControl.value.checker == 'checker1' ? true : false;
    let checker2 = this.userRegisterFormControl.value.checker == 'checker2' ? true : false;
    if (this.userRegisterFormControl.valid) {
      this._utility.loader(true);
      if (this.submitButton == 'Submit') {
        let signUpObject = {
          loginName: this.userRegisterFormControl.value.emailAddress,
          loginPassword: md5(this.userRegisterFormControl.value.password),
          userName: this.userRegisterFormControl.value.name,
          address: this.userRegisterFormControl.value.address,
          mobileNo: this.userRegisterFormControl.value.mobile_no,
          roleName: this.userRegisterFormControl.value.userRole,
          checker1 : checker1 , 
          checker2 : checker2,
          isActive : this.userRegisterFormControl.value.isActive
        }
        this._apiService.register(signUpObject)
          .then((res: any) => {
            this._utility.loader(false);
            if (res.success == false) {
              window.scroll(0, 0);
              this.errorMessage = res.message
              this.errorMessageCheck = 'error'
              this._apiService.showMessage(this.errorMessage, this.errorMessageCheck)
            }

            else {
              this.errorMessage = res.message
              this.errorMessageCheck = 'success'
              this._apiService.showMessage(this.errorMessage, this.errorMessageCheck);
              this.userRegisterFormControl.reset();
              Object.keys(this.userRegisterFormControl.controls).forEach(key => {
                this.userRegisterFormControl.controls[key].setErrors(null);
              });
              signup.resetForm();
              this.userRegisterFormControl.controls['isActive'].setValue(true);
              this.getRegisteredUser();
            }
          })
      }

      else {
        console.log(this.Editpassword);        
        let signUpObject = {
          loginName: this.userRegisterFormControl.value.emailAddress,
          loginPassword: this.userRegisterFormControl.value.password != 'testL@123' ?  md5(this.userRegisterFormControl.value.password) : this.Editpassword,
          userName: this.userRegisterFormControl.value.name,
          address: this.userRegisterFormControl.value.address,
          mobileNo: this.userRegisterFormControl.value.mobile_no,
          roleName: this.userRegisterFormControl.value.userRole,
          loginId: this.editUserId,
          checker1 : checker1 , 
          checker2 : checker2,
          isActive : this.userRegisterFormControl.value.isActive
        }

        this._apiService.updateUserInfo(signUpObject).then((res: any) => {
          console.log(res);
          this._utility.loader(false);
          if (res.success == true) {
            this.errorMessage = res.message
            this.errorMessageCheck = 'success'
            this.userRegisterFormControl.reset();
            Object.keys(this.userRegisterFormControl.controls).forEach(key => {
              this.userRegisterFormControl.controls[key].setErrors(null)
            });
            signup.resetForm();
            this.userRegisterFormControl.controls['isActive'].setValue(true);
            this.submitButton = 'Submit'
            this.getRegisteredUser();

          }
          else {
            this.errorMessage = res.message
            this.errorMessageCheck = 'error'
            this._apiService.showMessage(this.errorMessage, this.errorMessageCheck);
          }
        })
      }
    }

    else {
      this._utility.loader(false);
      this.errorMessage = 'Please fill form details'
      this.errorMessageCheck = 'error'
      this._apiService.showMessage(this.errorMessage, this.errorMessageCheck);
    }
  }

  validateEmail(event: any, string: any) {
    let value = this._apiService.validateEmail(event);
    console.log(value);
    if (string == 'signin') {
      this.invalidEmail = value;
    }
  }


  invalidMobile: boolean = false;
  phone: string = ''
  //validate user mobile number
  validateMobile(event: any) {
    this.invalidMobile = this._utility.validateMobile(event);
  }

  getRegisteredUser() {
    this._apiService.getAllRegisteredUser().then((res: any) => {
      this.userArray = res.returnValue;
    })

    this.submitButton = 'Submit';
  }

  editUserId: any;
  Editpassword : any;
  EditItem(customer: any) {
    console.log(customer);
    this.Editpassword = customer.loginPassword;
    this.userRegisterFormControl.controls["emailAddress"].setValue(customer["loginName"]);
    this.userRegisterFormControl.controls["name"].setValue(customer["userName"]);
    this.userRegisterFormControl.controls["mobile_no"].setValue(customer["mobileNo"]);
    this.userRegisterFormControl.controls["address"].setValue(customer["address"]);
    this.userRegisterFormControl.controls["userRole"].setValue(customer["roleName"]);
    this.userRegisterFormControl.controls["password"].setValue('testL@123');
    this.userRegisterFormControl.controls["confirmPassword"].setValue('testL@123');
    this.userRegisterFormControl.controls["checker"].setValue(customer.checker1 ? 'checker1' : customer.checker2 ? 'checker2' : '');
    this.editUserId = customer.loginId;
    this.submitButton = 'Update';    
  }
}

