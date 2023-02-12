import { Component, ContentChildren, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
import { md5 } from 'src/md5';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {
  public validateAreEqual(c: AbstractControl): { notSame: boolean } {
    return c.value.password == c.value.confirmPassword ? { notSame: false } : { notSame: true };
  }
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
  supplierGetById : any;
  @ViewChild('cancelCheque') cancelCheque: ElementRef;
  @ViewChildren('file') file:ContentChildren;
  @ViewChild('year1File') year1File: ElementRef;
  @ViewChild('year2File') year2File: ElementRef;
  @ViewChild('year3File') year3File: ElementRef;
  @ViewChild('organizationProfile') organizationProfile: ElementRef;
  constructor(private _apiService: ApiServiceService, private activate: ActivatedRoute, private route: Router, public _utility: AppUtility, private fb: FormBuilder , private sanitizer : DomSanitizer) { }

  ngOnInit() {
    this.getState();
    let alreadySupplier = localStorage.getItem('already');
    this.myDate = new Date();
    this.setYears('year')
    console.log(JSON.parse(alreadySupplier));
    if(alreadySupplier){
      this.supplierGetById = JSON.parse(alreadySupplier).supplierId;
      this.getSupplierById();
    }
    else if(!alreadySupplier){
      let value = localStorage.getItem('showRegister');
      this.futureYears = new Date().getFullYear();
      let data = this.activate.snapshot.params;
      this.supplierFormControl.controls['emailAddress'].setValue(data.email);
      if (JSON.parse(value) == 'show') {
        if (localStorage.getItem('supplier')) {
          let supplier = JSON.parse(localStorage.getItem('supplier'))
          if (supplier.emailAddress != data.email) {
            localStorage.removeItem('supplier');
          }
        }
      }
      else {
        this.route.navigateByUrl('/verification');
      }
  
      this.addDirectorRow('add');
      let majorCustomer = this.getMajorCustomerArray();
      majorCustomer.push(this.fb.group({ organizationName: new FormControl(''), contactPerson: new FormControl(''), email: new FormControl('', [Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]), mobileNo: new FormControl('', [Validators.pattern("[0-9]+")]), designation: new FormControl('') }))
    }
  

  }

  //formGroup
  supplierFormControl = this.fb.group({
    supplierId: new FormControl(0),
    supplierName: new FormControl('', [Validators.required]),
    supplierAddress: new FormControl('', [Validators.required]),
    countryId: new FormControl('', [Validators.required]),
    stateId: new FormControl('', [Validators.required]),
    purposeId: new FormControl('', [Validators.required]),
    services: new FormControl('1'),
    interCompany: new FormControl(''),
    payTermsId: new FormControl('', [Validators.required]),
    tdsApplicable: new FormControl(false, [Validators.required]),
    supplierCategory: new FormControl(''),
    isDomestic: new FormControl(false, [Validators.required ]),
    gstinNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]),
    gstinDate : new FormControl('', [Validators.required]),
    panNo: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}')]),
    tanNo: new FormControl('', [Validators.pattern('[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}')]),
    currency: new FormControl(''),
    msmeApplicable: new FormControl(true, [Validators.required]),
    contactPerson: new FormControl(''),
    mobileNo: new FormControl('', [Validators.required, Validators.pattern("[0-9]+")]),
    bankName: new FormControl('', [Validators.required]),
    accountNo: new FormControl('', [Validators.required]),
    ifscCode: new FormControl('', [Validators.required]),
    cancelledCheque: new FormControl('', [Validators.required]),
    majorCustomerArray: this.fb.array([]),
    faxNo: new FormControl('', [Validators.minLength(10), Validators.maxLength(15)]),
    emailAddress: new FormControl('', [Validators.required]),
    alternateEmail: new FormControl('',[ Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]),
    yearofEstablishment: new FormControl('', [Validators.required]),
    turnover1: new FormControl(''),
    year1: new FormControl(''),
    balanceSheet1 : new FormControl(''),
    turnover2: new FormControl(''),
    year2: new FormControl(''),
    balanceSheet2 : new FormControl(''),
    turnover3: new FormControl(''),
    year3: new FormControl(''),
    balanceSheet3 : new FormControl(''),
    currencyId : new FormControl(''),
    manufacturingProcess: this.fb.array([]),
    materialOfConstruction: this.fb.array([]),
    otherCategoryId: new FormControl(''),
    otherState: new FormControl(''),
    otherRemarks: new FormControl(''),
    accountType: new FormControl('C', [Validators.required]),
    micrNo: new FormControl(''),
    bankAddress: new FormControl(''),
    documentsUploadPath: new FormControl('', [Validators.required]),
    directorArray: this.fb.array([]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  manufacturingProcess = this.fb.group({
    id: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required])
  })

  materialOfConstruction = this.fb.group({
    id: new FormControl(''),
    value: new FormControl('')
  })
  otherCategory = this.fb.group({
    id: new FormControl(''),
    roleName: new FormControl(''),
    value: new FormControl('')
  })

  certificateDetails: any = []

  getDirectorArray() {
    return this.supplierFormControl.get('directorArray') as FormArray;
  }

  getMajorCustomerArray() {
    return this.supplierFormControl.get('majorCustomerArray') as FormArray;
  }

  getManufacturingArray() {
    return this.supplierFormControl.get('manufacturingProcess') as FormArray;
  }

  getMaterialofConstruction() {
    return this.supplierFormControl.get('materialOfConstruction') as FormArray;
  }

  // Register Suppliers

  registerSupplierBoolean: string = '';
  registerSupplier() {
    let majorBoolean = this.majorCustomerValidation('submit');
    console.log(this.supplierFormControl.valid, this.supplierFormControl.value);
    if (this.supplierFormControl.valid && majorBoolean && this.selectManufacturingData.length > 0 && this.selectMaterialListData.length > 0) {
      this.selectedMajorCustomers = [];
      let supplierFormData = {};
      
      // let supplierFormData = {
      //   "supplierName": this._utility.titleCase(this.supplierFormControl.value.supplierName),
      //   "supplierAddress": this.supplierFormControl.value.supplierAddress,
      //   "stateId": this.supplierFormControl.value.stateId,
      //   "otherState": this.supplierFormControl.value.otherState,
      //   "purposeId": this.supplierFormControl.value.purposeId,
      //   "services": this.supplierFormControl.value.services,
      //   "payTermsId": this.supplierFormControl.value.payTermsId,
      //   "tdsApplicable": JSON.parse(this.supplierFormControl.value.tdsApplicable),
      //   "supplierCategory": this.supplierFormControl.value.supplierCategory,
      //   "isDomestic": JSON.parse(this.supplierFormControl.value?.isDomestic),
      //   "gstinNo": this.supplierFormControl.value.gstinNo,
      //   "gstinDate": this.supplierFormControl.value.gstinDate,
      //   "panNo": this.supplierFormControl.value.panNo,
      //   "contactPerson": this.supplierFormControl.value.contactPerson,
      //   "mobileNo": this.supplierFormControl.value.mobileNo,
      //   "emailAddress": this.supplierFormControl.value.emailAddress,
      //   "alternateEmail" : this.supplierFormControl.value.alternateEmail,
      //   "accountNo": this.supplierFormControl.value.accountNo,
      //   "accountType": this.supplierFormControl.value.accountType,
      //   "bankName": this.supplierFormControl.value.bankName,
      //   "bankAddress": this.supplierFormControl.value.bankAddress,
      //   "miCRNO": this.supplierFormControl.value.miCRNO,
      //   "ifscCode": this.supplierFormControl.value.ifscCode,
      //   "turnover1": this.supplierFormControl.value.turnover1,
      //   "turnover2": this.supplierFormControl.value.turnover2,
      //   "turnover3": this.supplierFormControl.value.turnover3,
      //   "yearofEstablishment": this._utility.dateChange(this.supplierFormControl.value['yearofEstablishment']),
      //   "supplierDirectorsDetails": this.supplierFormControl.controls['directorArray'].value,
      //   "otherRemark": this.supplierFormControl.controls['otherRemarks'].value,
      //   "password": md5(this.supplierFormControl.value.password),
      //   "confirmPassword": md5(this.supplierFormControl.value.confirmPassword)
      // }

      Object.keys(this.supplierFormControl.value).forEach(key => {
        if(['yearofEstablishment' , 'currencyId' , 'password','confirmPassword' , 'materialOfConstruction', 'otherCategoryId', 'directorArray', 'balanceSheet1' , 'balanceSheet2' , 'balanceSheet3', 'cancelledCheque', 'manufacturingProcess','documentsUploadPath'].includes(key)){
          if(key == 'yearofEstablishment'){
            supplierFormData[key] = this._utility.dateChange(this.supplierFormControl.value['yearofEstablishment'])
          }

          else if(key == 'directorArray'){
            supplierFormData['supplierDirectorsDetails'] = this.supplierFormControl.controls['directorArray'].value
          }

          else if(key == 'password' || key == 'confirmPassword'){
            supplierFormData[key] = md5(this.supplierFormControl.value[key])
          }
        }
        else{
          supplierFormData[key] = this.supplierFormControl.controls[key].value
        }
      }); 

      console.log(Object.keys(supplierFormData).length);

      supplierFormData['currencyId'] = JSON.parse(this.supplierFormControl.value?.currencyId);

      if (this.supplierFormControl.controls['otherCategoryId'].value != '') {
        supplierFormData['otherCategoryId'] = Number(this.supplierFormControl.controls['otherCategoryId'].value);
      }


      //manufacturing
      if (this.getManufacturingArray().value.length > 0) {
        let data = this.getManufacturingArray().value.toString();
        console.log(data);
        supplierFormData['manufacturingProcessList'] = data;
      }


      //materialofConstruction
      if (this.getMaterialofConstruction().value.length > 0) {
        let data = this.getMaterialofConstruction().value.toString();
        console.log(data);
        supplierFormData['materialOfConstructionList'] = data;
      }

      this.supplierFormControl.controls['majorCustomerArray'].value.map((res: any) => {
        if (res.organizationName != '' && res.designation != '' && res.contactPerson != '' && res.email != '' && res.mobileNo != '') {
          this.selectedMajorCustomers.push(res);
        }
      })

      if (this.selectedMajorCustomers.length > 0) {
        supplierFormData['supplierMajorCustomersDetails'] = this.selectedMajorCustomers;
      }



      let formData = new FormData();
      formData.append('jsonData', JSON.stringify(supplierFormData))
      if(typeof (this.supplierFormControl.value.balanceSheet1) == 'object'){
        formData.append('balanceSheet1', this.supplierFormControl.value.balanceSheet1)
      }
      if(typeof this.supplierFormControl.value.balanceSheet2 == 'object'){
        formData.append('balanceSheet2', this.supplierFormControl.value.balanceSheet2)
      }
      if(typeof this.supplierFormControl.value.balanceSheet3 == 'object'){
        formData.append('balanceSheet3', this.supplierFormControl.value.balanceSheet3)
      }
      if(typeof this.supplierFormControl.value.cancelledCheque == 'object'){
        formData.append('cancelledCheque', this.supplierFormControl.value.cancelledCheque)
      }
      
      // debugger;
      if (typeof this.supplierFormControl.value.documentsUploadPath == 'object') {
        formData.append('documentsUploadPath', this.supplierFormControl.value['documentsUploadPath'])
      }

        this._utility.loader(true);
        let localData = localStorage.getItem('supplier');
        if (JSON.parse(localData)?.supplierId) {
          if(this.registerSupplierBoolean != 'Next'){
            this._apiService.supplierUpdate(formData).then((res: any) => {
              if (res.success == false) {
                this._apiService.showMessage(res.message, 'error');
              }
              else {
                this._apiService.showMessage(res.message, 'success');
                let object = {
                  supplierId : res.returnValue
                }
                localStorage.setItem('already' , JSON.stringify(object));

                let localStorageObject = {
                  supplierId: res.returnValue,
                  supplierName: this.supplierFormControl.controls['supplierName'].value,
                  emailAddress: this.supplierFormControl.controls['emailAddress'].value
                }
                localStorage.setItem('supplier', JSON.stringify(localStorageObject))

                this.getApiCertificates();
                this.nextWizard = true;
              }
            })
            this._utility.loader(false);
          }

          else{
            this._utility.loader(false);
            let id : any;
            if(localStorage.getItem('already')){
              id = JSON.parse(localStorage.getItem('already')).supplierId;
            }
            let localStorageObject = {
              supplierId: id,
              supplierName: this.supplierFormControl.controls['supplierName'].value,
              emailAddress: this.supplierFormControl.controls['emailAddress'].value
            }
            localStorage.setItem('supplier', JSON.stringify(localStorageObject))
            this.getApiCertificates();
            this.nextWizard = true;
          }
        }

        else {
          this._apiService.supplierRegistration(formData)
          .then((res: any) => {
            console.log(res);
            this._utility.loader(false);
            if (res.success == false) {
              this._apiService.showMessage(res.message, 'error');
            }
            else {
              let localStorageObject = {
                supplierId: res.returnValue,
                supplierName: this.supplierFormControl.controls['supplierName'].value,
                emailAddress: this.supplierFormControl.controls['emailAddress'].value
              }
              localStorage.setItem('supplier', JSON.stringify(localStorageObject))

              let object = {
                supplierId : res.returnValue
              }
              localStorage.setItem('already' , JSON.stringify(object))
              this._apiService.showMessage(res.message, 'success');
              this.getApiCertificates();
              this.nextWizard = true;
            }
          })
        }
    }
    else {
      console.log(this.selectManufacturingData, this.selectMaterialListData);
      window.scroll(100, 100)
      this._apiService.showMessage('please fill required details for registration', 'error');
    }
  }

  getError() {
    return this.validateAreEqual(this.supplierFormControl);
  }

  onPrevClick(string) {
    if(string == 's&p'){
      console.log(this.certificateDetails);
      debugger;
      if (localStorage.getItem('supplier')) {
        this._utility.loader(true);
        let certificateName: any = [];
        let onboardingId: any = [];
        let formData = new FormData();  
        this.certificateDetails.map((res: any) => {
          if (res.certificateName != '' && res.certificateUploadPath != '') {
            if(typeof res.certificateUploadPath == 'object'){
              certificateName.push(res.certificateName);
              onboardingId.push(res.onboardingId);
              formData.append(`filePaths`, res.certificateUploadPath)
            }
          }
        })

        formData.append('certificateName', certificateName);
        formData.append('onboardingIdList', onboardingId);
        formData.append('emailAddress', JSON.parse(localStorage.getItem('supplier')).emailAddress);
        formData.append('supplierName', JSON.parse(localStorage.getItem('supplier')).supplierName);
        formData.append('supplierId', JSON.parse(localStorage.getItem('supplier')).supplierId);

        console.log(certificateName);
        if(certificateName.length > 0){
          this._apiService.certificateUpload(formData).then((res: any) => {
            if (res.success == true) {
              this._utility.loader(false);
              this._apiService.showMessage(res.message , 'success');
              // window.location.reload();
              this.nextWizard = false;
              this.getSupplierById();
            }
  
            else {
              this._utility.loader(false);
              this._apiService.showMessage(res.message , 'error');
            }
          })
        }

        else{
          this._utility.loader(false);
          // window.location.reload();
          this.getSupplierById();
          this.nextWizard = false;
        }
      }
    }

    else{
      // window.location.reload();
      this.nextWizard = false;
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

    this._apiService.dropdowndata('purpose').then((res: any) => {
      this.purposeDropdown = res.returnValue
    })

    this._apiService.dropdowndata('manufacturing').then((res: any) => {
      res.returnValue?.map((resp: any) => {
        this.selectManufacturingData.push({
          id: resp.id,
          value: resp.value,
          isChecked: false
        })
      })
    })

    this._apiService.dropdowndata('materialconstruction').then((res: any) => {
      res.returnValue?.map((resp: any) => {
        this.selectMaterialListData.push({
          id: resp.id,
          value: resp.value,
          isChecked: false
        })
      })
    })
    this._apiService.dropdowndata('othercategory').then((res: any) => {
      this.otherCategoryDropdown = res.returnValue;
    })
  }

  currencyTypeValueINR : string = '0';
  getStateDropdown(event: any , id : any) {
    // debugger;
    let id1 = event?.target?.value ?? id;
    let object = {
      Mode: 'state',
      cond3: id1
    }

    if(id1 != 1){
      this.currencyTypeValueINR = '1';
      this.supplierFormControl.controls['isDomestic'].setValue(true);
      this.supplierFormControl.controls['msmeApplicable'].setValue(false);
        this.getSupplierType('', true , id);
    }

    else{       
      this.supplierFormControl.controls['isDomestic'].setValue(false);
      this.supplierFormControl.controls['msmeApplicable'].setValue(true);
      this.getSupplierType('', false , id);
      this.currencyTypeValueINR = '0';
    }

    this._apiService.dropdowndata('', object).then((res: any) => {
      if (res.status == true) {
        this.stateDropdown = res.returnValue;
        this.showOtherCityBoolean = false;
        this.stateD = true;
        this.supplierFormControl.setControl('otherState', this.fb.control('NA'));
      }

      else{
        this.stateDropdown = [];
        this.showOtherCityBoolean = true;
        this.stateD = false;
        this.supplierFormControl.setControl('otherState', this.fb.control('' , [Validators.required]));
      }
    })
  }

  stateD : boolean = true;
  showCurrency: boolean = false;
  getSupplierType(event: any, string?:any , id?:any) {
    if (event?.target?.value == 'true' || string == true) {
      this.showCurrency = true;
      this.supplierFormControl.get('currency').addValidators(Validators.required);
      this.supplierFormControl.setControl('panNo', this.fb.control(''));
      this.supplierFormControl.setControl('gstinNo', this.fb.control(''));
      this.supplierFormControl.setControl('gstinDate', this.fb.control(''));
    }
    else {
      this.showCurrency = false;
      this.supplierFormControl.get('currency').clearValidators();
      if(!id){
        this.supplierFormControl.setControl('panNo', this.fb.control('', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]));
        this.supplierFormControl.setControl('gstinNo', this.fb.control('', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]));
        this.supplierFormControl.setControl('gstinDate', this.fb.control('', [Validators.required]));
        this.supplierFormControl.patchValue({ 'currency': null })
      }
    }
  }



  upload_doc(event: any, string?: any, idx?: any, id?:any) {
    console.log(this.certificateDetails);
    let file = this._utility.onFileChange(event , string);
    console.log(file);
    if (string == 'cancelCheque') {
      if (file == false) {
        this.supplierFormControl.patchValue({
          cancelledCheque: ''
        })
        this.cancelCheque.nativeElement.value = null;
      }
      else {
        this.supplierFormControl.patchValue({
          cancelledCheque: file
        })
      }
    }

    else if (string == 'certificate') {
      if (file == false) {
        this.certificateDetails[idx].certificateUploadPath = null;
        this.file['_results'][idx].nativeElement.value = ''
      }
      else {
        this.certificateDetails[idx].certificateUploadPath = file;
        // this.certificateDetails[idx].uploaded = true;
      }
    }

    else if (string == 'organization_profile') {
      if (file == false) {
        this.supplierFormControl.patchValue({
          documentsUploadPath: ''
        })
        this.organizationProfile.nativeElement.value = null;
      }
      else {
        this.supplierFormControl.patchValue({
          documentsUploadPath: file
        })
      }

    }

    else {
      if (string == 'year1') {
        if (file == false) {
          this.supplierFormControl.controls['balanceSheet1'].patchValue('');
          this.year1File.nativeElement.value = null;
        }
        else {
          this.supplierFormControl.controls['balanceSheet1'].patchValue(file);
        }
      }
      else if (string == 'year2') {
        if (file == false) {
          this.supplierFormControl.controls['balanceSheet2'].patchValue('');
          this.year2File.nativeElement.value = null;
        }
        else {
          this.supplierFormControl.controls['balanceSheet2'].patchValue(file);
        }
      }
      else if (string == 'year3') {
        if (file == false) {
          this.supplierFormControl.controls['balanceSheet3'].patchValue('');
          this.year3File.nativeElement.value = null;
        }
        else {
          this.supplierFormControl.controls['balanceSheet3'].patchValue(file);
        }
      }
    }
  }

  certificateBoolean: boolean = false;
  addCertificate(string?: any, indexat?: any) {
    console.log(indexat, this.certificateDetails);
    if (string == 'add') {
      // if (!this.boolean) {
        this.certificateBoolean = false;
        this.certificateDetails.push({ certificateName: '', certificateUploadPath: null, onboardingId: 0, isMandatory: false, readonly: false })
        console.log(this.certificateDetails);
      // }
      // else {
      //   this._apiService.showMessage('Please fill form fields', 'error');
      // }

    }

    else {
      this.certificateDetails.splice(indexat, 1);
    }
  }

  directorBoolean: boolean = false;
  addDirectorRow(string: any, indexat?: any) {
    let director = this.getDirectorArray();
    if (string == 'add') {
      if (director.valid) {
        this.directorBoolean = false;
        director.push(this.fb.group({ directorName: new FormControl('', [((Validators.required))]), mobileNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("[0-9]+")]), email: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]) }))
      }
      else {
        this.directorBoolean = true;
      }
    }

    else {
      if(indexat == 0 && director.value.length > 1){
        director.removeAt(indexat);
      }

      else if(indexat != 0){
        director.removeAt(indexat);
      }
    }

  }

  selectedMajorCustomers: any = [];
  addMajorCustomerRow(string: any, indexat?: any) {
    let valid: Boolean = false;
    let majorCustomer = this.getMajorCustomerArray();
    if (string == 'add') {
      valid = this.majorCustomerValidation('sectionValidation');
      console.log();
      if (valid == true) {
        majorCustomer.push(this.fb.group({ organizationName: new FormControl(''), contactPerson: new FormControl(''), email: new FormControl('', [Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]), mobileNo: new FormControl('', [Validators.maxLength(15), Validators.minLength(10), Validators.pattern("[0-9]+")]), designation: new FormControl('') }))
      }
      else {
        this._apiService.showMessage('Please Enter Major Customer Details', 'error')
      }
    }
    else if (majorCustomer.controls.length > 1) {
      majorCustomer.removeAt(indexat);
    }
  }

  validateCertificate() {
    this.boolean = false;
    this.certificateDetails.forEach((res: any) => {
      if (res.isMandatory == true) {
        debugger;
        if(res.certificateUploadPath == '' || res.certificateUploadPath == undefined) {
          console.log(res);
          this.boolean = true;
        }
      }
    });
  }

  boolean: any = false;
  certificateSubmit(value: NgForm) {
    this.validateCertificate();
    console.log(this.boolean);

    if (!this.boolean) {
      if (localStorage.getItem('supplier')) {
        this._utility.loader(true);
        let certificateName: any = [];
        let onboardingId: any = [];
        let formData = new FormData();
        this.certificateDetails.map((res: any, index: any) => {
          if (res.certificateName != '' && res.certificateUploadPath != '') {
            if(typeof res.certificateUploadPath == 'object'){
              certificateName.push(res.certificateName);
              onboardingId.push(res.onboardingId);
              formData.append(`filePaths`, res.certificateUploadPath)
            }
          }
        })

        

        console.log(this.certificateDetails);
        formData.append('certificateName', certificateName);
        formData.append('onboardingIdList', onboardingId);
        formData.append('isActive', JSON.stringify(true));
        formData.append('emailAddress', JSON.parse(localStorage.getItem('supplier')).emailAddress);
        formData.append('supplierName', JSON.parse(localStorage.getItem('supplier')).supplierName);
        formData.append('supplierId', JSON.parse(localStorage.getItem('supplier')).supplierId);
        this._apiService.certificateUpload(formData).then((res: any) => {
          if (res.success == true) {
            this._utility.loader(false);
            this._apiService.showMessage(res.message, 'success');
            this.showSuccess = true;
            localStorage.clear();

            setTimeout(() => {
               this.route.navigateByUrl('/login');
            }, 3000);
          }

          else {
            this._utility.loader(false);
              this._apiService.showMessage(res.message, 'error');
          }
        })

      // else {
      //       this._utility.loader(false);
      //       this.showSuccess = true;
      //       localStorage.removeItem('showRegister');
      //       localStorage.removeItem('supplier');

      //       setTimeout(() => {
      //           this.route.navigateByUrl('/login');
      //       }, 3000);
      //   }
      }
      else {
        this.nextWizard = false;
      }
    }

    else {
      this._apiService.showMessage('Please fill form fields', 'error');
    }

  }

  showSuccess : boolean = false;

  showOtherCityBoolean: boolean = false
  ShowOtherState(state_id: any , id:any) {
    if (state_id?.target?.value == 38 || id == 38) {
      this.showOtherCityBoolean = true;
      this.supplierFormControl.setControl('otherState', this.fb.control('' , [Validators.required]));
    }
    else {
      this.showOtherCityBoolean = false;
      this.supplierFormControl.setControl('otherState', this.fb.control(''));
    }
  }

  setYears(string: any) {
    if (string == 'year1') {
      let year1 = this.supplierFormControl.controls['year1'].value;
      year1 = moment(year1).format('yyyy');
      this.supplierFormControl.controls['year2'].setValue(String(Number(year1) - 1))
      this.supplierFormControl.controls['year1'].setValue(String(Number(year1)))
      this.supplierFormControl.controls['year3'].setValue(String(Number(year1) - 2))
    }
    if (string == 'year2') {
      let year2 = this.supplierFormControl.controls['year2'].value;
      let maxDate = moment(this.myDate).format('yyyy')
      year2 = moment(year2).format('yyyy');
      console.log(this._utility.dateTimeChange(year2));
      if(maxDate == year2){
        this.supplierFormControl.controls['year1'].setValue(String(Number(year2)))
        this.supplierFormControl.controls['year2'].setValue(String(Number(year2)))
        this.supplierFormControl.controls['year3'].setValue(String(Number(year2)))
      }

      else{
        this.supplierFormControl.controls['year1'].setValue(String(Number(year2) + 1))
        this.supplierFormControl.controls['year2'].setValue(String(Number(year2)))
        this.supplierFormControl.controls['year3'].setValue(String(Number(year2) - 1))
    }

    }
    if (string == 'year3') {
      let year3 = this.supplierFormControl.controls['year3'].value;
      let maxDate = moment(this.myDate).format('yyyy');
      year3 = moment(year3).format('yyyy');
      if(maxDate == year3){
        this.supplierFormControl.controls['year1'].setValue(String(Number(year3)))
        this.supplierFormControl.controls['year2'].setValue(String(Number(year3)))
        this.supplierFormControl.controls['year3'].setValue(String(Number(year3)))
    }

      else{
        this.supplierFormControl.controls['year1'].setValue(String(Number(year3) + 2))
        this.supplierFormControl.controls['year2'].setValue(String(Number(year3) + 1))
        this.supplierFormControl.controls['year3'].setValue(String(Number(year3)))
      }
    }

    if (string == 'year') {
      let currentDate = new Date();
      let year = moment(currentDate).format('yyyy');
      this.supplierFormControl.controls['year1'].setValue(String(Number(year) - 1))
      this.supplierFormControl.controls['year2'].setValue(String(Number(year) - 2))
      this.supplierFormControl.controls['year3'].setValue(String(Number(year) - 3))
    }
  }

  majorCustomerValidation(string: any) {
    let valid = this.getMajorCustomerArray();
    console.log(valid.valid);
    let boolean: Boolean = true;
    if (valid.valid) {
      if (string == 'sectionValidation') {
        valid.value.map((res: any) => {
          if (res.organizationName == '' || res.mobileNo == '' || res.email == '' || res.designation == '' || res.contactPerson == '') {
            boolean = false;
          }
        })
        return boolean;
      }
      else {
        if (valid.length > 1) {
          valid.value.map((res: any) => {
            if (res.organizationName == '' || res.mobileNo == '' || res.email == '' || res.designation == '' || res.contactPerson == '') {
              boolean = false;
            }
          })
        }
        else {
          boolean = true;
        }

        return boolean;
      }
    }

    else {
      return false;
    }
  }


  otherRemark: boolean = false;
  getSelectOtherCategory(event: any) {
    console.log(event.target.value);
    if (event.target.value == 11) {
      this.otherRemark = true;
      this.supplierFormControl.setControl('otherRemarks', this.fb.control('', [Validators.required]));
    }
    else {
      this.otherRemark = false;
      this.supplierFormControl.setControl('otherRemarks', this.fb.control(''));
    }
  }


  default: any;
  getApiCertificates() {
    this.certificateDetails = [];
    let Id = JSON.parse(localStorage.getItem('supplier'))?.supplierId ?? '';
    if (Id) {
      this._apiService.getSupplierDocById(Id).then((res: any) => {
        this.default = res.returnValue.length;
        if (res.success == true) {
          res.returnValue.map((resp: any) => {
            this.certificateDetails.push({ certificateName: resp.documentName, certificateUploadPath: resp.documentPath, uploaded : resp.documentPath ? true : false, path: resp.path, note: resp.note, onboardingId: resp.onboardingId, isMandatory: resp.isMandatory ?? true, readonly: true})
          })

          window.scroll(0, 0);
        }
      })
    }
  }

  setCurrencyId(event: any, string: any) {
    console.log(event.target.value);
    this.supplierFormControl.controls['currencyId'].setValue(event.target.value)
    this.supplierFormControl.controls['currencyId'].setValue(event.target.value)
    this.supplierFormControl.controls['currencyId'].setValue(event.target.value)
  }

  showStateDropdown: boolean = false;
  showState(event: any) {
    console.log(event.target.value);

    if (event.target.value == 1 || event.target.value == 4) {
      this.showStateDropdown = true;
      this.supplierFormControl.setControl('services', this.fb.control('', [Validators.required]));
    }

    else {
      this.showStateDropdown = false;
      this.supplierFormControl.setControl('services', this.fb.control(''));
    }
  }

  selectManufacturingList(event: any, string: any) {
    console.log(event.value);
    if (string == 'manufacture') {
      let array = this.getManufacturingArray();
      array.clear();
      event.value.forEach((res: any) => {
        array.push(this.fb.control(res));
      })
    }

    else if (string == 'material') {
      let array = this.getMaterialofConstruction();
      array.clear();
      event.value.forEach((res: any) => {
        array.push(this.fb.control(res));
      })
    }
  }

  async removeImages(string:any){
    if(string == 'organizationProfile'){
        this.organizationProfileUrl = '';
        this.supplierFormControl.controls['documentsUploadPath'].setValue('');
    }

    else if(string== 'cancelCheque'){
      this.cancelChequeUrl = '';
      this.supplierFormControl.controls['cancelledCheque'].setValue('');
    }
    else if(string== 'year1'){
      this.year1Url = '';
      this.supplierFormControl.controls['balanceSheet1'].setValue('');
    }
    else if(string== 'year2'){
      this.year2Url = '';
      this.supplierFormControl.controls['balanceSheet2'].setValue('');
    }
    else if(string== 'year3'){
      this.year3Url = '';
      this.supplierFormControl.controls['balanceSheet3'].setValue('');
    }
  }

  cancelChequeUrl : string = '';
  organizationProfileUrl : string = '';
  year1Url : string = '';
  year2Url : string = '';
  year3Url : string = '';
  materialList : any = [];
  manufacturingList : any = [];
  async getSupplierById(){
   let updatesupplierForm : any;
   if(localStorage.getItem('already')){
    let supplierId = JSON.parse(localStorage.getItem('already')).supplierId;
    this.supplierGetById = supplierId;
   }
   await this._apiService.supplierById(this.supplierGetById).then((res:any)=>{
      if(res.success){
        console.log(res.returnValue);
        if(res.returnValue){
          updatesupplierForm = res.returnValue;
        }
        console.log(updatesupplierForm);
        Object.keys(this.supplierFormControl.controls).forEach(key => {
          if(key != 'majorCustomerArray' && key != 'directorArray'){
            if(updatesupplierForm[key]){
              this.supplierFormControl.controls[key].setValue(updatesupplierForm[key]);
            }
          }
        });
    
        //manufacturingList
        let manufacturingList = this.getManufacturingArray();
        manufacturingList.clear();
        updatesupplierForm.supplierManufacturingDetails.forEach((res:any)=>{
          console.log(res);
          manufacturingList.push(this.fb.control(res.manufacturingId))
        })
        if(this.getManufacturingArray().value){
          this.manufacturingList = this.getManufacturingArray().value;
        }
    
    
        //materialList
        let materialList = this.getMaterialofConstruction();
        materialList.clear();
        updatesupplierForm.supplierMaterialconstructionDetails?.forEach((res:any)=>{
          materialList.push(this.fb.control(res.materialconstructionId))
        })
    
        if(this.getMaterialofConstruction().value){
          this.materialList = this.getMaterialofConstruction().value;
        }
    
        //director Array
        let directorArray = this.getDirectorArray();
        directorArray.clear();
        if(updatesupplierForm.supplierDirectorsDetails.length > 0){
          updatesupplierForm.supplierDirectorsDetails.forEach((res:any)=>{
            directorArray.push(this.fb.group({ 
              directorName: new FormControl(res.directorName),
              mobileNo: new FormControl(res.mobileNo), 
              email: new FormControl(res.email)
            }))
          })
        }
        
        //MajorCustomer Array 
        let majorCustomer = this.getMajorCustomerArray();
        majorCustomer.clear();
        if(updatesupplierForm.supplierMajorCustomersDetails.length > 0){
          updatesupplierForm.supplierMajorCustomersDetails.forEach((res:any)=>{
            majorCustomer.push(this.fb.group({ 
              organizationName: new FormControl(res.organizationName),
              contactPerson: new FormControl(res.contactPerson), 
              mobileNo: new FormControl(res.mobileNo), 
              designation: new FormControl(res.designation), 
              email: new FormControl(res.email)
            }))
          })
        }
    
    
        //document
        this.organizationProfileUrl = this.supplierFormControl.controls['documentsUploadPath'].value;
        this.cancelChequeUrl = this.supplierFormControl.controls['cancelledCheque'].value;
        this.year1Url = this.supplierFormControl.controls['balanceSheet1'].value;
        this.year2Url = this.supplierFormControl.controls['balanceSheet2'].value;
        this.year3Url = this.supplierFormControl.controls['balanceSheet3'].value;
    
        //turnover
        this.supplierFormControl.controls['yearofEstablishment'].setValue(JSON.stringify(this.supplierFormControl.controls['yearofEstablishment'].value))
        this.supplierFormControl.controls['year1'].setValue(JSON.stringify(this.supplierFormControl.controls['year1'].value))
        this.supplierFormControl.controls['year2'].setValue(JSON.stringify(this.supplierFormControl.controls['year2'].value))
        this.supplierFormControl.controls['year3'].setValue(JSON.stringify(this.supplierFormControl.controls['year3'].value))
        this.supplierFormControl.controls['confirmPassword'] = this.supplierFormControl.controls['password']


        //country
        this.getStateDropdown('' , this.supplierFormControl.controls['countryId'].value);

        if(this.supplierFormControl.controls['countryId'].value == '1'){
          this.supplierFormControl.setControl('panNo', this.fb.control(updatesupplierForm.panNo, [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]));
          this.supplierFormControl.setControl('gstinNo', this.fb.control(updatesupplierForm.gstinNo, [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]));
          this.supplierFormControl.setControl('gstinDate', this.fb.control(this._utility.calendarDateFormat(updatesupplierForm.gstinDate), [Validators.required]));
        }
        console.log(this.supplierFormControl.value);
      }

      else{
        this.route.navigateByUrl('/verification')
      }
    })

  }

  
}