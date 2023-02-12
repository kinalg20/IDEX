import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
@Component({
  selector: 'app-common-fields',
  templateUrl: './common-fields.component.html',
  styleUrls: ['./common-fields.component.scss']
})
export class CommonFieldsComponent implements OnInit {
  @ViewChild('calendar') private calendar: any;
  statusDropdown : any = [];
  submitButton: boolean = false;
  rangeDates: Date[];
  @Output() getFormValue = new EventEmitter<any>;

  rfqList : any = {
    enquiryNo : '',
    statusId : '',
    rangeDates : []
  }

  constructor(public _apiService : ApiServiceService , private _utility : AppUtility) { }

  ngOnInit(): void {
    this.getStatic();
  }


  getStatic(){
    this._apiService.dropdowndata('status').then((res:any)=>{
      if(res.success == true){
        this.statusDropdown = res.returnValue;
      }
    })
  }

  dateFrom : any;
  dateTo : any;
  selectedDate(){
    this.dateFrom = moment(this.rangeDates[0]).format('YYYY-MM-DD');
    this.dateTo = moment(this.rangeDates[1]).format('YYYY-MM-DD');
    console.log(this.dateTo, this.dateFrom, this.rangeDates);
    if (this.dateTo != "Invalid date") {
      this.calendar.overlayVisible = false;
      this.rfqList["rangeDates"] = this.rangeDates;
      this.getFormValue.emit(this.rfqList);       
    }   
  }

  getFormValues(){  
    this.getFormValue.emit(this.rfqList);       
  }

}
