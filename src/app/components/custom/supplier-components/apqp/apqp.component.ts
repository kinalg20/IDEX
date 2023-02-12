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
    selector: 'app-apqp',
    templateUrl: './apqp.component.html',
    styleUrls: ['./apqp.component.scss']
})
export class APQPComponent implements OnInit {

    msgs: Message[] = [];
    assignSupplierData: any;
    constructor(private route: Router, public _apiService: ApiServiceService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig, public _utility: AppUtility, private fb: FormBuilder, private messageService: MessageService) { }
    loading: boolean = true;
    supplierId: any;
    submitButton: string = 'Submit'
    apqpData: any = [];
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
            title: 'Supplier APQP Documents',
            subTitle: 'Dashboard'
        }
    ]

    enquiryId: any;
    display: boolean = false;
    supplierList: any = [];
    submitItemId: any = '';
    lastUploaded: any;
    showItemName : any = '';
    //get apqp list
    getAPQPList(customer?: any) {
    console.log(customer);
    // debugger;
    this.submitItemId = customer?.itemId ?? this.submitItemId;
    this.showItemName = customer?.itemName ?? this.showItemName;
    let object : any = {};
        if (this.apqpGroup.valid && this.roleName != 'Supplier' && this.apqpGroup.value.supplierId2) {
            this._utility.loader(true);
            if (this.apqpGroup.value.supplierId2) {
                object = {
                    enquiryId: this.apqpGroup.value.enquiryId,
                    supplierId: this.apqpGroup.value.supplierId2['supplierId'],
                    itemId: this.submitItemId,
                }
            }
        }

        else {
            this._utility.loader(true);
            object = {
                enquiryId: this.apqpGroup.value.enquiryId,
                supplierId: this.apqpGroup.value.supplierId,
                itemId : this.submitItemId
            }

        }
        this._apiService.getApqpData(object).then((res: any) => {
            this._utility.loader(false);
            if (res.success) {
                this.apqpData = res.returnValue;
                this.apqpData.forEach((v: any, index: any) => { v.index = index, v.targetDate = moment(v.targetDate).format('MM/DD/YYYY') })
                this.display = true;
                this.lastUploaded = this.apqpData[0]?.lastUploaded;
            }
            else {
                this.apqpData = [];
                this.display = false;
                this.lastUploaded = '';
                this._apiService.showMessage(res.message, 'error');
            }
        })
    }


    //save apqp list
    onRowEditSave() {
        console.log(this.apqpData);
        this.apqpData.forEach((v: any) => { v.enquiryId = JSON.parse(this.apqpGroup.value.enquiryId), v.supplierId = this.apqpGroup.value.supplierId ? this.apqpGroup.value.supplierId : this.apqpGroup.value.supplierId2['supplierId'], v.targetDate = this._utility.dateTimeChange(v.targetDate) })
        let object: any = {
            enquiryId: JSON.parse(this.apqpGroup.value.enquiryId),
            supplierId: this.apqpGroup.value.supplierId ? this.apqpGroup.value.supplierId : this.apqpGroup.value.supplierId2['supplierId'],
            APQPDetails: this.apqpData,
            itemId: this.submitItemId
        };
        this._apiService.postAPQPDocument(object).then((res: any) => {
            console.log(res);
            if (res.success) {
                this._apiService.showMessage(res.message, 'success');
                this.getAPQPList();
            }

            else {
                this._apiService.showMessage(res.message, 'error')
            }

        })
    }

    //upload qpqp document
    upload_doc(event: any, product: any) {
        console.log(product);
        let file = this._utility.onFileChange(event);
        if(product.length > 0){
            if (file != false && product[0].apqpId > 0) {
                let formData = new FormData();
                formData.append('supplierId', this.apqpGroup.value.supplierId);
                formData.append('enquiryId', this.apqpGroup.value.enquiryId);
                formData.append('apqpId', product[0].apqpId);
                formData.append('filepath', file);
                this._apiService.putAPQPDocument(formData).then((res: any) => {
                    console.log(res);
                    if (res.success) {
                        this._apiService.showMessage(res.message, 'success');
                        this.display = false;
                        this.apqpGroup.reset();
                        this.apqpGroup.controls['enquiryId'].setValue('');
                        this.apqpGroup.controls['supplierId'].setValue(this.supplierId ?? '');
                        this.apqpData = [];
                        this.enquiryItemDetails = [];
                    }
    
                    else {
                        this._apiService.showMessage(res.message, 'error');
                    }
                })
            }
        }

        else{
            this._apiService.showMessage('please select part', 'error');
        }
        
    }

    // onRole
    callFunctionBasedOnRole(event?: any) {
        console.log(this.apqpGroup.value);
        if (this.roleName == 'Supplier') {
            this.getPartDetails();
        }

        else {
            this._utility.loader(true);
            let object = {
                Mode: 'enquirywiseSupplier',
                Cond3: this.apqpGroup.value?.enquiryId,
                supplierId: 0
            }
            this.display = false;
            this._apiService.dropdowndata('', object).then((res: any) => {
                console.log(res);
                if (res.success) {
                    this._utility.loader(false);
                    this.supplierList = res.returnValue;
                    this.apqpGroup.controls['supplierId2'].setValue('');
                    this.apqpData = [];
                }

                else{
                    this._utility.loader(false);
                    this.apqpData = [];
                    this.supplierList = [];
                    this.apqpGroup.controls['supplierId2'].setValue('');
                }
            })
        }
    }

    // get parts by enquiry id
    getPartDetails() {
        let variable = this.enquiry_dropdown.filter(res => {
            return res.id == this.apqpGroup.value.enquiryId
        })

        let object1 = {
            enquiryNo: variable[0].value
        }

        this.getPartsById(object1);
    }

    enquiryItemDetails: any = [];
    async getPartsById(enquiryNo) {
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

    }


    updateFile() {
        this.apqpData[0].documentPath = '';
    }

    // get all drawing
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


    //get dropdowns
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
    
}
