import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-enquiry-comparison-by-id',
  templateUrl: './enquiry-comparison-by-id.component.html',
  styleUrls: ['./enquiry-comparison-by-id.component.scss']
})
export class EnquiryComparisonByIdComponent implements OnInit {

  constructor(private route: Router, private router: ActivatedRoute, private _apiService: ApiServiceService, private _utility: AppUtility) { }

  ngOnInit(): void {
    let slug = this.router.snapshot.params;
    this.userObject = this._utility.getLocalStorageDetails();
    console.log(slug)
    let value = ['Bussiness head', 'Precurement head'].includes(this.userObject.roleName);
    console.log(value);
    this.submitButton = value ? 'Submit Status' : 'Add Remark';
    console.log(this.submitButton);
    this.getSupplierByItemId(slug)
  }


  itemName: string = '';
  quantity: any;
  userObject: any;
  comparisonHeaders: any = [];
  supplierQuotation: any = [];
  totalArray: any = [];
  display1: boolean = false;
  popupCheck: boolean = false;
  enquiryNoHeading: string = '';
  ProjectNameHeading: string = '';
  submitButton: string;
  getSupplierByItemId(enquiry: any) {
    console.log(enquiry);
    this._utility.loader(true);
    this.supplierQuotation = [];
    this.comparisonHeaders = [];

    // api call

    let object = {
      enquiryId: enquiry.enquiryId
    }

    this._apiService.getJson(object).then((res: any) => {
      this._utility.loader(false);
      if (res.Status == true) {
        this.supplierQuotation = JSON.parse(res.ReturnValue.m_StringValue);
        console.log(this.supplierQuotation);
        this.enquiryNoHeading = this.supplierQuotation[0]['Enquiry No'];
        this.ProjectNameHeading = this.supplierQuotation[0]['Project Name'];
        console.log(this.enquiryNoHeading)
        Object.keys(this.supplierQuotation[0]).forEach((data: any) => {
          if (!(['Srno', 'PurchaseEnquiryCompareId', 'Enquiry No', 'Project Name', 'ItemWiseClose', 'EnquiryItemId', 'EnquiryId', 'HSNName', 'UnitName', 'OrderQuantity', 'TaxId', 'ItemId'].includes(data))) {
            this.comparisonHeaders.push(data);
          }
        })

        this.supplierQuotation.forEach((data: any) => {
          if (data['Cost Breakup Name'] == '-Total') {
            let totalAmount: number = 0;
            let count = 0;
            Object.keys(data).forEach((res: any) => {
              if (!['Srno', 'PurchaseEnquiryCompareId', 'ItemWiseClose', 'Enquiry No', 'Project Name', 'EnquiryItemId', 'EnquiryId', 'HSNName', 'UnitName', 'OrderQuantity', 'TaxId', 'ItemId', 'Cost Breakup Name', 'Item Code', 'Part Number', 'Quantity'].includes(res)) {
                if (count == 0) {
                  totalAmount = data[res]
                }
                else {
                  if (totalAmount > data[res]) {
                    totalAmount = data[res];
                  }
                }
                count = count + 1;
              }

              data.minAmount = totalAmount;
              console.log(totalAmount);
            })

            this.totalArray.push(data);
            console.log(this.totalArray);
            totalAmount = 0;
          }
        })

      }
      else {
        this.supplierQuotation = [];
      }
      // this.display = true;
    })
  }

