import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { SelectItem, PrimeNGConfig } from "primeng/api";
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-supplier-assign',
  templateUrl: './supplier-assign.component.html',
  styleUrls: ['./supplier-assign.component.scss']
})
export class SupplierAssignComponent implements OnInit {

  supplier_Dropdown : any = [];
  selectSupplier : any = [];
  errorMsg : string = '';
  errorMsgCheck : string = '';
  data : any;
  supplierList : any = [];
  constructor(private activate: ActivatedRoute , private fb:FormBuilder , private primengConfig: PrimeNGConfig, private _apiService : ApiServiceService , private _utility : AppUtility , private route : Router) { }

  ngOnInit(): void { 
    this.primengConfig.ripple = true;
    this.data = this.activate.snapshot.params;
    this.getItemEnquiryData(this.data);
  }
  breadcrumb = [
    {
      title: 'Supplier Assign',
      subTitle: 'Dashboard'
    }
  ]

  itemEnquiryForm = this.fb.group({
    itemEnquiryArray: this.fb.array([], [Validators.required]),
    enquiryDate: new FormControl({value : '',disabled: true}, [Validators.required]),
    enquiryValidityDate: new FormControl({value : '',disabled: true}, [Validators.required]),
    supplierDetailArray: this.fb.array([], [Validators.required]),
    enquiryNo: new FormControl({value : '', disabled: true}),
    projectName: new FormControl({value : '', disabled: true}),
    enquiryId : new FormControl('')
  });

  itemEnquiryArray = this.fb.group({
    enquiryDesc: (''),
    hsnName: ['', Validators.required],
    unitName: ['', Validators.required],
    taxName: ['', Validators.required],
    itemName: ['', Validators.required],
    taxId: ['', Validators.required],
    quantity: ['', Validators.required],
    statusName: ['', Validators.required],
    isChecked : new FormControl(false)
  });

  supplierDetailArray = this.fb.group({
    emailId : ['', Validators.required],
    supplierName : ['', Validators.required],
    supplierId : ['', Validators.required]
  })



  assignCostBreakupDetails : any = [];
  itemManufacturingList : any = [];
  enquiryId : any;
  getItemEnquiryData(id:any){
    this._utility.loader(true);
    let itemEnquiryArray = this.itemEnquiryForm.get('itemEnquiryArray') as FormArray;
    this._apiService.getenquiryDetailsById(id.id).then((res:any)=>{
      console.log(res , res.returnValue.enquiryNo);     
      this.enquiryId = res.returnValue.enquiryId
      this.supplierList = res.returnValue.assignEnquirySupplierDetails;
      this.assignCostBreakupDetails = res.returnValue.enquiryCostBreakupDetails;
      for (let index = 0; index < res.returnValue.enquiryItemDetails.length; index++) {
        itemEnquiryArray.push(this.fb.group({
          itemName: res.returnValue.enquiryItemDetails[index].itemName,
          itemId: res.returnValue.enquiryItemDetails[index].itemId,
          enquiryDesc: res.returnValue.enquiryItemDetails[index].enquiryDesc,
          unitName: res.returnValue.enquiryItemDetails[index].unitName,
          quantity: res.returnValue.enquiryItemDetails[index].quantity,
          rawPartWeight: res.returnValue.enquiryItemDetails[index].rawPartWeight,
          finishPartWeight: res.returnValue.enquiryItemDetails[index].finishPartWeight,
          otherCategoryId: res.returnValue.enquiryItemDetails[index].otherCategoryId,
          statusName: res.returnValue.enquiryItemDetails[index].statusName,
          volume: res.returnValue.enquiryItemDetails[index].volume,
          apqpRequire : res.returnValue.enquiryItemDetails[index].apqpRequire,
          ppapRequire : res.returnValue.enquiryItemDetails[index].ppapRequire,
          toolLoanAgreement : res.returnValue.enquiryItemDetails[index].toolLoanAgreement,
          toolHealthCheckup : res.returnValue.enquiryItemDetails[index].toolHealthCheckup,
          materialOfConstruction: res.returnValue.enquiryItemDetails[index].materialofconstructionList,
          manufacturingProcessList: res.returnValue?.enquiryItemDetails[index].manufacturingProcessidList,
        }));    
      } 


      this.itemManufacturingList = res.returnValue?.manufacturingProcessList;

      this.itemEnquiryForm.controls["enquiryId"].setValue(res.returnValue.enquiryId);
      this.itemEnquiryForm.controls["enquiryNo"].setValue(res.returnValue.enquiryNo);
      this.itemEnquiryForm.controls['projectName'].setValue(res.returnValue.projectName);

      let date : any;
      date = moment(res.returnValue.enquiryDate).format('MM/DD/YYYY');
      this.itemEnquiryForm.controls["enquiryDate"].setValue(date);
      
      console.log(itemEnquiryArray , this.itemEnquiryForm.controls);
      this.getStatic();
    })
  }

