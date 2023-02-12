import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlDirective, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { invalid } from 'moment';
import { ConfirmationService } from 'primeng/api';
import { Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-loan-tool-agreement',
  templateUrl: './loan-tool-agreement.component.html',
  styleUrls: ['./loan-tool-agreement.component.scss']
})
export class LoanToolAgreementComponent implements OnInit {
  @ViewChild('fileBrowse') fileBrowse : ElementRef;
  msgs: Message[] = [];
  showToolHealth : boolean = false;
  constructor(private route: Router, public _apiService: ApiServiceService, private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , public _utility : AppUtility , private fb : FormBuilder) { }
  supplierOrders : any = [];

  ngOnInit(): void {
      this.primengConfig.ripple = true;
      this.showToolHealth = this.route.url == '/toolhealthCheck' ? true : false;
      this.getSupplierOrders();
      
  }

  breadcrumb = [
      {
          title: 'Tool Loan Agreement Documents',
          subTitle: 'Dashboard'
      }
  ]

  getSupplierOrders(){
    this._utility.loader(true);  
    let supplierId = JSON.parse(localStorage.getItem('UserObject')).supplierId;    // api call

    let object = {
      supplierId : supplierId,
      supplier : 'supplier'
    }
    this._apiService.getSupplierOrders(object).then((res:any)=>{
      console.log(res);   
      this._utility.loader(false);  
      if(res.success == true){
        this.supplierOrders = res.returnValue;
      }
    })
  }


  orderItemList : any = [];
  onTabOpen(product:any){
    let supplierId = JSON.parse(localStorage.getItem('UserObject')).supplierId;    // api call
    console.log(product);
    let object = {
      enquiryId : this.supplierOrders[product.index].enquiryId,
      supplierId : supplierId,
      supplier : 'supplierbyId'
    }
    this._apiService.getSupplierOrders(object).then((res:any)=>{
      console.log(res);     
      this.orderItemList = res.returnValue; 
    })

    this.orderItemList.forEach(res=>{
        res.file = ''
    })
  }

  getDocument(event:any , order:any , rowIndex : any){
      let file = this._utility.onFileChange(event);
      console.log(file , order ,rowIndex , this.orderItemList[rowIndex]);
      if(file){
        let supplierId = JSON.parse(localStorage.getItem('UserObject')).supplierId;    // api call
        this._utility.loader(true);
        let formData = new FormData();
        formData.append('enquiryId' , order.enquiryId)       
        formData.append('itemId' , order.itemId)       
        formData.append('supplierId' , supplierId)       
        formData.append('filePath' , file)  
        formData.append('documentId' , "1")  
        if(!this.showToolHealth){
            if(order.toolLoanPath){
                // formData.append('')
                this._apiService.putToolLoanAgreementDocument(formData).then((res:any)=>{
                    if(res.status){
                        console.log(res);
                        this._utility.loader(false);
                        this._apiService.showMessage(res.message , 'success');
                        this.orderItemList[rowIndex].file = null;
                        this.getSupplierOrders();
                    }
                    else{
                        this._apiService.showMessage(res.message , 'error')
                        this._utility.loader(false);
                        this.orderItemList[rowIndex].file = null;
                        this.getSupplierOrders();
                    }
                })
            }
    
            else{
                this._apiService.postToolLoanAgreementDocument(formData).then((res:any)=>{
                    if(res.status){
                        console.log(res);
                        this._utility.loader(false);
                        this._apiService.showMessage(res.message , 'success');
                        this.orderItemList[rowIndex].file = null;
                        this.getSupplierOrders();
                    }
                    else{
                        this._apiService.showMessage(res.message , 'error')
                        this._utility.loader(false);
                        this.orderItemList[rowIndex].file = null;
                        this.getSupplierOrders();
                    }
                })
            }
        }

        else{
             if(order.toolhealthCheck){
                // formData.append('')
                this._apiService.putToolHealthCheckDocument(formData).then((res:any)=>{
                    if(res.status){
                        console.log(res);
                        this._utility.loader(false);
                        this._apiService.showMessage(res.message , 'success');
                        this.orderItemList[rowIndex].file = null;
                        this.getSupplierOrders();
                    }
                    else{
                        this._apiService.showMessage(res.message , 'error')
                        this._utility.loader(false);
                        this.orderItemList[rowIndex].file = null;
                        this.getSupplierOrders();
                    }
                })
            }
    
            else{
                this._apiService.postToolHealthCheckDocument(formData).then((res:any)=>{
                    if(res.status){
                        console.log(res);
                        this._utility.loader(false);
                        this._apiService.showMessage(res.message , 'success');
                        this.orderItemList[rowIndex].file = null;
                        this.getSupplierOrders();
                    }
                    else{
                        this._apiService.showMessage(res.message , 'error')
                        this._utility.loader(false);
                        this.orderItemList[rowIndex].file = null;
                        this.getSupplierOrders();
                    }
                })
            }
        }
    }
  }

}
