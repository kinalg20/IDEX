import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-cost-breaker',
  templateUrl: './cost-breaker.component.html',
  styleUrls: ['./cost-breaker.component.scss']
})
export class CostBreakerComponent implements OnInit {

  tax_dropdown: any = [];
  errorMsg: string = ''
  date: any;
  errorMsgCheck: string = ''
  costBreakerTable: any = [];
  myDate: any;
  loading: boolean = false;
  msgs: Message[] = []; 
  submitButton: string = 'Submit'
  filterval: string;
  dateFilterVal: string;
  constructor(private _apiservice: ApiServiceService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig , private _utility : AppUtility) { }

  ngOnInit(): void {
    this.getAllTableData();
    this.loading = false;
    this.primengConfig.ripple = true;
    this.loading = true;
  }

  breadcrumb = [
    {
      title: 'Cost Breakup',
      subTitle: 'Dashboard'
    }
  ]

  getAllTableData() {
      this._utility.loader(true);
      this._apiservice.getcostBreakup()
      .then((res: any) => {
        this._utility.loader(false);
        if(res.success == true){
          this.costBreakerTable = res.returnValue;
        }
        else {
        this.costBreakerTable = [];
        }
      })
      .catch((error: any) => {
        this._utility.loader(false);
        this.costBreakerTable = [];
      })
  }

  confirm1(costBreakupId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete Cost Breakup Record',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItem(costBreakupId);
        this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  deleteItem(itemId: any) {
    this._utility.loader(true);
    this._apiservice.deletecostBreakup(itemId)
    .then((res: any) => {
      this._utility.loader(false);
      console.log(res);      
      if (res.success == true) {
        this.errorMsg = res.message;
        window.scroll(0, 0)
        this.errorMsgCheck = 'success'
        this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
        this.getAllTableData();
      }

      else {
        this.errorMsg = res.message;
        window.scroll(0, 0)
        this.errorMsgCheck = 'error'
        this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
        this.getAllTableData();
      }

    })
  }



  getTable(event:any){
    if(event == 'getTableData')
    this.getAllTableData();
  }

  EditCostBreakup : any = {};
  EditItem(customer:any){
    this.EditCostBreakup = customer;
  }
  reset(dt2) {
    dt2.reset();
    this.filterval = '';
    this.dateFilterVal = ''
  }

}
