import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
import { ConfirmationService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-enquiry-comparison',
  templateUrl: './enquiry-comparison.component.html',
  styleUrls: ['./enquiry-comparison.component.scss']
})
export class EnquiryComparisonComponent implements OnInit {
  msgs: Message[];
  constructor(private _apiService: ApiServiceService, private router : Router , private _utility: AppUtility, private confirmationService: ConfirmationService) { }
  display: boolean = false;
  quotationHeaders: any = [];
  itemQuotation: any = [];
  supplierQuotation: any = [];
  items: any = [];
  errorMsgCheck: string = ''
  errorMsg: string = ''
  toolsList : any = {};
  userObject : any;

  breadcrumb = [
    {
      title: 'Purchase Enquiry Compare List',
      subTitle: 'Dashboard'
    }
  ]
  ngOnInit(): void {
    this.userObject  = this._utility.getLocalStorageDetails();
    this.getQuotation();
  }

  getQuotation() {
    this._utility.loader(true);
    this._apiService.getItemFromQuotation()
      .then((res: any) => {
        this._utility.loader(false);
        if (res.success == true) {
          console.log(res);
          this.quotationHeaders = res.returnValue;
        }

        else {
          this.quotationHeaders = [];
        }
      })
  }

  itemDetails: any = {};
  // itemEnquiry: boolean = false;
  purchaseEnquiryCompareId: any;
  onTabOpen(event: any) {
    console.log(event.compareDetails);
    this.itemQuotation = event.compareDetails;
    this.purchaseEnquiryCompareId = event.purchaseEnquiryCompareId
  }


  display1: boolean = false;
  

  selectOneCheckbox(event: any, id: any, itemDetails: any) {
    if (event.target.checked) {
      const checkboxes = document.querySelectorAll('.vanillaHandsets input[type="checkbox"]');
      checkboxes.forEach((item) => {
        const item1 = item as HTMLInputElement;
        if (parseInt(item.id, 10) !== parseInt(id, 10)) {
          item1.checked = false;
        }
      });
      console.log(itemDetails);
      this.getItemEnquiryData(itemDetails);
    }

    else {
      this.display1 = false;
      console.log(this.display1);
    }
  }





  getEnquiryData: any = [];
  selectedItem: any = {};
  submitBoolean : boolean = false;
  enquiryClosed : boolean = false;

  getItemEnquiryData(itemDetails: any) {
    this.enquiryClosed = itemDetails.ItemWiseClose;
    this.selectedItem = itemDetails;
    let object = {
      Mode: 'enquirywiseSupplier',
      Cond3: itemDetails.EnquiryId,
      supplierId : itemDetails.ItemId
    }
    this._apiService.dropdowndata('', object).then((res: any) => {
      console.log(res);
      if (res.success == true) {
        this.getEnquiryData = res.returnValue;
        this.toolsList = this.getEnquiryData[0]
        this.display1 = true;
        this.submitBoolean = res.returnValue.status == 'Approved' ? true : false;
      }
    })
  }


  onHide() {
    this.popupCheck = false;
    const checkboxes = document.querySelectorAll('.vanillaHandsets input[type="checkbox"]');
    checkboxes.forEach((item) => {
      const item1 = item as HTMLInputElement;
      // if (parseInt(item.id, 10) !== parseInt(id, 10)) {
      item1.checked = false;
      // }
    });
  }

  closeEnquiry(enquiryId: any) {
    let object = {
      enquiryId: enquiryId,
      isClose: true
    }

    this._apiService.submitOrderQuantity(object).then((res: any) => {
      console.log(res);
      if (res.success == true) {
        this._apiService.showMessage(res.message, 'success');
        this.getQuotation();
      }
      else {
        this._apiService.showMessage(res.message, 'error');
      }
    })
  }


  submitOrderQuantity() {
    let submitOrderData: any = [];
    this.totalOrderQuantity = 0;      
    this.getEnquiryData.forEach(element => {
      console.log(element.quantity);
      this.totalOrderQuantity+= Number(element.quantity);
    });


    console.log(this.totalOrderQuantity);
    
    if(this.totalOrderQuantity <= this.selectedItem.Quantity && this.totalOrderQuantity != 0){
      console.log(this.getEnquiryData , this.toolsList);      
      for (let i = 0; i < this.getEnquiryData.length; i++) {
        if(this.getEnquiryData[i].quantity > 0){
          let dataObject: any = {};
          dataObject = {
            purchaseEnquiryCompareId: this.getEnquiryData[i].id,
            EnquiryId: this.selectedItem.EnquiryId,
            EnquiryItemId: this.selectedItem.EnquiryItemId,
            HSNName: this.selectedItem.HSNName,
            ItemId: this.selectedItem.ItemId,
            UnitName: this.selectedItem.UnitName,
            orderQuantity: this.getEnquiryData[i].quantity,
            quantity: this.selectedItem.Quantity,
            supplierId: this.getEnquiryData[i].supplierId,
            apqpRequire : this.toolsList.apqpRequire,
            ppapRequire : this.toolsList.ppapRequire,
            toolLoanAgreementRequire : this.toolsList.toolLoanAgreementRequire,
            toolHealthCheckupRequire : this.toolsList.toolHealthCheckupRequire
          }
        submitOrderData.push(dataObject);
        }
      }
  
      console.log("submitOrderData", submitOrderData);
      if(submitOrderData.length > 0){
        let data: any = {};
        data.purchaseEnquiryCompareDetails = submitOrderData;
        data.EnquiryId = submitOrderData[0].EnquiryId;
        data.ItemId = submitOrderData[0].ItemId;
        this._apiService.submitOrderQuantity(data)
        .then((res: any) => {
          if (res.success == true) {
            this.errorMsg = res.message;
            window.scroll(0, 0);
            this.getQuotation();
            this.errorMsgCheck = 'success'
            this.display1 = false;
            this.display = false;
            this._apiService.showMessage(this.errorMsg, this.errorMsgCheck);
          }
    
          else {
            this.errorMsg = res.message;
            window.scroll(0, 0)
            this.errorMsgCheck = 'error'
            this.display1 = false; 
            this.display = false; 
            this._apiService.showMessage(this.errorMsg, this.errorMsgCheck);
          }
        })
      }

      else{
        this.display1 = false;
      }
    }

    else{
      this._apiService.showMessage('Please Enter Valid Order Quantity' , 'error');
    }
  }


  totalOrderQuantity: number = 0;
  // getTotalOrderQuantity(){
  //   this.totalOrderQuantity = 0;
  //   this.supplierQuotation.map((res:any)=>{
  //     this.totalOrderQuantity+= res.orderQuantity;
  //     console.log(res.orderQuantity);
  //   })   
  // }

  confirm1(enquiryId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Want to Close enquiry',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
        this.closeEnquiry(enquiryId)
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  popupCheck:boolean = false;
  popupValue : any;
  showExtraInfo(data:any){
    console.log(data);
    this.popupValue = data;
    this.popupCheck = true
  }

  getDataById(header){
    console.log(header)
    // this.router.navigateByUrl("/enquiryPurchase/"+ header.enquiryId)
    this.router.navigate(['/enquiryPurchase/'+ header.enquiryId]);
  }
}
