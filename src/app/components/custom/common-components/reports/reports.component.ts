import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
    constructor(private route: Router, public _apiService: ApiServiceService , public _utility : AppUtility) { }
    errorMsg: string = ''
    errorMsgCheck: string = ''
    itemList : any = [];
    supplierList : any = [];
    RFQDetailreportObject : any = {};
    RFQSupplierreportObject : any = {};
    RFQOrderreportObject : any = {};
    commonListObject : any = {};
    commonDetailObject : any = {};
    commonSupplierObject : any = {};
    commonOrderObject : any = {};
    enableSupplierDropdown : boolean = false;
    ngOnInit(): void {
      this.RFQDetailreportObject = {
        itemId : ''
      }
      this.RFQSupplierreportObject = {
        itemId : '',
        supplierId : ''
      }
      this.RFQOrderreportObject = {
        itemId : '',
        supplierId : ''
      }

      this.getStatic();    
      
      let roleName = this._utility.getLocalStorageDetails();
      if(roleName.roleName == 'Supplier'){
        this.enableSupplierDropdown = true;
        this.RFQSupplierreportObject.supplierId = roleName.supplierId;
        this.RFQOrderreportObject.supplierId = roleName.supplierId;
      }
    }

    breadcrumb = [
        {
            title: 'Reports',
            subTitle: 'Dashboard'
        }
    ]


    getFormInput(event : any , name? : any){
      if(name == 'list'){
        this.commonListObject = event;  
      }

      else if(name == 'detail'){
        this.commonDetailObject = event;  
      }

      else if(name == 'supplier'){
        this.commonSupplierObject = event;  
      }

      else if(name == 'order_list'){
        this.commonOrderObject = event;
      }
    }

    getStatic(){
      this._apiService.dropdowndata('item').then((res:any)=>{
        if(res.success == true){
          this.itemList = res.returnValue;
        }
      })
      this._apiService.dropdowndata('supplier').then((res:any)=>{
        if(res.success == true){
          this.supplierList = res.returnValue;
        }
      })
    }


    getValue(value:any){
      this._utility.loader(true);
      if(value == 'list'){ 
        let object : any = {};
        Object.keys(this.commonListObject).forEach(key=>{
          if(key == 'rangeDates' && this.commonListObject[key]?.length > 0){
            object.fromDate = this._utility.dateTimeChange(this.commonListObject[key][0])
            object.toDate = this._utility.dateTimeChange(this.commonListObject[key][1])
          }
          else if(this.commonListObject[key] != ''){
             object[key] = this.commonListObject[key];
          }
        })

        console.log(object);
        this._apiService.getRFQListReport(object)
        .then((res:any)=>{
          this._utility.downloadFile(res , "rfqList");
          this._utility.loader(false);
          this.errorMsg = 'download successfully';
          this.errorMsgCheck = 'success'
          this._apiService.showMessage(this.errorMsg , this.errorMsgCheck);      
        })
      }

      else if(value == 'details'){
        let object : any = {};
        let object1 : any = {};
        Object.keys(this.commonDetailObject).forEach(key=>{
          if(key == 'rangeDates' && this.commonDetailObject[key]?.length > 0){
            object.fromDate = this._utility.dateTimeChange(this.commonDetailObject[key][0])
            object.toDate = this._utility.dateTimeChange(this.commonDetailObject[key][1])
          }
          else if(this.commonDetailObject[key] != ''){
             object[key] = this.commonDetailObject[key];
          }
        })

        if(this.RFQDetailreportObject.itemId!= ''){
          object1.itemId = this.RFQDetailreportObject.itemId;
        }
        object1 = {...object1 , ...object};
        this._apiService.getRFQDetailReport(object1)
        .then((res:any)=>{
          this._utility.loader(false);
          this._utility.downloadFile(res , "rfqDetail"); 
          this.errorMsg = 'download successfully';
          this.errorMsgCheck = 'success'
          this._apiService.showMessage(this.errorMsg , this.errorMsgCheck)     
        })
      }

      else if(value == 'supplier') {
        let object : any = {};
        let object1 : any = {};
        Object.keys(this.commonSupplierObject).forEach(key=>{
          if(key == 'rangeDates' && this.commonSupplierObject[key]?.length > 0){
            object.fromDate = this._utility.dateTimeChange(this.commonSupplierObject[key][0])
            object.toDate = this._utility.dateTimeChange(this.commonSupplierObject[key][1])
          }
          else if(this.commonSupplierObject[key] != ''){
             object[key] = this.commonSupplierObject[key];
          }
        })
        Object.keys(this.RFQSupplierreportObject).forEach(key=>{
          if(this.RFQSupplierreportObject[key])
            object1[key] = this.RFQSupplierreportObject[key];
        })
        object1 = {...object1 , ...object};   
        this._apiService.getRFQSupplierReport(object1)
        .then((res:any)=>{
          this._utility.downloadFile(res , "rfqSupplier"); 
          this._utility.loader(false);
          this.errorMsg = 'download successfully';
          this.errorMsgCheck = 'success'
          this._apiService.showMessage(this.errorMsg , this.errorMsgCheck)     
        })   
      }

      else if(value == 'order_list') {
        let object : any = {};
        let object1 : any = {};
        Object.keys(this.commonOrderObject).forEach(key=>{
          if(key == 'rangeDates' && this.commonOrderObject[key]?.length > 0){
            object.fromDate = this._utility.dateTimeChange(this.commonOrderObject[key][0])
            object.toDate = this._utility.dateTimeChange(this.commonOrderObject[key][1])
          }
          else if(this.commonOrderObject[key] != ''){
             object[key] = this.commonOrderObject[key];
          }
        })
        Object.keys(this.RFQOrderreportObject).forEach(key=>{
          if(this.RFQOrderreportObject[key])
            object1[key] = this.RFQOrderreportObject[key];
        })
        object1 = {...object1 , ...object};  
        this._apiService.getRFQOrderReport(object1)
        .then((res:any)=>{
          this._utility.downloadFile(res , "rfqOrderDetails"); 
          this._utility.loader(false);
          this.errorMsg = 'download successfully';
          this.errorMsgCheck = 'success'
          this._apiService.showMessage(this.errorMsg , this.errorMsgCheck)     
        })  
      }
      
      else if('supplier_list'){
        console.log(this.RFQSupplierreportObject);
        let object = {
          supplierId : this.RFQSupplierreportObject.supplierId
        }
        this._apiService.getRFQOrderReport(object)
        .then((res:any)=>{
          this._utility.downloadFile(res , "rfqOrderDetails"); 
          this._utility.loader(false);
          this.errorMsg = 'download successfully';
          this.errorMsgCheck = 'success'
          this._apiService.showMessage(this.errorMsg , this.errorMsgCheck)     
        })  

      }
    }
    
}
