import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
import { ApiServiceService } from '../../../../api-service.service';

@Component({
  selector: 'app-dashboard-wallet',
  templateUrl: './dashboard-wallet.component.html',
  styleUrls: ['./dashboard-wallet.component.scss']
})
export class DashboardWalletComponent implements OnInit {
  @ViewChild('uploadSupplierDoc') uploadSupplierDoc: ElementRef;
  supplierId: any;
  tax_dropdown: any = [];
  supplierEnquiryData: any = [];
  assignSupplierData: any = [];
  costBreakupData: any = [];
  getBreakupData: any = [];
  display: boolean = false;
  roleName: string = ''
  disableRemark: boolean = false;
  isRead: boolean = false;
  extraInfo: any = { taxId: 0 };
  displayOtherDialog: boolean;
  otherDocumentList: any;
  constructor(private _apiService: ApiServiceService, private router: Router, public _utility: AppUtility , private sanitizer : DomSanitizer) { }

  ngOnInit(): void {
    let local_id = localStorage.getItem('UserObject');
    if (local_id) {
      this.supplierId = JSON.parse(local_id).supplierId;
      console.log(this.supplierId);
    }
    this.tax();
    this.getAssignQuotation();
  }


  breadcrumb = [
    {
      title: 'Supplier Dashboard',
      subTitle: 'Dashboard'
    },
    {
      title: 'RFQ Reply Dashboard',
      subTitle: 'Dashboard'
    }
  ]

  getAssignQuotation() {
    let roleName = this._utility.getLocalStorageDetails();
    this.disableRemark = roleName.roleName == 'Supplier' ? true : false;
    this.roleName = roleName.roleName;
    console.log(this.roleName);
    if (roleName.roleName == 'Supplier') {
      let object = {
        supplierId: this.supplierId,
        roleName: this.roleName
      }
      this._apiService.getAssignedSupplierById(object).then((res: any) => {
        if (res.success == true) {
          if (res.returnValue.length > 0) {
            this.supplierEnquiryData = res.returnValue;
            console.log(res);
          }
          else {
            this.supplierEnquiryData = [];
          }
        }
      })
    }

    else if (roleName.roleName == 'User') {
      let loginId = {
        loginId: roleName.loginId,
        roleName: this.roleName
      }

      this._apiService.getAssignedSupplierById(loginId)
        .then((res: any) => {
          if (res.success == true) {
            this.supplierEnquiryData = res.returnValue;
          }
          else {
            this.supplierEnquiryData = [];
          }
        })
    }
  }

  enquiryNo: any = 0;
  supplierName: string = ''
  isClose: boolean = false;
  openModel(enquiryNo: any) {
    this.enquiryNo = enquiryNo.enquiryNo;
    this.supplierName = enquiryNo.supplierName
    this.supplierId = enquiryNo.supplierId;
    this.isClose = enquiryNo.isClose;
    this.getDashboardValue();
  }


  async getDashboardValue() {
    this._utility.loader(true);
    let object = {
      supplierId: this.supplierId,
      enquiryNo: this.enquiryNo,
      roleName: this.roleName
    }
    await this._apiService.getAssignedSupplierByIdWithEnquiryNo(object)
      .then((res: any) => {
        this._utility.loader(false);
        console.log(res.returnValue);
        if (res.success == true) {
          this.assignSupplierData = res.returnValue;
        }
        else {
          this.assignSupplierData = [];
        }
      })

      .catch((error: any) => {
        this._utility.loader(false);
        this.errorMsg = error.message,
          this.errorMsgCheck = "error"
        this._apiService.showMessage(this.errorMsg, this.errorMsgCheck);
      })

  }

  enquiryId : any;
  costBreakupdata() {
    console.log(this.costBreakupData);
    this.getBreakupData = [];
    let validData = this.costBreakupData.filter((res: any) => res.amount == 0)
    console.log(validData);
    if (validData.length == 0) {
      this.costBreakupData?.forEach((res: any) => {
        this.getBreakupData.push({
          costBreakupId: res.costBreakupId,
          enquiryId: res.enquiryId,
          amount: JSON.parse(res.amount),
          supplierId: this.supplierId,
          ItemId: this.itemId,
          checkerRemark: res.checkerRemark,
          remark: res.remark,
          supplierRFQReplyId: res.supplierRFQReplyId,
          isAddTotal: res.isActive
        })
      });
      return 1;
    }

    else {
      this._apiService.showMessage('Please fill required costbreakup details', 'error');
      return 0;
    }


  }

