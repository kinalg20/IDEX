import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
import { md5 } from 'src/md5';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})

export class CustomerFormComponent implements OnInit {

  stateDropdown: any = [];
  countryDropdown: any = [];
  paymentDropdown: any = [];
  purposeDropdown: any = [];
  selectManufacturingData: any = [];
  selectMaterialListData: any = [];
  showRegisterForm: boolean = false;
  nextWizard: boolean = false;
  myDate: Date;
  futureYears: number;
  @ViewChild('cancelCheque') cancelCheque: ElementRef;
  @ViewChild('year1File') year1File: ElementRef;
  @ViewChild('year2File') year2File: ElementRef;
  @ViewChild('year3File') year3File: ElementRef;
  @ViewChild('organizationProfile') organizationProfile: ElementRef;
  constructor(private _apiService: ApiServiceService, private activate: ActivatedRoute, private route: Router, public _utility: AppUtility, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getState();
    let value = localStorage.getItem('showRegister');
    this.futureYears = new Date().getFullYear();
    let data = this.activate.snapshot.params;
    this.supplierFormControl.controls['emailAddress'].setValue(data.email);

    this.myDate = new Date();


  }

  public validateAreEqual(c: AbstractControl): { notSame: boolean } {
    return c.value.password == c.value.confirmpassword ? { notSame: false } : { notSame: true };
  }

