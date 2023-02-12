import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-verification-form',
  templateUrl: './verification-form.component.html',
  styleUrls: ['./verification-form.component.scss']
})
export class VerificationFormComponent implements OnInit {

  constructor(private route : Router , public _apiService : ApiServiceService , public _utility : AppUtility) { }

  errorMsg : string = ''
  errorMsgCheck : string = ''
  ngOnInit(): void {
  }
  verificationFormControl = new FormGroup({
    emailAddress: new FormControl('', [Validators.required ,  Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')] ),
    phone: new FormControl('')
  })

  verifyPhoneEmail(form : FormGroupDirective){
    console.log(this.verificationFormControl.value);    
    if(this.verificationFormControl.valid && !this.invalidEmail){
        this._utility.loader(true);
        let object = {
          mobileNo : this.verificationFormControl.value.phone,
          emailAddress : this.verificationFormControl.value.emailAddress,
          isApplied : false
        }

        console.log(object);        
        localStorage.clear();
        this._apiService.verifySupplier(object)
        .then((res:any)=>{
          this._utility.loader(false);
          if(res.success == false){
            this.errorMsg = res.message,
            this.errorMsgCheck = 'error'
            this._apiService.showMessage(this.errorMsg , this.errorMsgCheck)
          }
          else {
            localStorage.setItem('showRegister' , JSON.stringify('show'));
            if(res.returnValue[0].id){
              let object = {
                supplierId : res.returnValue[0].id
              }
              localStorage.setItem('already' , JSON.stringify(object))
              localStorage.setItem('supplier' , JSON.stringify(object))
            }
            this.route.navigateByUrl('register/'+ this.verificationFormControl.value.emailAddress)
              this.verificationFormControl.reset();
              Object.keys(this.verificationFormControl.controls).forEach(key => {
              this.verificationFormControl.controls[key].setErrors(null)
            });
            form.resetForm();
          }
        })
    }

    else {
      this.errorMsg = 'Please Fill the Form',
      this.errorMsgCheck = 'error'
      this._apiService.showMessage(this.errorMsg , this.errorMsgCheck)
    }
  }

  invalidMobile : boolean = false;

  validateMobile(event: any) {
    this.invalidMobile = this._utility.validateMobile(event);
  }

  invalidEmail:boolean = false;
  validateEmail(event:any){
    this.invalidEmail= this._apiService.validateEmail(event);
  }

}
