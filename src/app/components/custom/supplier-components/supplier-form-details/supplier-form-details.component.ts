import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-supplier-form-details',
  templateUrl: './supplier-form-details.component.html',
  styleUrls: ['./supplier-form-details.component.scss']
})
export class SupplierFormDetailsComponent implements OnInit {
  breadcrumb = [
    {
      title: 'Supplier Master ',
      subTitle: 'Dashboard'
    }
  ]


  stateDropdown: any = [];
  display : boolean = false;
  paymentDropdown: any = [];
  purposeDropdown: any = [];
  manufacturingProcessList: any = [];
  materialOfConstructionList: any = [];
  selectedOtherCategory : any = [];
  errorMessage: string = ''
  errorMessageCheck: string = ''
  showRegisterForm: boolean = false;
  myDate: Date;
  futureYears: number;
  @ViewChild('cancelCheque') cancelCheque: ElementRef;
  @ViewChild('editCancelCheque') editcancelCheque: ElementRef;
  @ViewChild('year1File') year1File: ElementRef;
  @ViewChild('year2File') year2File: ElementRef;
  @ViewChild('year3File') year3File: ElementRef;
  @ViewChild('organizationProfile') organizationProfile: ElementRef;
  stateD: boolean;
  organizationProfileUrl: any;
  cancelChequeUrl: string;
  year1Url: string;
  year2Url: string;
  year3Url: string;
  constructor(private _apiService: ApiServiceService, private router : Router, public _utility: AppUtility, private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.getState();
    this.futureYears = new Date().getFullYear();
    this.getSupplierDetails();
    this.myDate = new Date();

  }

