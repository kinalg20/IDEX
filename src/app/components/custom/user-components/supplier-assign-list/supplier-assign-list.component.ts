import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/api-service.service';

@Component({
  selector: 'app-supplier-assign-list',
  templateUrl: './supplier-assign-list.component.html',
  styleUrls: ['./supplier-assign-list.component.scss']
})
export class SupplierAssignListComponent implements OnInit {

  supplierAssignList: any = [];
  constructor(private _apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.getAllEnquiryDetails();
  }

  breadcrumb = [
    {
      title: 'RFQ List',
      subTitle: 'Dashboard'
    }
  ]

  getAllEnquiryDetails() {
    this._apiService.getAllEnquiryDetails().then((res: any) => {
      if(res.success == true){
        this.supplierAssignList = res.returnValue;
        console.log(this.supplierAssignList);        
      }
    })
  }

}
