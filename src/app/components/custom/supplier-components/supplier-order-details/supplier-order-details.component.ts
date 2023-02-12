import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-supplier-order-details',
  templateUrl: './supplier-order-details.component.html',
  styleUrls: ['./supplier-order-details.component.scss']
})
export class SupplierOrderDetailsComponent implements OnInit {
  msgs: Message[] = [];
  constructor(private router: Router, public _apiService: ApiServiceService, private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private _utility : AppUtility) { }
  supplierOrders:any = [];
  confirmOrder : any = {orderDocument : '' , orderStatus : '' , orderRemark : ''}
  roleName : string = '';
  ngOnInit(): void {
    this.roleName = this._utility.getLocalStorageDetails().roleName;
    this.getSupplierOrders();
  }

  breadcrumb = [
      {
          title: 'Order Details',
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
  product : any;
  getOrderById(product:any){
    this.orderItemList = [];
    this._utility.loader(true);
    let supplierId = JSON.parse(localStorage.getItem('UserObject')).supplierId;    // api call
    console.log(product.index , this.supplierOrders[product.index]);
    let object = {
      enquiryId : this.supplierOrders[product.index].enquiryId,
      supplierId : supplierId,
      supplier : 'supplierbyId'
    }
    this._apiService.getSupplierOrders(object).then((res:any)=>{
      console.log(res);     
      if(res.status){
        this.orderItemList = res.returnValue; 
        this._utility.loader(false);
      }
    })
  }

  display : boolean = false;
  enquiryId : any;
  itemId : any;
  itemName : any;
  supplierId : any;
  openModel(status){
    if(status.orderStatus != 'Acknowledged'){
      this.display = true;
      this.enquiryId = status.enquiryId;
      this.itemId = status.itemId;
      this.itemName = status.itemName;
      this.supplierId = status.supplierId;
      this.confirmOrder = {orderDocument : '' , orderStatus : '' , orderRemark : ''}
    }
  }

  submitOrderStatus(){
    // if(this.confirmOrder?.orderStatus != ''){
      console.log(this.confirmOrder);
      let formData = new FormData();

      formData.append('enquiryId' , this.enquiryId)
      formData.append('itemId' , this.itemId)
      formData.append('supplierId' , this.supplierId)
      formData.append('orderStatus' , 'Acknowledged')
      formData.append('orderDocument' ,this.confirmOrder.orderDocument)
      formData.append('orderRemark' , this.confirmOrder.orderRemark)
      formData.append('itemName' , this.itemName)
      this._apiService.submitOrderConfirmation(formData).then((res:any)=>{
        console.log(res);
        if(res.status){
          this.display = false;
          this.getSupplierOrders();
        }

        else{
          this._apiService.showMessage(res.message , 'error');
        }
      })
    // }

    // else{
    //   this._apiService.showMessage('Please Update Order Status' , 'error');
    // }
  }

  getFile(event:any){
    let file = this._utility.onFileChange(event);
    if(file != false){
      this.confirmOrder.orderDocument = file;
    }
  }
}
