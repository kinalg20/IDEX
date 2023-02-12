import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-document-master',
  templateUrl: './document-master.component.html',
  styleUrls: ['./document-master.component.scss']
})
export class DocumentMasterComponent implements OnInit {
  date: any;
  submitButton: string = 'Submit'
  documentTable: any = [];
  myDate: any;
  loading: boolean = false;
  msgs: Message[] = [];

  constructor(private _apiService: ApiServiceService, private _utility: AppUtility , private confirmService : ConfirmationService) { }

  ngOnInit(): void {
    this.getAllTableData();
  }

  breadcrumb = [
    {
      title: 'Document List',
      subTitle: 'Dashboard'
    }
  ]

  documentForm = new FormGroup({
    documentName: new FormControl('', [Validators.required])
  })

  documentFormSubmit(document: FormGroupDirective) {
    console.log(this.documentForm.value);
    if (this.documentForm.valid) {
      this._utility.loader(true);
      let object = this.documentForm.value;
      if (this.submitButton == 'Submit') {
        this._apiService.addDocument(object).then((res: any) => {
          this._utility.loader(false);
          if (res.success == true) {
            this._apiService.showMessage(res.message, 'success')
            window.scroll(0, 0)
            this.documentForm.reset();
            // debugger;          
            Object.keys(this.documentForm.controls).forEach(key => {
              this.documentForm.controls[key].setErrors(null)
            });
            document.resetForm();
          }
          else {
            this._apiService.showMessage(res.message, 'success');
          }

        })
      }
      else {
        object['documentId'] = this.editItemId;
        console.log(object);
        this._apiService.editDocument(object).then((res: any) => {
          this._utility.loader(false);
          if (res.success == true) {
            this._apiService.showMessage(res.message, 'success');
            this.documentForm.reset();
            Object.keys(this.documentForm.controls).forEach(key => {
              this.documentForm.controls[key].setErrors(null)
            });
            document.resetForm();
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
    if (customer.documentId) {
      Object.keys(this.documentForm.controls).forEach(key => {
        this.documentForm.controls[key].setValue(customer[key]);
      });
      this.submitButton = 'Update'
      this.editItemId = customer.documentId;
    }
  }

  getAllTableData() {
    this._utility.loader(true);
    this._apiService.getDocument()
      .then((res: any) => {
        this._utility.loader(false);
        if (res.success == true) {
          this.documentTable = res.returnValue;
        }
        else {
          this.documentTable = [];
        }
      })
      .catch((error: any) => {
        this._utility.loader(false);
        this.documentTable = [];
      })
  }

  confirm1(costBreakupId: any) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete document Record',
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
    this._apiService.deleteDocument(itemId)
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