  //formGroup
  supplierFormControl = this.fb.group({
    customerName: new FormControl('', [Validators.required]),
    customerCode: new FormControl('', [Validators.required]),
    addressWithPinCode: new FormControl('', [Validators.required]),
    address1: new FormControl(''),
    address2: new FormControl(''),
    address3: new FormControl(''),
    countryId: new FormControl('', [Validators.required]),
    stateId: new FormControl('', [Validators.required]),
    //stateCode: new FormControl('', [Validators.required]),
    tinNumber: new FormControl(''),
    creditLimit: new FormControl(''),
    bussinessUnit: new FormControl('', [Validators.required]),

    customerCategory: new FormControl('', [Validators.required]),
    employeeCode: new FormControl('', [Validators.required]),
    supplierMode: new FormControl(''),
    paymentTerms: new FormControl('', [Validators.required]),
    paymentTermsDesc: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    confirmpassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
    intercompanyCorrectCONo: new FormControl(''),
    supplierType: new FormControl('false', [Validators.required]),
    currency: new FormControl(''),
    gstin_no: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]),
    gstin_Date: new FormControl('', [Validators.required]),
    panNumber: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    tanNumber: new FormControl(''),
    vanNumber: new FormControl(''),
    contactPerson: new FormControl(''),
    telephoneNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]+")]),
    faxNumber: new FormControl('', [Validators.minLength(10), Validators.maxLength(15)]),
    emailAddress: new FormControl('kinal@webanix.in'),
    accountType: new FormControl('C', [Validators.required]),
    bankName: new FormControl('', [Validators.required]),
    accountNumber: new FormControl('', [Validators.required]),
    ifscCode: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]{4}0[A-Za-z0-9]{6}$')]),
    MICRNo: new FormControl(''),
    bankAddress: new FormControl(''),
    cancelCheque: new FormControl('', [Validators.required])
  })

  certificateDetails: any = []

  getError() {
    return this.validateAreEqual(this.supplierFormControl);
  }

  // Register Suppliers

  registerSupplierBoolean: string = '';
  registerSupplier() {
    Object.keys(this.supplierFormControl.controls).forEach((key: any) => {
      console.log(key, this.supplierFormControl.controls[key].status);
    })
    if (this.supplierFormControl.valid) {
      this._utility.loader(true);
      let supplierFormData = {
        "customerName": this.supplierFormControl.value.customerName,
        "customerCode": this.supplierFormControl.value.customerCode,
        "addressWithPinCode": this.supplierFormControl.value.addressWithPinCode,
        "address1": this.supplierFormControl.value.address1,
        "address2": this.supplierFormControl.value.address2,
        "address3": this.supplierFormControl.value.address3,
        "stateId": this.supplierFormControl.value.stateId,
        "creditLimit": this.supplierFormControl.value.creditLimit,
        "bussinessUnit": this.supplierFormControl.value.bussinessUnit,
        "customerCategory": this.supplierFormControl.value.customerCategory,
        "employeeCode": this.supplierFormControl.value.employeeCode,
        "supplierMode": this.supplierFormControl.value.supplierMode,
        "paymentTerms": this.supplierFormControl.value.paymentTerms,
        "paymentTermsDesc": this.supplierFormControl.value.paymentTermsDesc,
        "password": md5(this.supplierFormControl.value.password),
        "confirmPassword": md5(this.supplierFormControl.value.confirmpassword),
        "supplierType": JSON.parse(this.supplierFormControl.value.supplierType),
        "gstinNo": this.supplierFormControl.value.gstin_no,
        "gstin_Date": this.supplierFormControl.value.gstin_Date,
        "panNumber": this.supplierFormControl.value.panNumber,
        "tanNumber": this.supplierFormControl.value.tanNumber,
        "vanNumber": this.supplierFormControl.value.vanNumber,
        "contactPerson": this.supplierFormControl.value.contactPerson,
        "telephoneNumber": this.supplierFormControl.value.telephoneNumber,

        "emailAddress": this.supplierFormControl.value.emailAddress,
        "bankName": this.supplierFormControl.value.bankName,
        "accountNumber": this.supplierFormControl.value.accountNumber,
        "ifscCode": this.supplierFormControl.value.ifscCode,
        "miCRNO": this.supplierFormControl.value.MICRNo,
        "bankAddress": this.supplierFormControl.value.bankAddress,
        "accountType": this.supplierFormControl.value.accountType,
      }



      if (this.supplierFormControl.value.currency != null || this.supplierFormControl.value.currency != '') {
        supplierFormData['currency'] = this.supplierFormControl.value.currency;
      }
      if (this.supplierFormControl.value.intercompanyCorrectCONo != '') {
        supplierFormData['intercompanyCorrectCONo'] = this.supplierFormControl.value.intercompanyCorrectCONo;
      }
      if (this.supplierFormControl.value.tinNumber != '') {
        supplierFormData['tinNumber'] = this.supplierFormControl.value.tinNumber;
      }
      if (this.supplierFormControl.value.faxNumber != '') {
        supplierFormData['faxNumber'] = this.supplierFormControl.value.faxNumber;
      }
      console.log(supplierFormData);

      let formData = new FormData();

      formData.append('cancelCheque', this.supplierFormControl.value.cancelCheque)

      let Data = new FormData();
      Data.append('jsonData', JSON.stringify(supplierFormData))
      this._apiService.customerRegistration(Data).then((res: any) => {
        if (res.success == false) {
          this._apiService.showMessage(res.message, 'error');
        }
        else {
          this._apiService.showMessage(res.message, 'success');
        }
      })
      this._utility.loader(false);
    }
    else {
      window.scroll(100, 100)
      this._apiService.showMessage('please fill required details for registration', 'error');
    }
  }


  currencyDropdown: any = [];
  otherCategoryDropdown: any = [];
  getState() {
    this._apiService.dropdowndata('country').then((res: any) => {
      this.countryDropdown = res.returnValue
    })

    this._apiService.dropdowndata('currency').then((res: any) => {
      this.currencyDropdown = res.returnValue
    })

    this._apiService.dropdowndata('paymentTerms').then((res: any) => {
      this.paymentDropdown = res.returnValue
    })


  }

  getStateDropdown(event: any) {
    console.log(event.target.value);
    let object = {
      Mode: 'state',
      cond3: event.target.value
    }
    this._apiService.dropdowndata('', object).then((res: any) => {
      if (res.status == true) {
        this.stateDropdown = res.returnValue
      }

      else {
        this.stateDropdown = [];
      }
    })
  }

  showCurrency: boolean = false;
  getSupplierType(event: any) {
    console.log(event.target.value);
    if (event.target.value == 'true') {
      this.showCurrency = true;
      this.supplierFormControl.get('currency').addValidators(Validators.required);
      this.supplierFormControl.setControl('panNumber', this.fb.control(''));
      this.supplierFormControl.setControl('gstin_no', this.fb.control(''));
      this.supplierFormControl.setControl('gstin_Date', this.fb.control(''));
    }
    else {
      this.showCurrency = false;
      this.supplierFormControl.get('currency').clearValidators();
      this.supplierFormControl.setControl('panNumber', this.fb.control('', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]));
      this.supplierFormControl.setControl('gstin_no', this.fb.control('', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]));
      this.supplierFormControl.setControl('gstin_Date', this.fb.control('', [Validators.required]));
      this.supplierFormControl.patchValue({ 'currency': null })
    }
  }

  upload_doc(event: any, string?: any, idx?: any) {
    let file = this._utility.onFileChange(event);
    if (string == 'cancelCheque') {
      if (file == false) {
        this.supplierFormControl.patchValue({
          cancelCheque: ''
        })
        this.cancelCheque.nativeElement.value = null;
      }
      else {
        this.supplierFormControl.patchValue({
          cancelCheque: file
        })
      }
    }


  }



}