  errorMsg: string = ''
  errorMsgCheck: string = ''
  submitCostData() {
    let validCostBreakup = this.costBreakupdata();
    console.log(validCostBreakup);
    let object = {};
    let formData = new FormData();

    if (validCostBreakup == 1) {
      if (this.selectedImages) {
        formData.append('document', this.selectedImages);
      }
      object['supplierId'] = this.getBreakupData[0].supplierId;
      object['ItemId'] = this.getBreakupData[0].ItemId;
      object['enquiryId'] = this.getBreakupData[0].enquiryId;
      object['supplierItemId'] = this.supplierItemId;
      object['deliveryNotes'] = this.extraInfo.deliveryNotes;
      object['paymentTerms'] = this.extraInfo.paymentTerms;
      object['taxId'] = this.extraInfo.taxId;
      object['hsnName'] = this.extraInfo.hsnName;

      if (this.extraInfo.otherRemark) {
        object['otherRemark'] = this.extraInfo.otherRemark
      }

      object['assignSupplierListDetails'] = this.getBreakupData;
      formData.append("jsonData", JSON.stringify(object));

      console.log(this.extraInfo['paymentTerms']);

      if (this.extraInfo['paymentTerms'] != '' && this.extraInfo['deliveryNotes'] != '' && this.extraInfo['hsnName'] != '' && this.extraInfo['taxId'] != '') {
        this._utility.loader(true);
        this.display = false;
        this._apiService.postSupplierRFQReply(formData).then((res: any) => {
          this._utility.loader(false);
          this.display = false;
          console.log(res);
          if (res.success == true) {
            this.errorMsg = res.message,
              this.errorMsgCheck = "success"
            this._apiService.showMessage(this.errorMsg, this.errorMsgCheck);
            this.getAssignQuotation();
            this.extraInfo = {};
          }

          else {
            this.errorMsg = res.message,
              this.errorMsgCheck = "error"
            this._apiService.showMessage(this.errorMsg, this.errorMsgCheck);
            this.getAssignQuotation();
          }
        })

          .catch((error: any) => {
            this._utility.loader(false);
            this.errorMsg = error.message,
              this.errorMsgCheck = "error"
            this._apiService.showMessage(this.errorMsg, this.errorMsgCheck);
            this.getAssignQuotation();
          })
      }

      else {
        this._apiService.showMessage('Please fill required payment terms or delivery details or tax or hsn', 'error');
      }
    }
  }

  itemId: string = ''
  header: string = ''

  supplierItemId: any;
  documentPath: any;
  openModel1(itemDetail: any) {
    console.log(itemDetail);
    this.itemId = itemDetail.itemId
    this.header = 'Part Name : ' + itemDetail.itemName;
    let object = {
      itemId: this.itemId,
      supplierId: this.supplierId,
      enquiryNo: this.enquiryNo,
      roleName: this.roleName
    }
    this._apiService.getAssignedSupplierQuotationCostBreakup(object).then((res: any) => {
      console.log(res);
      this.supplierItemId = res.returnValue.supplierItemId;
      console.log('supplierItemId', this.supplierItemId);
      this.documentPath = res.returnValue.documentUpload;
      this.extraInfo['paymentTerms'] = res.returnValue.paymentTerms;
      this.extraInfo['deliveryNotes'] = res.returnValue.deliveryNotes;
      this.extraInfo['otherRemark'] = res.returnValue.otherRemark;
      this.extraInfo['taxId'] = res.returnValue.taxId;
      this.extraInfo['hsnName'] = res.returnValue.hsnName;
      this.extraInfo['quantity'] = res.returnValue.quantity;
      this.costBreakupData = res.returnValue.assignCostBreakupDetails;
    })
    this.display = true;
  }


  selectedImages: any = [];
  getMultipleImages(event: any) {
    this.selectedImages = this._utility.onFileChange(event);
    console.log(this.selectedImages);
  }
  async tax() {
    await this._apiService.dropdowndata('tax').then((res: any) => {
      this.tax_dropdown = res.returnValue;
    });

  }

  itemDetails: any = [];
  displayItem: boolean = false;
  getItemDetails(itemId: any) {
    console.log(itemId);
    this.itemDetails = [];
    this._apiService.getItemMasterById(itemId).then((res: any) => {
      console.log(res);
      if (res.success) {
        this.itemDetails.push(res.returnValue);
        this.displayItem = true;
      }
    })
  }


  editUploadedDrawing : any;
  displayDrawing : boolean = false;
  async showImagePreview(itemId: any , string:any) {
    console.log(itemId);
    this._utility.loader(true);
    if(string == 'engg'){
      await this._apiService.getEnggDrawing(itemId).then((res: any) => {
        this._utility.loader(false);
        if (res.success) {
          this.editUploadedDrawing = res.returnValue;
          this.displayDrawing = true;
        }
  
        else {
          this.editUploadedDrawing = [];
          this._apiService.showMessage('Engineering Drawing not Found' , 'error');
        }
      })
    }

    else{
      // let enquiryId = this.requestForQuotationForm.get('enquiryId')?.value;
      let object = {
        Mode : 'DrawingDetails',
        Cond3 :  this.costBreakupData[0]?.enquiryId,
        itemId : itemId
      }
      this._apiService.dropdowndata('' , object).then((res:any)=>{
        console.log(res);
        this._utility.loader(false);
        if(res.success){
          this.displayOtherDialog = true;
          this.otherDocumentList = res.returnValue;
        }
  
        else{
          this.otherDocumentList = [];
          this._apiService.showMessage('Other Document not Found' , 'error');
        }
      })
    }
    

    console.log(this.editUploadedDrawing);
  }

  
  getSafeUrl(file:any){
    return this.sanitizer.bypassSecurityTrustResourceUrl(file);
  }


}