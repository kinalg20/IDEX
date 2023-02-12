import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-manufacturing-process-list',
  templateUrl: './manufacturing-process-list.component.html',
  styleUrls: ['./manufacturing-process-list.component.scss']
})
export class ManufacturingProcessListComponent implements OnInit {
  date: any;
  submitButton: string = 'Submit'
  manufactureTable: any = [];
  myDate: any;
  loading: boolean = false;
  msgs: Message[] = [];

  constructor(private _apiService: ApiServiceService, private _utility: AppUtility , private confirmService : ConfirmationService) { }

  ngOnInit(): void {
    this.getAllTableData();
  }

  breadcrumb = [
    {
      title: 'Manufacturing List',
      subTitle: 'Dashboard'
    }
  ]

  manufactureProcessForm = new FormGroup({
    manufacturingName: new FormControl('', [Validators.required])
  })

  manufactureProcessFormSubmit(manufacture: FormGroupDirective) {
    console.log(this.manufactureProcessForm.value);
    if (this.manufactureProcessForm.valid) {
      this._utility.loader(true);
      let object = this.manufactureProcessForm.value;
      if (this.submitButton == 'Submit') {
        this._apiService.addmanufacture(object).then((res: any) => {
          this._utility.loader(false);
          if (res.success == true) {
            this._apiService.showMessage(res.message, 'success')
            window.scroll(0, 0)
            this.manufactureProcessForm.reset();
            // debugger;          
            Object.keys(this.manufactureProcessForm.controls).forEach(key => {
              this.manufactureProcessForm.controls[key].setErrors(null)
            });
            manufacture.resetForm();
          }
          else {
            this._apiService.showMessage(res.message, 'success');
          }

        })
      }
      else {
        object['manufacturingId'] = this.editItemId;
        console.log(object);
        this._apiService.editmanufacture(object).then((res: any) => {
          this._utility.loader(false);
          if (res.success == true) {
            this._apiService.showMessage(res.message, 'success');
            this.manufactureProcessForm.reset();
            Object.keys(this.manufactureProcessForm.controls).forEach(key => {
              this.manufactureProcessForm.controls[key].setErrors(null)
            });
            manufacture.resetForm();
            this.submitButton = 'Submit'
            this.getAllTableData();
          }

          else {
            this._apiService.showMessage(res.message, 'error');
          }
        })
      }
    }
  }

  editItemId: any;
  EditItem(customer: any) {
    if (customer.manufacturingId) {
      Object.keys(this.manufactureProcessForm.controls).forEach(key => {
        this.manufactureProcessForm.controls[key].setValue(customer[key]);
      });
      this.submitButton = 'Update'
      this.editItemId = customer.manufacturingId;
    }
  }

  getAllTableData() {
    this._utility.loader(true);
    this._apiService.getmanufacture()
      .then((res: any) => {
        this._utility.loader(false);
        if (res.success == true) {
          this.manufactureTable = res.returnValue;
        }
        else {
          this.manufactureTable = [];
        }
      })
      .catch((error: any) => {
        this._utility.loader(false);
        this.manufactureTable = [];
      })
  }

  confirm1(costBreakupId: any) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete Manufacture Record',
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
    this._apiService.deletemanufacture(itemId)
    .then((res: any) => {
      this._utility.loader(false);
      console.log(res);      
      if (res.success == true) {
        this._apiService.showMessage(res.message, 'success');
        this.getAllTableData();
      }

      else {
        window.scroll(0, 0);
        this._apiService.showMessage(res.message, 'error');
        this.getAllTableData();
      }

    })
  }
}
