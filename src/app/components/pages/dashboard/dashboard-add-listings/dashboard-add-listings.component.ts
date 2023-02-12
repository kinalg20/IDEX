import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

export interface Customer {
    id?: number;
    isApplied?: boolean;
    mobileNo?: string;
    totalRecords?: number,
    emailAddress?: string,
}

@Component({
    selector: 'app-dashboard-add-listings',
    templateUrl: './dashboard-add-listings.component.html',
    styleUrls: ['./dashboard-add-listings.component.scss']
})
export class DashboardAddListingsComponent implements OnInit {
    msgs: { severity: string; summary: string; detail: string; }[];

    constructor(private route: Router, public _apiService: ApiServiceService , public _utility : AppUtility) { }
    customers: Customer[];
    loading: boolean = true;
    submitButton: boolean = false;
    ngOnInit(): void {
        this.getSupplier();
    }

    breadcrumb = [
        {
            title: 'Supplier Link Generation',
            subTitle: 'Dashboard'
        }
    ]
    dateFilterVal:string;
    filterval: string;


    //form group
    AddSupplierFormControl = new FormGroup({
        emailAddress: new FormControl('', [Validators.required , Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]),
        phone: new FormControl(null , [Validators.maxLength(15) , Validators.minLength(10)]),
        countryCode : new FormControl('+91'),
    })

    //submit function
    AddSupplierSubmit(addSupplier : FormGroupDirective) {
        console.log(this.AddSupplierFormControl.valid);
        this.submitButton = true;
        if (this.AddSupplierFormControl.valid) {
            console.log(this.AddSupplierFormControl.value.phone);
            this._utility.loader(true);
            let object = {
                // mobileNo: this.AddSupplierFormControl.value.countryCode + '-' +this.AddSupplierFormControl.value.phone,
                emailAddress: this.AddSupplierFormControl.value.emailAddress
            }

            if(this.AddSupplierFormControl.value.phone){
                object['mobileNo'] = this.AddSupplierFormControl.value.countryCode + '-' +this.AddSupplierFormControl.value.phone;
            }

            this._apiService.generateLinkForSupplier(object)
            .then((res: any) => {
                this._utility.loader(false);
                console.log(res);
                if (res.success == false) {
                    this.submitButton = false;
                    this._apiService.showMessage(res.message , 'error')
                }
                else {
                    this.submitButton = false;
                    this._apiService.showMessage(res.message , 'success')
                    this.AddSupplierFormControl.reset();
                    Object.keys(this.AddSupplierFormControl.controls).forEach(key => {
                        this.AddSupplierFormControl.controls[key].setErrors(null)
                    });
                    addSupplier.resetForm();
                    this.AddSupplierFormControl.controls['countryCode'].setValue('+91')
                }
                this.getSupplier();
            })
        }

    }

    totalRecords: any;
    getSupplier() {
        this._utility.loader(true);
        this._apiService.getAllLinkedSupplier().then((res: any) => {
            this._utility.loader(false);
            console.log(res);
            this.loading = false;
            if (res.success == true) {
                this.customers = res.returnValue;
                this.totalRecords = this.customers[0].totalRecords
            }

            else {
                this.customers = [];
            }
        })
        .catch((error: any) => {
            this._utility.loader(false);
            this.customers = [];
        })
    }

    clear(table: any) {
        table.clear();
    }
    
  reset(dt2) {
    dt2.reset();
    this.filterval = '';
    this.dateFilterVal = ''
  }
}