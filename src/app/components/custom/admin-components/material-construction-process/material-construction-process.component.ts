import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';


@Component({
  selector: 'app-material-construction-process',
  templateUrl: './material-construction-process.component.html',
  styleUrls: ['./material-construction-process.component.scss']
})
export class MaterialConstructionProcessComponent implements OnInit {
  date: any;
  submitButton: string = 'Submit'
  materialConstructionTable: any = [];
  myDate: any;
  loading: boolean = false;
  msgs: Message[] = [];

  constructor(private _apiService: ApiServiceService, private _utility: AppUtility , private confirmService : ConfirmationService) { }

  ngOnInit(): void {
    this.getAllTableData();
  }

  breadcrumb = [
    {
      title: 'Material Construction List',
      subTitle: 'Dashboard'
    }
  ]

  materialConstructionForm = new FormGroup({
    materialconstructionName: new FormControl('', [Validators.required])
  })

  materialConstructionFormSubmit(manufacture: FormGroupDirective) {
    console.log(this.materialConstructionForm.value);
    if (this.materialConstructionForm.valid) {
      this._utility.loader(true);
      let object = this.materialConstructionForm.value;
      if (this.submitButton == 'Submit') {
        this._apiService.addmaterialConstruction(object).then((res: any) => {
          this._utility.loader(false);
          if (res.success == true) {
            this._apiService.showMessage(res.message, 'success')
            window.scroll(0, 0)
            this.materialConstructionForm.reset();
            Object.keys(this.materialConstructionForm.controls).forEach(key => {
              this.materialConstructionForm.controls[key].setErrors(null)
            });
            manufacture.resetForm();
          }
          else {
            this._apiService.showMessage(res.message, 'success');
          }

        })
      }
      else {
        object['materialconstructionId'] = this.editItemId;
        console.log(object);
        this._apiService.editmaterialConstruction(object).then((res: any) => {
          this._utility.loader(false);
          if (res.success == true) {
            this._apiService.showMessage(res.message, 'success');
            this.materialConstructionForm.reset();
            Object.keys(this.materialConstructionForm.controls).forEach(key => {
              this.materialConstructionForm.controls[key].setErrors(null)
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
    if (customer.materialconstructionId) {
      Object.keys(this.materialConstructionForm.controls).forEach(key => {
        this.materialConstructionForm.controls[key].setValue(customer[key]);
      });
      this.submitButton = 'Update'
      this.editItemId = customer.materialconstructionId;
    }
  }

  getAllTableData() {
    this._utility.loader(true);
    this._apiService.getmaterialConstruction()
      .then((res: any) => {
        this._utility.loader(false);
        if (res.success == true) {
          this.materialConstructionTable = res.returnValue;
        }
        else {
          this.materialConstructionTable = [];
        }
      })
      .catch((error: any) => {
        this._utility.loader(false);
        this.materialConstructionTable = [];
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
    this._apiService.deletematerialConstruction(itemId)
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