  //formGroup
  supplierFormControl = this.fb.group({
    supplierName: new FormControl('', [Validators.required]),
    supplierAddress: new FormControl('', [Validators.required]),
    stateId: new FormControl('', [Validators.required]),
    countryId: new FormControl(''),
    purposeId: new FormControl('', [Validators.required]),
    services: new FormControl('', [Validators.required]),
    interCompany: new FormControl(''),
    payTermsId: new FormControl('', [Validators.required]),
    tdsApplicable: new FormControl(false, [Validators.required]),
    isDomestic: new FormControl(null, [Validators.required]),
    gstinNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]),
    gstinDate: new FormControl('', [Validators.required]),
    panNo: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    tanNo: new FormControl(''),
    currency: new FormControl(''),
    msmeApplicable: new FormControl('', [Validators.required]),
    contactPerson: new FormControl(''),
    mobileNo: new FormControl('', [Validators.required]),
    bankName: new FormControl('', [Validators.required]),
    accountNo: new FormControl('', [Validators.required]),
    ifscCode: new FormControl('', [Validators.required]),
    cancelledCheque: new FormControl('', [Validators.required]),
    faxNo: new FormControl(''),
    emailAddress: new FormControl('', [Validators.required]),
    alternateEmail: new FormControl(''),
    yearofEstablishment: new FormControl({value : '' , disabled : true}, [Validators.required]),
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
    majorCustomerArray: this.fb.array([]),
    materialOfConstruction: this.fb.array([]),
    otherCategoryId: new FormControl({value : '', disabled : true}),
    otherState: new FormControl(''),
    otherRemarks: new FormControl(''),
    accountType: new FormControl('', [Validators.required]),
    micrNo: new FormControl(''),
    bankAddress: new FormControl(''),
    documentsUploadPath: new FormControl('', [Validators.required]),
    supplierId: new FormControl(''),
    crFlag: new FormControl(null),
    supplierDirectorsDetails: this.fb.array([])
  })

  manufacturingProcess = this.fb.group({
    id: new FormControl(''),
    value: new FormControl('')
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

  tdsApplicable : any = [
    {value : true , name : 'Yes'},
    {value : false , name : 'No'},
  ]

  supplierType : any = [
    {value : true , name : 'Foreign'},
    {value : false , name : 'Domestic'},
  ]
  msmeApplicable : any = [
    {value : true , name : 'Yes'},
    {value : false , name : 'No'},
  ]

  certificateDetails: any = []

  getDirectorArray() {
    return this.supplierFormControl.get('supplierDirectorsDetails') as FormArray;
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
  registerSupplier() {
    Object.keys(this.supplierFormControl.controls).forEach((res:any)=>{
      console.log(res , this.supplierFormControl.controls[res].status);
    })
    if (this.supplierFormControl.valid) {
      this._utility.loader(true);
      // debugger;
      let supplierFormData = {
        "supplierName": this._utility.titleCase(this.supplierFormControl.value.supplierName),
        "supplierId": this.supplierFormControl.value.supplierId,
        "supplierAddress": this.supplierFormControl.value.supplierAddress,
        "stateId": this.supplierFormControl.value.stateId,
        "otherState": this.supplierFormControl.value.otherState,
        "purposeId": this.supplierFormControl.value.purposeId,
        "services": this.supplierFormControl.value.services,
        "payTermsId": this.supplierFormControl.value.payTermsId,
        "tdsApplicable": this.supplierFormControl.value.tdsApplicable,
        "isDomestic": this.supplierFormControl.value.isDomestic,
        "gstinNo": this.supplierFormControl.value.gstinNo,
        "gstinDate": this.supplierFormControl.value.gstinDate,
        "panNo": this.supplierFormControl.value.panNo,
        "msmeApplicable": JSON.parse(this.supplierFormControl.value.msmeApplicable),
        "contactPerson": this.supplierFormControl.value.contactPerson,
        "mobileNo": this.supplierFormControl.value.mobileNo,
        "emailAddress": this.supplierFormControl.value.emailAddress,
        "alternateEmail": this.supplierFormControl.value.alternateEmail,
        "accountNo": this.supplierFormControl.value.accountNo,
        "accountType": this.supplierFormControl.value.accountType,
        "bankName": this.supplierFormControl.value.bankName,
        "bankAddress": this.supplierFormControl.value.bankAddress,
        "micrNo": this.supplierFormControl.value.micrNo,
        "ifscCode": this.supplierFormControl.value.ifscCode,
        "turnover1": this.supplierFormControl.value.turnover1,
        "turnover2": this.supplierFormControl.value.turnover2,
        "turnover3": this.supplierFormControl.value.turnover3,
        "yearofEstablishment": this.supplierFormControl.value['yearofEstablishment'],
        "supplierDirectorsDetails": this.supplierFormControl.controls['supplierDirectorsDetails'].value,
        "otherRemark": this.supplierFormControl.controls['otherRemarks'].value,
        "supplierRaiseRequestList" : this.changeRequest,
        "currencyId" : this.supplierFormControl.controls['currencyId'].value
      }

      this.selectedMajorCustomers = [];


      if (this.supplierFormControl.controls['otherCategoryId'].value != '') {
        supplierFormData['otherCategoryId'] = Number(this.supplierFormControl.controls['otherCategoryId'].value);
      }

      if (this.manufacturingProcessList.length > 0) {
        console.log(this.manufacturingProcessList);   
        let data: string = '';
        this.manufacturingProcessList?.map((res: any, index: any) => {
          console.log(res, index, this.manufacturingProcessList.length - 1);
          data = data + res + (index != this.manufacturingProcessList.length - 1 ? ',' : '')
        })
        supplierFormData['manufacturingProcessList'] = data; 
      }


      if (this.materialOfConstructionList.length > 0) {
        console.log(this.materialOfConstructionList);        
        let data: string = '';
        this.materialOfConstructionList?.map((res: any, index: any) => {
          console.log(res, index, this.materialOfConstructionList.length - 1);
          data = data + res + (index != this.materialOfConstructionList.length - 1 ? ',' : '')
        })
        supplierFormData['materialOfConstructionList'] = data;
      }

      if (this.supplierFormControl.value.currency != null || this.supplierFormControl.value.currency != '') {
        supplierFormData['currency'] = this.supplierFormControl.value.currency;
      }

      if (this.supplierFormControl.value.interCompany != '') {
        supplierFormData['interCompany'] = this.supplierFormControl.value.interCompany;
      }

      if (this.supplierFormControl.value.tanNo != '') {
        supplierFormData['tanNo'] = this.supplierFormControl.value.tanNo;
      }
      if (this.supplierFormControl.value.faxNo != '') {
        supplierFormData['faxNo'] = this.supplierFormControl.value.faxNo;
      }
      if (this.supplierFormControl.value.year1 != '') {
        supplierFormData['year1'] = this.supplierFormControl.value.year1
      }
      if (this.supplierFormControl.value.year2 != '') {
        supplierFormData['year2'] = this.supplierFormControl.value.year2
      }
      if (this.supplierFormControl.value.year3 != '') {
        supplierFormData['year3'] = this.supplierFormControl.value.year3
      }

      this.supplierFormControl.controls['majorCustomerArray'].value.map((res: any) => {
        if (res.organizationName != '' && res.designation != '' && res.contactPerson != '' && res.email != '' && res.mobileNo != '') {
          this.selectedMajorCustomers.push(res);
        }
      })

      if (this.selectedMajorCustomers.length > 0) {
        supplierFormData['supplierMajorCustomersDetails'] = this.selectedMajorCustomers;
      }

      console.log(this.supplierFormControl.value.balanceSheet1);



      console.log(JSON.stringify(supplierFormData) , typeof this.supplierFormControl.value?.balanceSheet1);

      let formData = new FormData();
      formData.append('jsonData', JSON.stringify(supplierFormData))
      if(typeof this.supplierFormControl.value?.balanceSheet1 == 'object'){
        formData.append('balanceSheet1', this.supplierFormControl.value.balanceSheet1);
      }
      if(typeof (this.supplierFormControl.value?.balanceSheet2) == 'object'){
        formData.append('balanceSheet2', this.supplierFormControl.value.balanceSheet2);
      }
      if(typeof (this.supplierFormControl.value?.balanceSheet3) == 'object'){
        formData.append('balanceSheet3', this.supplierFormControl.value.balanceSheet3);
      }
      if(typeof (this.supplierFormControl.value?.cancelledCheque) == 'object'){
        formData.append('cancelledCheque', this.supplierFormControl.value.cancelledCheque);
      }
      if (typeof (this.supplierFormControl.value.documentsUploadPath) == 'object') {
        formData.append('documentsUploadPath', this.supplierFormControl.value['documentsUploadPath'])
      }

     if(this.supplierFormControl.controls['crFlag'].value == false){
      this._apiService.supplierUpdate(formData)
      .then((res: any) => {
        console.log(res);
        this._utility.loader(false);
        if (res.success == false) {
          this.errorMessage = res.message,
            this.errorMessageCheck = 'error'
          this._apiService.showMessage(this.errorMessage, this.errorMessageCheck);

        }
        else {
          let localStorageObject = {
            supplierId: res.returnValue,
            supplierName: this.supplierFormControl.controls['supplierName'].value,
            emailAddress: this.supplierFormControl.controls['emailAddress'].value
          }
          localStorage.setItem('supplier', JSON.stringify(localStorageObject))
          this.errorMessage = res.message
          this.errorMessageCheck = 'success'
          this._apiService.showMessage(this.errorMessage, this.errorMessageCheck);
          // this.getSupplierDetails();
          
        }
      })
     }

     else{
      // formData.append('raiseRemark' , 'Raise')
      this._apiService.raiseRequest(formData).then((res: any) => {
        console.log(res);
        if (res.success == true) {
          this._utility.loader(false);
          this._apiService.showMessage(res.message, 'success');
          // this.getSupplierDetails();
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/supplierMaster']);
        }

        else {
          this._apiService.showMessage(res.message, 'error');
          this._utility.loader(false);
          this.getSupplierDetails();
        }
      })
     }
    }
    else {
      // window.scroll(100, 100)
      this.errorMessage = 'please fill required details for registration'
      this.errorMessageCheck = 'error'
      this._apiService.showMessage(this.errorMessage, this.errorMessageCheck);
    }
  }

  countryDropdown : any = [];
  currencyDropdown : any = [];
  getState() {
    this._apiService.dropdowndata('paymentTerms').then((res: any) => {
      this.paymentDropdown = res.returnValue
    })

    this._apiService.dropdowndata('currency').then((res: any) => {
      this.currencyDropdown = res.returnValue
    })

    this._apiService.dropdowndata('country').then((res: any) => {
      this.countryDropdown = res.returnValue
    })

    this._apiService.dropdowndata('state').then((res: any) => {
      this.stateDropdown = res.returnValue
    })

    this._apiService.dropdowndata('purpose').then((res: any) => {
      this.purposeDropdown = res.returnValue
    })

    this._apiService.dropdowndata('manufacturing').then((res: any) => {
      let manufacturingData = this.getManufacturingArray();
      res.returnValue?.map((resp: any) => {
        manufacturingData.push(this.fb.group({
          id: resp.id,
          value: resp.value
        }))
      })
    })

    this._apiService.dropdowndata('materialconstruction').then((res: any) => {
      let materialofconstructionData = this.getMaterialofConstruction();
      res.returnValue?.map((resp: any) => {
        materialofconstructionData.push(this.fb.group({
          id: resp.id,
          value: resp.value
        }))
      })
    })


    this._apiService.dropdowndata('othercategory').then((res: any) => {
      this.selectedOtherCategory = res.returnValue;
    })
  }

  showCurrency: boolean = false;
  getSupplierType(event: any, string?:any) {
    console.log(event?.target?.value, string == true);
    if (event?.target?.value == 'true' || string == true) {
      this.showCurrency = true;
      // this.supplierFormControl.controls['countryId'].setValue('1');
      this.supplierFormControl.get('currency').addValidators(Validators.required);
      this.supplierFormControl.setControl('panNo', this.fb.control(''));
      this.supplierFormControl.setControl('gstinNo', this.fb.control(''));
      this.supplierFormControl.setControl('gstinDate', this.fb.control(''));
    }
    else {
      this.showCurrency = false;
      this.supplierFormControl.get('currency').clearValidators();
      this.supplierFormControl.setControl('panNo', this.fb.control('', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]));
      this.supplierFormControl.setControl('gstinNo', this.fb.control('', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]));
      this.supplierFormControl.setControl('gstinDate', this.fb.control('', [Validators.required]));
      this.supplierFormControl.patchValue({ 'currency': null })
    }
  }

  upload_doc(event: any, string?: any, idx?: any) {
    let file = this._utility.onFileChange(event);
    console.log(file);
    if (string == 'cancelledCheque') {
      if(file == false){
        this.cancelCheque.nativeElement.value = '';
      }

      else{
        this.supplierFormControl.controls['cancelledCheque'].setValue(file);
      }
    }

    else if (string == 'certificate') {
      this.certificateDetails[idx].certificateUploadPath = (file != false ? file : '');
    }

    else if (string == 'organization_profile') {
      this.supplierFormControl.controls['documentsUploadPath'].setValue(file != false ? file : '')
      // this.organizationProfile.nativeElement.value = file ? file : '';
    }

    else {
      if (string == 'year1') {
        this.supplierFormControl.controls['turnOver1'].controls['year1File'].setValue(file != false ? file : '');
        this.year1File.nativeElement.value = file ? file : '';
      }
      else if (string == 'year2') {
        this.supplierFormControl.controls['turnOver2'].controls['year2File'].setValue(file != false ? file : '');
        this.year2File.nativeElement.value = file ? file : '';
      }
      else if (string == 'year3') {
        this.supplierFormControl.controls['turnOver3'].controls['year3File'].setValue(file != false ? file : '');
        this.year3File.nativeElement.value = file ? file : '';
      }
    }
  }

  certificateBoolean: boolean = false;

  directorBoolean: boolean = false;

  selectedMajorCustomers: any = [];

  showOtherCityBoolean: boolean = false
  ShowOtherState(state_id: any) {
    console.log(state_id.target.value);
    if (state_id.target.value == 38) {
      this.showOtherCityBoolean = true;
      this.supplierFormControl.controls['otherState'].addValidators([Validators.required])
    }
    else {
      this.showOtherCityBoolean = false;
      this.supplierFormControl.controls['otherState'].removeValidators([Validators.required])
    }
  }

  setYears(string: any) {
    if (string == 'year1') {
      let year1 = this.supplierFormControl.controls['turnOver1'].controls['year1'].value;
      year1 = moment(year1).format('yyyy');
      this.supplierFormControl.controls['turnOver2'].controls['year2'].setValue(String(Number(year1) - 1))
      this.supplierFormControl.controls['turnOver1'].controls['year1'].setValue(String(Number(year1)))
      this.supplierFormControl.controls['turnOver3'].controls['year3'].setValue(String(Number(year1) - 2))
    }
    if (string == 'year2') {
      let year2 = this.supplierFormControl.controls['turnOver2'].controls['year2'].value;
      year2 = moment(year2).format('yyyy');
      console.log(this._utility.dateTimeChange(year2));

      this.supplierFormControl.controls['turnOver1'].controls['year1'].setValue(String(Number(year2) + 1))
      this.supplierFormControl.controls['turnOver2'].controls['year2'].setValue(String(Number(year2)))
      this.supplierFormControl.controls['turnOver3'].controls['year3'].setValue(String(Number(year2) - 1))
    }
    if (string == 'year3') {
      let year3 = this.supplierFormControl.controls['turnOver3'].controls['year3'].value;
      year3 = moment(year3).format('yyyy');
      this.supplierFormControl.controls['turnOver1'].controls['year1'].setValue(String(Number(year3) + 2))
      this.supplierFormControl.controls['turnOver2'].controls['year2'].setValue(String(Number(year3) + 1))
      this.supplierFormControl.controls['turnOver3'].controls['year3'].setValue(String(Number(year3)))
    }
  }

  majorCustomerValidation(string: any) {
    let valid = this.getMajorCustomerArray();
    let boolean: Boolean = true;
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


  otherRemark: boolean = false;
  getSelectOtherCategory(event: any) {
    console.log(event.target.value);
    if (event.target.value) {
      console.log('add');
      this.otherRemark = true;
    }
    else {
      console.log('remove');
      this.otherRemark = false;
    }
  }

  default: any;
  getApiCertificates() {
    let Id = JSON.parse(localStorage.getItem('supplier'))?.supplierId ?? '';
    if (Id) {
      this._apiService.getSupplierDocById(Id).then((res: any) => {
        this.default = res.returnValue.length;
        if (res.success == true) {
          res.returnValue.map((resp: any) => {
            this.certificateDetails.push({ certificateName: resp.documentName, certificateUploadPath: '', onboardingId: resp.onboardingId, isMandatory: resp.isMandatory ?? true })
          })
        }
      })
    }
  }


  readonlyVariable : boolean = false;
  changeRequest : string = '';
  updateFieldFlag : boolean = false;
  showFieldFlag : boolean = false;
  async getSupplierDetails() {
    let supplierId = this._utility.getLocalStorageDetails().supplierId;
    let responseArray: any = [];
    this._utility.loader(true);
    await this._apiService.getSupplier(supplierId).then((res: any) => {
      this._utility.loader(false);
      responseArray.push(res.returnValue);
      Object.keys(this.supplierFormControl.controls).forEach(key => {
        if(key != 'majorCustomerArray' && key != 'supplierDirectorsDetails' && key != 'isDomestic'){
          if(res.returnValue[key]){
            this.supplierFormControl.controls[key].setValue(res.returnValue[key]);
          }
        }
      });
    }) 

    this.supplierFormControl.controls['crFlag'].setValue(responseArray[0].crFlag);
    this.supplierFormControl.controls['isDomestic'].setValue(responseArray[0].isDomestic);
    
    //major customers
    this.getMajorCustomerArray().clear();
    if (responseArray[0].supplierMajorCustomersDetails?.length > 0) {
      let majorCustomerArray = this.getMajorCustomerArray();
      responseArray[0].supplierMajorCustomersDetails.map((res: any) => {
        majorCustomerArray.push(this.fb.group({ organizationName: new FormControl(res.organizationName), contactPerson: new FormControl(res.contactPerson), email: new FormControl(res.email, [Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]), mobileNo: new FormControl(res.mobileNo, [Validators.pattern("[0-9]+")]), designation: new FormControl(res.designation) }))
      })
    }


    //manufacturing 
    if (responseArray[0].supplierManufacturingDetails?.length > 0) {
      let data : any = [];
      for(let i=0; i< responseArray[0].supplierManufacturingDetails.length ; i++ ){
        data.push(responseArray[0].supplierManufacturingDetails[i].manufacturingId)       
      }
      this.manufacturingProcessList = data;
    }

    //material
    if (responseArray[0].supplierMaterialconstructionDetails?.length > 0) {
      let data : any = [];
      for(let i=0; i < responseArray[0].supplierMaterialconstructionDetails?.length; i++ ){
        data.push(responseArray[0].supplierMaterialconstructionDetails[i].materialconstructionId);
      }

      this.materialOfConstructionList = data;
    }


    //directors
    this.getDirectorArray().clear();
    if(responseArray[0].supplierDirectorsDetails?.length > 0){
      let directorDetails = this.getDirectorArray();
      responseArray[0].supplierDirectorsDetails.map((res:any)=>{
        directorDetails.push(this.fb.group({ directorName: new FormControl(res.directorName, [((Validators.required))]), mobileNo: new FormControl(res.mobileNo, [Validators.required, Validators.maxLength(15), Validators.minLength(10)]), email: new FormControl(res.email, [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]) }))
      })
    }

    console.log(this.supplierFormControl.value)
    this.supplierFormControl.controls['gstinDate'].setValue(this._utility.calendarDateFormat(this.supplierFormControl.controls['gstinDate'].value))
    
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

   if(responseArray[0].isVerify.includes('Rework')){
    this.readonlyVariable = true;
    this.updateFieldFlag = true;
    this.showFieldFlag = false;
    }
  else{
    if(responseArray[0].isApproved.includes('Rework')){
      this.readonlyVariable = true;
      this.updateFieldFlag = true;
      this.showFieldFlag = false;
    }
    else{
      if(responseArray[0].crFlag){
        this.changeRequest = responseArray[0].supplierRaiseRequestList;
        if(this.changeRequest != ''){
          this.readonlyVariable = true;
          this.updateFieldFlag = false;
          this.showFieldFlag = false;              
        }
      }
      else{
        this.readonlyVariable = false;
        this.updateFieldFlag = false;
        this.showFieldFlag = true;
      }
    }

  }



  if(!(this.changeRequest.includes('Tax Details')) && !this.readonlyVariable){
    this.supplierFormControl.controls['gstinDate'].disable();
  }
  
  if(!(this.changeRequest.includes('Turn Over')) && !this.readonlyVariable){
    this.supplierFormControl.controls['year1'].disable(); 
    this.supplierFormControl.controls['year2'].disable(); 
    this.supplierFormControl.controls['year3'].disable(); 
  }
    
  }
  showImageUploadInput(string:any){
    if(string == 'cancelledCheque'){
      this.cancelChequeUrl = '';
      this.supplierFormControl.controls['cancelledCheque'].setValue(null);
    }

    else if(string == 'year1'){
      this.year1Url = '';
      this.supplierFormControl.controls['balanceSheet1'].setValue(null);
    }

    else if(string == 'year2'){
      this.year2Url = '';
      this.supplierFormControl.controls['balanceSheet2'].setValue(null);
    }

    else if(string == 'year3'){
      this.year3Url = '';
      this.supplierFormControl.controls['balanceSheet3'].setValue(null);
    }

    else if(string == 'organizationProfile'){
      this.organizationProfileUrl = '';
      this.supplierFormControl.controls['documentsUploadPath'].setValue(null);
    }
  }

  showStateDropdown: boolean = false;
  showState(event: any , setValue : any) {
    if(!setValue){
      console.log(event.target.value);
      if (event.target.value == 1 || event.target.value == 4) {
        this.showStateDropdown = true;
        this.supplierFormControl.setControl('services', this.fb.control(this.supplierFormControl.value.services, [Validators.required]));
      }
  
      else {
        this.showStateDropdown = false;
        this.supplierFormControl.setControl('services', this.fb.control(''));
      }
    }

    else{
      if (setValue == 1 || setValue == 4) {
        this.showStateDropdown = true;
        this.supplierFormControl.setControl('services', this.fb.control(this.supplierFormControl.value.services, [Validators.required]));
      }
  
      else {
        this.showStateDropdown = false;
        this.supplierFormControl.setControl('services', this.fb.control(''));
      }
    }
  }

  currencyTypeValueINR : string = '0';
  getStateDropdown(event: any) {
    let object = {
      Mode: 'state',
      cond3: event?.value
    }

    if(event.value != 1){
      this.supplierFormControl.controls['isDomestic'].setValue(true);
      this.getSupplierType('', true);
    }

    else{
      this.supplierFormControl.controls['isDomestic'].setValue(false);
      this.getSupplierType('', false);
    }
    this._apiService.dropdowndata('', object).then((res: any) => {
      if (res.status == true) {
        this.stateDropdown = res.returnValue;
        this.showOtherCityBoolean = false;
        this.stateD = true;
      }

      else{
        this.supplierFormControl.controls['stateId'].setValue('0');
        this.stateDropdown = [];
        this.showOtherCityBoolean = true;
        this.stateD = false;
      }
    })
  }

}