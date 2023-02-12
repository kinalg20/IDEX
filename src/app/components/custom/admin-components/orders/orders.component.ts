import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(private _utility : AppUtility , private _apiService : ApiServiceService) { }

  ngOnInit(): void {
    this.getSupplierOrders();
  }

  
  breadcrumb = [
    {
      title: 'Supplier Orders',
      subTitle: 'Dashboard'
    }
  ]

  supplierOrders : any = [];
  orderItemList : any = [];

  getSupplierOrders(){
    this._utility.loader(true);  
    this._apiService.getSupplierOrders().then((res:any)=>{
      console.log(res);   
      this._utility.loader(false);  
      if(res.success == true){
        this.supplierOrders = res.returnValue;
      }
    })
    console.log(this.supplierOrders)
  }

  getOrderById(product:any){
    console.log(product);
    this.orderItemList = [];
    let object = {
      enquiryId : this.supplierOrders[product.index].enquiryId,
      supplier : ''
    }
    this._apiService.getSupplierOrders(object).then((res:any)=>{
      this._utility.loader(true);
      console.log(res);     
      this.orderItemList = res.returnValue; 
      this._utility.loader(false);
    })
  }

}
