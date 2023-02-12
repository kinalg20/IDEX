import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ConfirmationService, Message, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
import { Clipboard } from "@angular/cdk/clipboard"

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {
  supplierList: any = [];
  supplierListById: any = [];
  document_dropdown: any = [];
  supplierId: any;
  header: any;
  displayCheque: boolean = false;
  displayYear1: boolean = false;
  displayYear2: boolean = false;
  displayYear3: boolean = false;
  displayProfile: boolean = false;
  assessmentBoolean: boolean = false;

  docObject = {
    cheque : '',
    year1File :'',
    year2File : '',
    year3File : '',
    organizationProfile : '',
    assessment : ''
  }
  myDate : any;
  display: boolean = false;
  approvalStatus: any = [];
  userroleName: any;
  msgs: Message[] = [];
  selectedSupplier: any[];

  @ViewChild('cancelCheque') cancelCheque: ElementRef;
  @ViewChild('year1File') year1File: ElementRef;
  @ViewChild('year2File') year2File: ElementRef;
  @ViewChild('year3File') year3File: ElementRef;
  @ViewChild('organizationProfile') organizationProfile: ElementRef;
  @ViewChild('assessment') assessmentdoc: ElementRef;
  constructor(private clipboard: Clipboard,private _apiService: ApiServiceService, public _utility: AppUtility, private primengConfig: PrimeNGConfig, private confirmationService: ConfirmationService) { }

  breadcrumb = [
    {
      title: 'Supplier List',
      subTitle: 'Dashboard'
    }
  ]


  @ViewChild ('dt2') FilteredData:Table;


  dateFilterVal:string;
  filterval: string;

  ngOnInit(): void {
    this.getStatic();
    this.myDate = new Date();
    this.header = "Supplier Detail"
    this.primengConfig.ripple = true;
    this.userroleName = this._utility.getLocalStorageDetails();
    this.getAllSupplierDetail();
    if (this.userroleName.checker1 == true) {
      this.approvalStatus.push({ name: 'Pending', value: "Pending" }, { name: 'Verified', value: "Verified" }, { name: 'Rework', value: "Rework" }, { name: 'Rejected', value: "Rejected" })
    }
    else if (this.userroleName.checker2 == true) {
      this.approvalStatus.push({ name: 'Pending', value: "Pending" }, { name: 'Approved', value: "Approved" }, { name: 'Rework', value: "Rework" }, { name: 'Rejected', value: "Rejected" })
    }
    else {
      this.approvalStatus.push({ name: 'Pending', value: "Pending" }, { name: 'Approved', value: "Approved" }, { name: 'Rework', value: "Rework" }, { name: 'Rejected', value: "Rejected" }, { name: 'Verified', value: "Verified" })
    }
  }

  // supplierApproved : boolean = false;
  getAllSupplierDetail() {
    this._utility.loader(true);
    // if (this.userroleName.checker1 == true || this.userroleName.checker2 == true) {
    this._apiService.getSupplier().then((res: any) => {
      console.log(res);
      this._utility.loader(false);
      if (res.success == true) {
        this.supplierList = res.returnValue;
      }
      else {
        this.supplierList = [];
      }
    })
    // }
  }


  userCapture: any;
  readonly: boolean = false;
  showString : any;
  certificates: any = [];
  async openModal(supplierId: any, string: any) {
    let supplierManufacturingDropdown = [0];
    let supplierMaterialDropdown = [0];
    this.supplierId = supplierId;
    this.document = [];
    this.displayCheque = false;
    this.displayYear1 = false;
    this.displayYear2 = false;
    this.displayYear3 = false;
    this.displayProfile = false;
    this._utility.loader(true);
    await this._apiService.getSupplier(supplierId)
    .then((res: any) => {
      if (res.success == true) {
        this.supplierListById = res.returnValue;
        this.certificates = res.returnValue.supplierCertificatesDetails;
        console.log(this.supplierListById);

        //assignData
        if (this.supplierListById.supplierManufacturingDetails?.length > 0) {
          this.supplierListById.supplierManufacturingDetails.forEach((res: any) => {
            supplierManufacturingDropdown?.push(res.manufacturingId);
          })
        }

        if (this.supplierListById.supplierMaterialconstructionDetails?.length > 0) {
          this.supplierListById.supplierMaterialconstructionDetails.forEach((res: any) => {
            supplierMaterialDropdown?.push(res.materialconstructionId);
          })
        }

        this.supplierListById.supplierManufacturingDropdown = supplierManufacturingDropdown;
        this.supplierListById.supplierMaterialDropdown = supplierMaterialDropdown;
        this.supplierListById.documentUploadPath = res.returnValue.documentsUploadPath;

        // debugger;
        this.supplierListById.date = moment(res.returnValue.gstinDate).format('MM/DD/YYYY'),
        this.supplierListById.yearOfEstablished = String(res.returnValue.yearofEstablishment)
        this.supplierListById.year1 = String(res.returnValue.year1)
        this.supplierListById.year2 = String(res.returnValue.year2)
        this.supplierListById.year3 = String(res.returnValue.year3)
        this.assessmentBoolean = res.returnValue.assessment;

        this.showString = string;
        if (string == 'show') {
          this.readonly = true;
          //checker Roles
          if ((this.userroleName.checker2 == true)) {
            if (this.supplierListById.isApproved == 'Pending' || this.supplierListById.isApproved == 'Rework' || this.supplierListById.isApproved == '') {
              this.supplierListById.statusCapture = this.supplierListById.isApproved == '' ? 'Pending' : this.supplierListById.isApproved;
              if (this.supplierListById.isVerify == 'Pending') {
                this.userCapture = true;
              }
              else if(this.supplierListById.isApproved == 'Rework'){
                this.supplierRemark = this.supplierListById.isApprovedRemark
              }

              else {
                this.userCapture = false;
              }
            }
            else {
              this.userCapture = true;
              this.supplierListById.statusCapture = 'Approved';
            }
          }

          else if (this.userroleName.checker1 == true) {
            this.supplierListById.statusCapture = this.supplierListById.isVerify;
            this.userCapture = this.supplierListById.isVerify == 'Pending' || this.supplierListById.isVerify == 'Rework' ? false : true;
            if(this.supplierListById.isVerify == 'Rework'){
              this.supplierRemark = this.supplierListById.isVerifyRemark
            }
          }

          else {
            this.supplierListById.statusCapture = this.supplierListById.isApproved == 'Approved' ? this.supplierListById.isApproved : this.supplierListById.isVerify;
            this.userCapture = true;
          }
        }

        console.log(this.userroleName.roleName);
        if(this.userroleName.roleName == 'Finance'){
          this.displayFinance = true;
        }
        else{
          this.display = true;
        }

      }
      else {
        this.supplierListById = []
      }
      this._utility.loader(false)

      console.log(this.supplierListById);        
    })
  }

  document: any = [];
  displayFinance : boolean = false;
  supplierRemark: string = '';
  captureStatus(supplierListById: any , string: any) {
   console.log(string);
   if(string == 'Submit'){
    let msg: string = '';
    msg = this.document.length == 0 ? ' and also want to continue without selecting any document' : ''
    if (supplierListById.statusCapture != 'Pending') {
      if (confirm("Do you want to approve supplier status" + msg)) {
        console.log(supplierListById);
        this._utility.loader(true);
        this.display = false;
        let object1: any = [];
        if (this.document.length > 0) {
          this.document.map((res: any) => {
            object1.push({ documentId: res.id, supplierId: this.supplierId, documentName: res.value })
          })
        }
        let object = {
          supplierId: this.supplierId,
          emailAddress: supplierListById.emailAddress,
          SupplierOnboardingDetails: object1,
          supplierName : supplierListById.supplierName , 
          newSupplierName : supplierListById.supplierName ?? supplierListById.supplierName
        }

        if(this.assessmentBoolean){
          object['assessment'] = this.assessmentBoolean
        }
        
        if (this.userroleName.checker1 == true) {
          object['isVerifyRemark'] = this.supplierRemark;
          object['isVerify'] = supplierListById.statusCapture;
          object['checker1'] = this.userroleName.checker1;
        }
        else if (this.userroleName.checker2 == true) {
          object['isApprovedRemark'] = this.supplierRemark;
          object['isApproved'] = supplierListById.statusCapture;
          object['checker2'] = this.userroleName.checker2;
        }

        this._apiService.supplierDocUpload(object).then((res: any) => {
          this._utility.loader(false);
          console.log(res);
          if (res.success == true) {
            this._apiService.showMessage(res.message, "success");
            this.getAllSupplierDetail();
          }
          else {
            this._apiService.showMessage(res.message, "error");
          }
        })

        if(this.docObject.assessment){
          this.uploadAssessment();
          this.getAllSupplierDetail();
        }
      }
    }

    else {
      this.display = false;
    }
   }
  }

  uploadAssessment(){
    let formData = new FormData();
    formData.append('assessmentUpload' , this.docObject.assessment);
    formData.append('supplierId' , this.supplierListById.supplierId);
    this._apiService.assessmentUpload(formData).then((res:any)=>{
      console.log(res);
      if(res.success){
        this._apiService.showMessage(res.message , 'success');
      }
    })
  }

  supplierFormDataList : any = [];


  stateDropdown: any = [];
  paymentDropdown: any = [];
  purposeDropdown: any = [];
  manufacturingArray: any = [];
  materialConstructionArray: any = [];
  otherCategoryArray: any = [];
  currencyDropdown: any = [];

  getStatic() {
    let data = this._utility.getDropdownData();
    data.then((res) => {
      res.forEach((response: any) => {
        if (response.stateDropdown) {
          this.stateDropdown = response.stateDropdown;
        }
        else if (response.paymentDropdown) {
          this.paymentDropdown = response.paymentDropdown;
        }
        else if (response.purposeDropdown) {
          this.purposeDropdown = response.purposeDropdown;
        }
        else if (response.manufacturingData) {
          response.manufacturingData.forEach((res: any) => {
            this.manufacturingArray.push({
              id: res.id,
              value: res.value
            })
          })
        }
        else if (response.materialofconstructionData) {
          this.materialConstructionArray = response.materialofconstructionData;
        }
        else if (response.otherCategoryData) {
          this.otherCategoryArray = response.otherCategoryData;
        }
      });
    })

    this._apiService.dropdowndata('document').then((res: any) => {
      this.document_dropdown = res.returnValue;
    })

    this._apiService.dropdowndata('currency').then((res: any) => {
      this.currencyDropdown = res.returnValue;
    })
  }


  getSelectedSupplier(customer) {
    console.log(this.selectedSupplier);
    this.display = false;
    this._utility.loader(true);
    let sendForChecker2s: any = [];

    sendForChecker2s.push({
      'supplierId': customer.supplierId,
      'sendForChecker2': true
    })

    let object: any = {};
    object.sendForChecker2s = sendForChecker2s;
    this._apiService.supplierUpdate(object, 'sendForChecker2').then((res: any) => {
      this._utility.loader(false);
      if (res.success == true) {
        this._apiService.showMessage(res.message, 'success');
        this.getAllSupplierDetail();
        this.selectedSupplier = [];
      }
      else {
        this._apiService.showMessage(res.message, 'error');
      }
    })
  }

  confirm1(customer: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Send for JDE Approval',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.getSelectedSupplier(customer);
        this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }


  showCurrency: boolean = false;

  setYears(string: any) {
    if (string == 'year1') {
      let year1 = this.supplierListById.year1;
      year1 = moment(year1).format('yyyy');
      this.supplierListById.year2 = String(Number(year1) - 1)
      this.supplierListById.year1 = String(Number(year1))
      this.supplierListById.year3 = String(Number(year1) - 2)
    }
    else if (string == 'year2') {
      let year2 = this.supplierListById.year2;
      year2 = moment(year2).format('yyyy');
      this.supplierListById.year1 = String(Number(year2) + 1)
      this.supplierListById.year2 = String(Number(year2))
      this.supplierListById.year3 = String(Number(year2) - 1)
    }
    else if (string == 'year3') {
      let year3 = this.supplierListById.year2;
      year3 = moment(year3).format('yyyy');
      this.supplierListById.year1 = String(Number(year3) + 2)
      this.supplierListById.year2 = String(Number(year3) + 1)
      this.supplierListById.year3 = String(Number(year3))
    }
  }

  selectManufacturingList(string:any){
    if(string == 'manufacture'){
      this.supplierListById.manufacturingProcessList = this.supplierListById.supplierManufacturingDropdown;
    }    

    else if(string == 'material'){
      this.supplierListById.materialofconstructionList = this.supplierListById.supplierMaterialDropdown;
    }

    console.log(this.supplierListById.materialofconstructionList , this.supplierListById.manufacturingProcessList);
  }

  upload_doc(event: any, string?: any, idx?: any) {
    let file = this._utility.onFileChange(event);
    console.log(file);    
    if (string == 'cancelCheque') {
      if (file == false) {
        this.docObject.cheque = null;
        this.cancelCheque.nativeElement.value = null;
      }
      else {
        this.docObject.cheque  = file;

      }
    }

    else if (string == 'organizationProfile') {
      if (file == false) {
        this.docObject.organizationProfile = null;
        this.organizationProfile.nativeElement.value = null;
      }
      else {
        this.docObject.organizationProfile = file;
      }
    }

    else if(string == 'Assessment'){
      if (file == false) {
        this.docObject.assessment = null;
        this.assessmentdoc.nativeElement.value = null;
      }
      else {
        this.docObject.assessment = file;
        if(this.supplierListById.isVerify == 'Verified' || this.supplierListById.isVerify == 'Approved'){
          this.display = false;
          this.uploadAssessment();
        }
      }
    }

    else {
      if (string == 'year1') {
        if (file == false) {
          this.docObject.year1File  = '';
          this.year1File.nativeElement.value = null;
        }
        else {
          this.docObject.year1File  = file;
        }
      }
      else if (string == 'year2') {
        if (file == false) {
          this.docObject.year2File  = '';
          this.year2File.nativeElement.value = null;
        }
        else {
          this.docObject.year2File = file;
        }
      }
      else if (string == 'year3') {
        if (file == false) {
          this.docObject.year3File = '';
          this.year3File.nativeElement.value = null;
        }
        else {
          this.docObject.year3File = file;
        }
      }
    }
  }

  reset(dt2) {
    dt2.reset();
    this.filterval = '';
    this.dateFilterVal = ''
  }

  displayJde : boolean = false;
  jdeHeader : string = 'JDE Registration';
  jdeForm = {
    jdeNo : '',
    jdeApproved : true,
    supplierId : ''
  }
  jdeWindow(customer:any){
    if(this.userroleName?.roleName == 'Finance'){
      this.displayJde = true;
      this.jdeForm.supplierId = customer.supplierId;
      this.jdeForm.jdeNo = customer.jdeNo;
    }
  }

  submitJDE(form:NgForm){
    if(form.valid){
      this._apiService.putJDEEntry(this.jdeForm)
      .then((res:any)=>{
        if(res.success){
          console.log(res);
          this._apiService.showMessage(res.message , 'success');
          this.displayJde = false;
          this.getAllSupplierDetail();
        }

        else{
          this._apiService.showMessage(res.message , 'error');
          this.displayJde = false;
          this.getAllSupplierDetail();
        }
      })
    }
  }

  downloadImage(string){
    
  }
}