  totalOrderQuantity: number = 0;
  submitOrderQuantity(string?: any) {
    let submitOrderData: any = [];
    this.totalOrderQuantity = 0;

    if (string == 'Submit') {
      this.getEnquiryData.forEach(element => {
        console.log(element.quantity);
        this.totalOrderQuantity += Number(element.quantity);
      });


      console.log(this.totalOrderQuantity);

      if (this.totalOrderQuantity <= this.selectedItem.Quantity && this.totalOrderQuantity != 0) {
        console.log(this.getEnquiryData, this.toolsList);
        for (let i = 0; i < this.getEnquiryData.length; i++) {
          if (this.getEnquiryData[i].quantity > 0) {
            let dataObject: any = {};
            dataObject = {
              purchaseEnquiryCompareId: this.getEnquiryData[i].id,
              EnquiryId: this.selectedItem.EnquiryId,
              comparisonRemark: this.toolsList.comparisonRemark,
              status: this.toolsList.status,
              headRemark: this.toolsList.headRemark,
              EnquiryItemId: this.selectedItem.EnquiryItemId,
              ItemId: this.selectedItem.ItemId,
              UnitName: this.selectedItem.UnitName,
              orderQuantity: this.getEnquiryData[i].quantity,
              quantity: this.selectedItem.Quantity,
              supplierId: this.getEnquiryData[i].supplierId,
              apqpRequire: this.toolsList.apqpRequire,
              ppapRequire: this.toolsList.ppapRequire,
              toolLoanAgreementRequire: this.toolsList.toolLoanAgreementRequire,
              toolHealthCheckupRequire: this.toolsList.toolHealthCheckupRequire
            }
            submitOrderData.push(dataObject);
          }
        }

        console.log("submitOrderData", submitOrderData);
        if (submitOrderData.length > 0) {
          let data: any = {};
          data.purchaseEnquiryCompareDetails = submitOrderData;
          data.EnquiryId = submitOrderData[0].EnquiryId;
          data.ItemId = submitOrderData[0].ItemId;
          this._apiService.submitOrderQuantity(data)
            .then((res: any) => {
              if (res.success == true) {
                window.scroll(0, 0);
                this.display1 = false;
                this._apiService.showMessage(res.message, 'success');
                let slug = this.router.snapshot.params;
                this.getSupplierByItemId(slug);
              }

              else {
                window.scroll(0, 0)
                this.display1 = false;
                this._apiService.showMessage(res.message, 'error');
              }
            })
        }

        else {
          this.display1 = false;
        }
      }

      else {
        this._apiService.showMessage('Please Enter Valid Order Quantity', 'error');
      }
    }

    else {
      for (let i = 0; i < this.getEnquiryData.length; i++) {
        let dataObject: any = {};
        dataObject = {
          purchaseEnquiryCompareId: this.getEnquiryData[i].id,
          EnquiryId: this.selectedItem.EnquiryId,
          comparisonRemark: this.toolsList.comparisonRemark,
          status: this.toolsList.status,
          headRemark: this.toolsList.headRemark,
          EnquiryItemId: this.selectedItem.EnquiryItemId,
          ItemId: this.selectedItem.ItemId,
          UnitName: this.selectedItem.UnitName,
          orderQuantity: this.getEnquiryData[i].quantity,
          quantity: this.selectedItem.Quantity,
          supplierId: this.getEnquiryData[i].supplierId,
          apqpRequire: this.toolsList.apqpRequire,
          ppapRequire: this.toolsList.ppapRequire,
          toolLoanAgreementRequire: this.toolsList.toolLoanAgreementRequire,
          toolHealthCheckupRequire: this.toolsList.toolHealthCheckupRequire
        }

        submitOrderData.push(dataObject);
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
              window.scroll(0, 0);
              this.display1 = false;
              this._apiService.showMessage(res.message, 'success');
            }
      
            else {
              window.scroll(0, 0)
              this.display1 = false; 
              this._apiService.showMessage(res.message, 'error');
            }
          })
        }

        else{
          this.display1 = false;
        }
      // if(this.submitButton == 'Add Remark'){
      //   console.log(this.getEnquiryData);
      // }

      // else if(this.submitButton == 'Submit Status'){
      //   console.log(this.getEnquiryData);
      // }
    }
  }

  popupValue: any;
  showExtraInfo(data: any) {
    console.log(data);
    this.popupValue = data;
    this.popupCheck = true
  }


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
      this._utility.loader(true);
      this.getItemEnquiryData(itemDetails);
    }

    else {
      this.display1 = false;
      console.log(this.display1);
    }
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



  getEnquiryData: any = [];
  toolsList: any = [];
  selectedItem: any = {};
  submitBoolean: boolean = false;
  enquiryClosed: boolean = false;

  getItemEnquiryData(itemDetails: any) {
    this.enquiryClosed = itemDetails.ItemWiseClose;
    this.selectedItem = itemDetails;
    let object = {
      Mode: 'enquirywiseSupplier',
      Cond3: itemDetails.EnquiryId,
      supplierId: itemDetails.ItemId
    }
    this._apiService.dropdowndata('', object).then((res: any) => {
      console.log(res);
      this._utility.loader(false);
      if (res.success == true) {
        this.getEnquiryData = res.returnValue;
        this.toolsList = this.getEnquiryData[0];
        this.display1 = true;
        this.submitBoolean = res.returnValue[0].status == 'Approved' ? true : false;
      }
    })
  }

}
