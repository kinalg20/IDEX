import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlDirective, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { invalid } from 'moment';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}

@Component({
    selector: 'app-ppap',
    templateUrl: './ppap.component.html',
    styleUrls: ['./ppap.component.scss']
})
export class PpapComponent implements OnInit {

    msgs: Message[] = [];
    constructor(private route: Router, public _apiService: ApiServiceService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig, public _utility: AppUtility, private fb: FormBuilder, private messageService: MessageService) { }
    loading: boolean = true;
    supplierId: any;
    submitButton: string = 'Submit'
    itemDetails: any = [];
    enquiry_dropdown: any = [];
    document_dropdown: any = [];

    products1: Product[];

    products2: any;
    roleName: any;

    clonedProducts: { [s: string]: Product; } = {};

    apqpGroup = new FormGroup({
        enquiryId: new FormControl('', [Validators.required]),
        supplierId: new FormControl(''),
        supplierId2: new FormControl('', [Validators.required]),
        documentPath: new FormControl('')
    })

    ngOnInit(): void {
        this.loading = false;
        this.primengConfig.ripple = true;
        this.roleName = this._utility.getLocalStorageDetails().roleName;
        this.supplierId = this._utility.getLocalStorageDetails().supplierId ?? '';
        if (this.supplierId) {
            this.apqpGroup.controls['supplierId'].setValue(this.supplierId)
        }
        this.getStatic();

    }

    breadcrumb = [
        {
            title: 'Supplier PPAP Documents',
            subTitle: 'Dashboard'
        }
    ]



    getStatic() {
        this._apiService.dropdowndata('document')
            .then((res: any) => {
                this.document_dropdown = res.returnValue;
            })
        let object = {
            Mode: 'Enquiry1',
            roleName: this._utility.getLocalStorageDetails().roleName,
            supplierId: this.supplierId,
            userIdC: this._utility.getLocalStorageDetails().loginId
        }
        this._apiService.dropdowndata('enquiry', object)
            .then((res: any) => {
                this.enquiry_dropdown = res.returnValue;
            })

    }


    enquiryId: any;
    display: boolean = false;
    supplierList: any = [];
    submitItemId : any = {};
    showItemName : any = {};
    lastUploaded : any;
    getAPQPList(customer?: any) {
        this.submitItemId = customer?.itemId ?? this.submitItemId;
        this.showItemName = customer?.itemName ?? this.showItemName;
        let object : any = {}
        if (this.apqpGroup.valid && this.apqpGroup.value?.supplierId2 && this.roleName != 'Supplier') {
            this._utility.loader(true);
            if (this.apqpGroup.value.supplierId2) {
                object = {
                    enquiryId: this.apqpGroup.value.enquiryId,
                    supplierId: this.apqpGroup.value.supplierId2['supplierId'],
                    itemId: this.submitItemId
                }
            }
        }

        else {
            object = {
                enquiryId: this.apqpGroup.value.enquiryId,
                supplierId: this.apqpGroup.value.supplierId,
                itemId : this.submitItemId
            }

        }
        this._apiService.getPPAPDataByItemId(object).then((res: any) => {
            this._utility.loader(false);
            if (res.success) {
                this.itemDetails = res.returnValue;
                this.itemDetails.forEach((v: any, index: any) => { v.index = index, v.targetDate = moment(v.targetDate).format('MM/DD/YYYY') })
                this.display = true;
            }
            else {
                this.itemDetails = []
;                this._apiService.showMessage(res.message, 'error');
            }
    
            console.log(this.itemDetails)
        })
    }



    onRowEditInit(product: any) {
        this.clonedProducts[product.id] = { ...product };
    }