  getItemEnquiryDataArray(){
    return this.itemEnquiryForm.get('itemEnquiryArray') as FormArray
  }

  getSupplierDataArray(){
    return this.itemEnquiryForm.get('supplierDetailArray') as FormArray
  }

  otherCategoryData : any = [];
  getStatic(){
    let itemList : string = '';
    let supplierDetailArray = this.getSupplierDataArray();

    this.getItemEnquiryDataArray().value?.forEach((res: any, index: any) => {
      itemList = itemList + res.itemId + (index != this.getItemEnquiryDataArray().value.length - 1 ? ',' : '')
    })

    

    let object = {
      enquiryId : this.enquiryId,
      itemIds : itemList,
      mode : 'filterSupplier'
    }

    this._apiService.dropdowndata("filterSupplier",object).then((res:any)=>{
      for (let index = 0; index < res.returnValue.length; index++) {
          supplierDetailArray.push(this.fb.group({
          emailId : res.returnValue[index].emailAddress,
          supplierName : res.returnValue[index].value,  
          supplierId : res.returnValue[index].id,
          isChecked : false
        }));    
      }     
    })
    
    this._apiService.dropdowndata('otherCategory').then((res:any)=>{
      this.otherCategoryData = res.returnValue;
    })

    this._utility.loader(false);

  }

  submitEnquiryForm(){
    this._utility.loader(true);
    let object : any = [];
    let object1 : any = {};
    console.log(this.selectSupplier);    
    if(this.selectSupplier.length > 0){
      let supplierDetailArray = this.itemEnquiryForm.get('enquiryId').value;    
      this.selectSupplier.map((res:any)=>{
        object.push({supplierId : res.supplierId , emailAddress : res.emailId , enquiryId : supplierDetailArray})
      })

      object1.assignSupplierDetails = object;     

      this._apiService.assignSupplier(object1).then((res:any)=>{
        this._utility.loader(false);
        if(res.success == true){
          this.errorMsg = res.message
          this.errorMsgCheck = "success"
          window.scroll(0, 0);
          this._apiService.showMessage(this.errorMsg, this.errorMsgCheck);
          this.route.navigateByUrl('/supplierAssignList')
        }

        else {
          this.errorMsg = res.message;
          this.errorMsgCheck = 'error'
          this._apiService.showMessage(this.errorMsg, this.errorMsgCheck);
        }
      })     
    }

    else {
      this._utility.loader(false);
      this.errorMsg = 'Please Select Suppliers Name',
      this.errorMsgCheck = 'error'
      this._apiService.showMessage(this.errorMsg , this.errorMsgCheck)
    }
  }

  editQuotation(){
    this.route.navigateByUrl('/requestForQuotation/'+ this.data.id)
  }

  editUploadedDrawing: any;
  displayDialog : boolean = false;
  itemName : string = '';
  async getAllItemDrawing(itemId) {
    console.log(itemId);
    await this._apiService.getEnggDrawing(itemId).then((res: any) => {
      if (res.success) {
        this.editUploadedDrawing = res.returnValue;
      }
      else{
        this.editUploadedDrawing = [];
      }
    })
    
    if(this.editUploadedDrawing?.length > 0){
      this.displayDialog = true;
    }
    else{
      this.editUploadedDrawing = [];
    }
    console.log(this.editUploadedDrawing);
  }

  otherDocumentList : any = [];
  displayOtherDialog : boolean = false;
  getOtherDocument(customer:any){
    console.log(customer);
    let object = {
      Mode : 'DrawingDetails',
      Cond3 :  this.enquiryId,
      itemId : customer.itemId
    }
    this._apiService.dropdowndata('' , object).then((res:any)=>{
      console.log(res);
      if(res.success){
        this.displayOtherDialog = true;
        this.otherDocumentList = res.returnValue;
      }

      else{
        this.otherDocumentList = [];
      }
    })
  }

}
