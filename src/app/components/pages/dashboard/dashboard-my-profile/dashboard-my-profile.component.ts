import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
import { md5 } from 'src/md5';

@Component({
    selector: 'app-dashboard-my-profile',
    templateUrl: './dashboard-my-profile.component.html',
    styleUrls: ['./dashboard-my-profile.component.scss']
})
export class DashboardMyProfileComponent implements OnInit {

    password: string = ''
    confirmPassword: string = ''
    supplierId: any;
    localStorageObject: any;
    supplierProfile: any = []
    constructor(private _apiService: ApiServiceService, private _utitlity: AppUtility) { }

    ngOnInit(): void {
        this.localStorageObject = this._utitlity.getLocalStorageDetails();
        this.getProfileData();
    }

    changePasswordFormControl = new FormGroup({
        loginPassword: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required])
    })

    breadcrumb = [
        {
            title: 'My Profile',
            subTitle: 'Dashboard'
        }
    ]

    changePassword(form : FormGroupDirective) {
        if (!(this.password == '' && this.confirmPassword != '') && !(this.password != "" && this.password != this.confirmPassword) && !(this.password.length < 8 && this.password == this.confirmPassword) && this.changePasswordFormControl.valid && this.samePasswordError.length==0) {
            this._utitlity.loader(true);
            let object = {
                "loginId": this.localStorageObject.loginId,
                "loginPassword": md5(this.changePasswordFormControl.value.loginPassword),
                "newPassword": md5(this.changePasswordFormControl.value.password)
            }

            this._apiService.changePassword(object)
            .then((res: any) => {
                this._utitlity.loader(false);
                if(res.success == true){
                    this._apiService.showMessage(res.message , 'success');
                    this.changePasswordFormControl.reset();
                    Object.keys(this.changePasswordFormControl.controls).forEach(key => {
                        this.changePasswordFormControl.controls[key].setErrors(null)
                      });
                    form.resetForm();

                }
                else{
                    this._apiService.showMessage(res.message , 'error');
                }
            })
        }
    }

    async getProfileData() {
        if (this.localStorageObject) {
           let object = {
            roleName : this.localStorageObject.roleName,
            loginId : this.localStorageObject.loginId
           }
            await this._apiService.profile(object).then((res:any)=>{
                console.log(res);         
                this.supplierProfile = res.returnValue;       
            })
        }
    }

    


    samePasswordError : string = ''
    checkForPassword(){
        console.log(this.changePasswordFormControl.controls['loginPassword'] );        
        if(this.changePasswordFormControl.controls['loginPassword'].value == this.changePasswordFormControl.controls['password'].value || this.changePasswordFormControl.controls['loginPassword'].value == this.changePasswordFormControl.controls['confirmPassword'].value){
            this.samePasswordError = 'Old Password and New Password Cannot be Same'
            console.log(this.samePasswordError);            
        }

        else{
            this.samePasswordError = ''
        }
    }

}