    onRowEditSave(product: Product) {
        console.log(product, this.itemDetails);
        this.itemDetails.forEach((v: any) => { v.enquiryId = JSON.parse(this.apqpGroup.value.enquiryId), v.supplierId = this.apqpGroup.value.supplierId ? this.apqpGroup.value.supplierId : this.apqpGroup.value.supplierId2['supplierId'], v.targetDate = this._utility.dateTimeChange(v.targetDate) })
        let object: any = {
            enquiryId: JSON.parse(this.apqpGroup.value.enquiryId),
            supplierId: this.apqpGroup.value.supplierId ? this.apqpGroup.value.supplierId : this.apqpGroup.value.supplierId2['supplierId'],
            PPAPDetails: this.itemDetails
        };
        this._apiService.postPPAPDocument(object).then((res: any) => {
            console.log(res);
            if (res.success) {
                this._apiService.showMessage(res.message, 'success');
                this.getAPQPList();
                // this.apqpGroup.reset();
                // this.apqpGroup.controls['enquiryId'].setValue('');
                // this.apqpGroup.controls['supplierId'].setValue(this.supplierId ?? '');
                this.display = false;
                // this.itemDetails = [];
            }

            else {
                this._apiService.showMessage(res.message, 'error')
            }

            // this.getEnquiryData();
        })
    }

    onRowEditCancel(product: Product, index: number) {
        this.products2[index] = this.clonedProducts[product.id];
        delete this.products2[product.id];
    }

    upload_doc(event: any, product: any) {
        let file = this._utility.onFileChange(event);
        console.log(product[0].ppapId);
        if(product.length > 0){
            if (file != false && product[0].ppapId > 0) {
                let formData = new FormData();
                formData.append('supplierId', this.apqpGroup.value.supplierId);
                formData.append('enquiryId', this.apqpGroup.value.enquiryId);
                formData.append('ppapId', product[0].ppapId);
                formData.append('filepath', file);
                this._apiService.putPPAPDocument(formData).then((res: any) => {
                    console.log(res);
                    if (res.success) {
                        this._apiService.showMessage(res.message, 'success');
                        this.display = false;
                        this.apqpGroup.reset();
                        this.apqpGroup.controls['enquiryId'].setValue('');
                        this.apqpGroup.controls['supplierId'].setValue(this.supplierId ?? '');
                        this.itemDetails = [];
                    }
    
                    else {
                        this._apiService.showMessage(res.message, 'error');
                    }
                })
            }
        }
    }

    //call function based on role
    callFunctionBasedOnRole() {
        console.log(this.apqpGroup.valid , this.apqpGroup.value);
        if (this.apqpGroup.value.supplierId) {
            this._utility.loader(true);
            this.getPartDetails();
        }

        else {
            let object = {
                Mode: 'enquirywiseSupplier',
                Cond3: this.apqpGroup.value?.enquiryId,
                supplierId: 0
            }
            this.display = false;
            this._apiService.dropdowndata('', object).then((res: any) => {
                console.log(res);
                if (res.success == true) {
                    this.supplierList = res.returnValue;
                    this.apqpGroup.controls['supplierId2'].setValue('');
                    this.itemDetails = [];
                }
            })
        }
    }


    //getpartDetails
    getPartDetails() {
        let variable = this.enquiry_dropdown.filter(res => {
            return res.id == this.apqpGroup.value.enquiryId
        })

        let object1 = {
            enquiryNo: variable[0].value
        }

        this.getDashboardValue(object1);
    }

    enquiryItemDetails: any = [];
    async getDashboardValue(enquiryNo) {
        console.log(enquiryNo);
        let enquiryNo1 = enquiryNo.enquiryNo.split('-')
        await this._apiService.getenquiryDetailsById(enquiryNo1[0])
            .then((res: any) => {
                this._utility.loader(false);
                console.log(res.returnValue);
                if (res.success == true) {
                    this.enquiryItemDetails = res.returnValue.enquiryItemDetails;
                }
                else {
                    this.enquiryItemDetails = [];
                }
            })

            .catch((error: any) => {
                this._utility.loader(false);
                this._apiService.showMessage(error.message, 'error');
            })

        console.log(this.enquiryItemDetails);
    }

    //drawings
    editUploadedDrawing: any = [];
    displayDialog: boolean = false;
    getAllItemDrawing(itemId) {
        this._apiService.getEnggDrawing(itemId).then((res: any) => {
            if (res.success) {
                this.editUploadedDrawing = res.returnValue;
            }

            else {
                this.editUploadedDrawing = [];
            }
        })

        if (this.editUploadedDrawing.length > 0) {
            this.displayDialog = true;
        }

        console.log(this.editUploadedDrawing);
    }

    updateFile(){
        this.itemDetails[0].documentPath = '';
    }
}
