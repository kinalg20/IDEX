import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

export interface Supplier {
    isActive?: boolean;
    documentPath?: string;
    supplierName?: string;
    documentName?: string;
    documentId?: number;
    supplierId?: number;
    statusName?: string;
    uploadingDate?: string;
    onboardingId?: string
}

@Component({
    selector: 'app-supplier-onboarding',
    templateUrl: './supplier-onboarding.component.html',
    styleUrls: ['./supplier-onboarding.component.scss']
})
export class SupplierOnboardingComponent implements OnInit {
    @ViewChild ('dt2') FilteredData:Table;
    msgs: Message[] = [];
    constructor(private route: Router, public _apiService: ApiServiceService, private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private _utility : AppUtility) { }
    errorMsg: string = ''
    errorMsgCheck: string = ''
    suppliers: Supplier[];
    loading: boolean = true;
    document_dropdown: any = [];
    status_dropdown: any = [];
    supplier_dropdown: any = [];
    supplierId : any;
    submitButton : string = 'Submit'

    ngOnInit(): void {
        this.getStatic();
        this.getAllTableData();
        this.loading = false;
        this.primengConfig.ripple = true;
    }

    breadcrumb = [
        {
            title: 'Supplier Onboarding',
            subTitle: 'Dashboard'
        }
    ]


    getStatic() {
        this._apiService.dropdowndata('document')
            .then((res: any) => {
                this.document_dropdown = res.returnValue;
            })
                this._apiService.dropdowndata('status').then((res: any) => {
                this.status_dropdown = res.returnValue;
            })
    }

    filePath: any;
    getDocument(value: any , customer:any) {
        console.log(customer);        
        this.filePath = this._utility.onFileChange(value);
        console.log(this.filePath);        
        if(this.filePath != false){
            console.log(this.filePath);     
            this.editItem(customer);   
        }
    }

    getAllTableData() {
        let object = this._utility.getLocalStorageDetails();
        this._apiService.getSupplierDocById(object.supplierId)
            .then((res: any) => {
                console.log(res);
                this.suppliers = res.returnValue;
            })
    }

    deleteSupplier(id: any) {
        this._utility.loader(true);
        this._apiService.deleteSupplierDocs(id)
        .then((res: any) => {
            console.log(res);
            this._utility.loader(false);
            if(res.success == true){
                this.errorMsg = res.message,
                this.errorMsgCheck = 'success'
            }
            else {
                this.errorMsg = res.message,
                this.errorMsgCheck = 'error'
            }
            this._apiService.showMessage(this.errorMsg , this.errorMsgCheck);
            this.getAllTableData();
        })
    }


    confirm1(onboardingId:any) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to proceed?',
            header: 'Delete Supplier Record',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
                this.deleteSupplier(onboardingId);
            },
            reject: () => {
                this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
            }
        });
    }

    editItem(item : any){
        let formData = new FormData();
        this._utility.loader(true);
        let roleName = this._utility.getLocalStorageDetails().roleName;
        formData.append("roleName" , roleName);
        formData.append("onboardingId" ,  item.onboardingId);
        formData.append("filePath" ,  this.filePath);
        this._apiService.updateDocStatus(formData).then((res: any) => {
            this._utility.loader(false);
            console.log(res);
            if (res.success == false) {
                this.errorMsg = res.message,
                this.errorMsgCheck = 'error'
            }
            else {
                this.errorMsg = res.message,
                this.errorMsgCheck = 'success'
            }
            
            this._apiService.showMessage(this.errorMsg , this.errorMsgCheck)
            this.getAllTableData();
        })
    }
}
