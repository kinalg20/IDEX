import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-apqp-document',
  templateUrl: './apqp-document.component.html',
  styleUrls: ['./apqp-document.component.scss']
})
export class ApqpDocumentComponent implements OnInit {

  msgs: Message[] = [];
  constructor(private route: Router, public _apiService: ApiServiceService, private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private _utility : AppUtility) { }
  errorMsg: string = ''
  errorMsgCheck: string = ''
  suppliers: any;
  header : string = 'Document Status'
  loading: boolean = true;
  document_dropdown: any = [];
  supplier_dropdown: any = [];
  supplierId : any;
  display : boolean = false;

  ngOnInit(): void {
      this.getStatic();
      this.getAllTableData();
      this.loading = false;
      this.primengConfig.ripple = true;
      this.supplierId = this._utility.getLocalStorageDetails();
      this.supplierId = this.supplierId.supplierId
  }

  breadcrumb = [
      {
          title: 'APQP Documents',
          subTitle: 'Dashboard'
      }
  ]

  getStatic() {
      this._apiService.dropdowndata('document')
      .then((res: any) => {
          this.document_dropdown = res.returnValue;
      })
  }

  clear(table: any) {
      table.clear();
  }

  filePath: any = {};
  getDocument(value: any) {
    this.filePath = this._utility.onFileChange(value);
  }

  getAllTableData() {
    this._utility.loader(true);
      this._apiService.getApqpData().then((res:any)=>{
        this._utility.loader(false);
          console.log(res);
          if(res.success == true){
            this.suppliers = res.returnValue;
          }
          else {
            this.suppliers = [];
            this.errorMsg = res.message;
            this.errorMsgCheck = 'error'
            this._apiService.showMessage(this.errorMsg , this.errorMsgCheck);
          }
        })
  }


  default_status : any;
  documentData : any;
  openModel(document:any){
    this.default_status = document.isApproved ? 1 : 3
    this.documentData = document;
    console.log(this.default_status);      
    this.display = true;
  }

  updateStatus(document:any , isApproved:any){
    console.log(document , isApproved);
    this._utility.loader(true);
    this.documentData = document;     
    this.display = true;
    // let userRole = this._utility.getLocalStorageDetails(); 
    let object = new FormData();
    object.append("apqpId",this.documentData.apqpId),
    object.append("isApproved" , JSON.stringify(isApproved))
    // object.append("roleName" , userRole.roleName)
    console.log(this.default_status , object , this.documentData);      
    this._apiService.putAPQPDocument(object).then((res:any)=>{
      this._utility.loader(false);
      console.log(res);      
      if(res.success == true){
        this.display = false;
        this.errorMsg = res.message
        this.errorMsgCheck = "success"
        this._apiService.showMessage(this.errorMsg , this.errorMsgCheck)
        this.getAllTableData();
      }  

      else {
        this.display = false;
        this.errorMsg = res.message
        this.errorMsgCheck = "error"
        this._apiService.showMessage(this.errorMsg , this.errorMsgCheck)
      }
    })
    
    .catch((error:any)=>{
      this.display = false;
    })
  }


}
