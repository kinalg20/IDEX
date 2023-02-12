import { Component, OnInit } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-supplier-change-approval',
  templateUrl: './supplier-change-approval.component.html',
  styleUrls: ['./supplier-change-approval.component.scss']
})
export class SupplierChangeApprovalComponent implements OnInit{
  stateDropdown: any;
  paymentDropdown: any;
  purposeDropdown: any;
  manufacturingArray: any;
  materialConstructionArray: any;
  otherCategoryArray: any;
  currencyDropdown: any;
  userroleName: any;
  approvalStatus: any = [];
  msgs: Message[] = [];
  filterval: string;
  dateFilterVal: string;
  constructor(private _utility : AppUtility , private _apiService : ApiServiceService , private confirmationService : ConfirmationService){}
  ngOnInit(){
    this.getStatic();
    this.userroleName = this._utility.getLocalStorageDetails();
    if (this.userroleName.checker1 == true) {
      this.approvalStatus.push({ name: 'Pending', value: "Pending" }, { name: 'Verified', value: "Verified" })
    }
    else if (this.userroleName.checker2 == true) {
      this.approvalStatus.push({ name: 'Pending', value: "Pending" }, { name: 'Approved', value: "Approved" })
    }
    else {
      this.approvalStatus.push({ name: 'Pending', value: "Pending" }, { name: 'Approved', value: "Approved" }, { name: 'Verified', value: "Verified" })
    }
    this.getAllSupplierDetail();
  }

  supplierList : any = [];
  display : boolean = false;
  getAllSupplierDetail() {
    this._utility.loader(true);
    this.supplierList = [];
    this._apiService.getSupplier().then((res: any) => {
      console.log(res);
      this._utility.loader(false);
      if (res.success == true) {
        res.returnValue.forEach((resp:any)=>{
          if(resp.jsonData){
            this.supplierList.push(resp);
          }
        })
      }
      else {
        this.supplierList = [];
      }
      console.log(this.supplierList);
      
    })
  }

  breadcrumb = [
    {
      title: 'Supplier Change Request List',
      subTitle: 'Dashboard'
    }
  ]

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
        else if (response.otherCategoryData) {
          this.otherCategoryArray = response.otherCategoryData;
        }
      });
    })

    this._apiService.dropdowndata('currency').then((res: any) => {
      this.currencyDropdown = res.returnValue;
    })
  }

  userCapture: any;
  readonly: boolean = false;
  showString : any;
  supplierId : any;
  supplierListById : any = {};
  supplierJsonData : any = {};
  certificates: any = [];
  async openModal(supplierId: any, string: any) {
    // debugger;
    this.supplierId = supplierId;
    this._utility.loader(true);
    await this._apiService.getSupplier(supplierId).then((res)=>{
      this._utility.loader(false);
      if (res.success == true) {
        console.log(JSON.parse(res.returnValue?.jsonData));
        this.display = true;
        this.supplierListById = res.returnValue;
        if(res.returnValue?.raiseRequestFlag){
          this.supplierJsonData = JSON.parse(res.returnValue?.jsonData);
        }
        else{
          this.supplierJsonData = {};
        }
        console.log(this.supplierListById , this.supplierJsonData);
        if ((this.userroleName.checker2 == true)) {
          if (this.supplierListById.raiseApproved == 'Pending' || this.supplierListById.raiseApproved == 'Rework' || this.supplierListById.raiseApproved == '') {
            this.supplierListById.statusCapture = this.supplierListById.raiseApproved == '' ? 'Pending' : this.supplierListById.raiseApproved;
            if (this.supplierListById.raiseVerify == 'Pending') {
              this.userCapture = true;
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
          this.supplierListById.statusCapture = this.supplierListById.raiseVerify;
          this.userCapture = this.supplierListById.raiseVerify == 'Pending' || this.supplierListById.raiseVerify == 'Rework' ? false : true;
        }

        else {
          this.supplierListById.statusCapture = this.supplierListById.raiseApproved == 'Approved' ? this.supplierListById.raiseApproved : this.supplierListById.raiseApproved;
          this.userCapture = true;
        }
      }
    })
  }

  captureStatus(supplierListById: any , string: any) {
   console.log(string);
   if(string == 'Submit'){
    let msg: string = '';
    if (supplierListById.statusCapture != 'Pending') {
      if (confirm("Do you want to approve supplier change request" + msg)) {
        console.log(supplierListById , this.supplierJsonData);
        let object = this.supplierJsonData;
        this._utility.loader(true);
        this.display = false;

        console.log(object);
        // debugger;
        if (this.userroleName.checker1 == true) {
          object['raiseVerify'] = supplierListById.statusCapture;
          object['checker1'] = this.userroleName.checker1;
        }
        else if (this.userroleName.checker2 == true) {
          object['raiseApproved'] = supplierListById.statusCapture;
          object['checker2'] = this.userroleName.checker2;
        }
        let formData = new FormData(); 
        formData.append('jsonData', JSON.stringify(object))
        this._apiService.putRaiseRequest(formData)
        .then((res: any) => {
          this._utility.loader(false);
          console.log(res);
          if (res.success == true) {
            this._apiService.showMessage(res.message, "success");
            // this.assessmentBoolean = false;
            this.getAllSupplierDetail();
          }
          else {
            this._apiService.showMessage(res.message, "error");
          }
        })
      }
    }

    else {
      this.display = false;
    }
   }
  }

  reset(dt2) {
    dt2.reset();
    this.filterval = '';
    this.dateFilterVal = ''
  }

  confirm1(customer: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Send for JDE Approval',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.getSelectedSupplier(customer);
        this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  // getSelectedSupplier(customer) {
  //   this.display = false;
  //   this._utility.loader(true);
  //   let sendForChecker2s: any = [];

  //   sendForChecker2s.push({
  //     'supplierId': customer.supplierId,
  //     'sendForChecker2': true,

  //   })

  //   let object: any = {};
  //   object.sendForChecker2s = sendForChecker2s;
  //   this._apiService.putRaiseRequest().then((res: any) => {
  //     this._utility.loader(false);
  //     if (res.success == true) {
  //       this._apiService.showMessage(res.message, 'success');
  //       this.getAllSupplierDetail();
  //     }
  //     else {
  //       this._apiService.showMessage(res.message, 'error');
  //     }
  //   })
  // }
}
