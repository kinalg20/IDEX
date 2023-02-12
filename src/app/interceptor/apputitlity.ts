import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { ApiServiceService } from '../api-service.service';
import * as FileSaver from 'file-saver';
import { ConfirmationService, Message } from 'primeng/api';
import { TitleCasePipe } from '@angular/common';
@Injectable({
  providedIn: 'root',
})

export class AppUtility {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | undefined => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);
      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value ? { mismatch: true } : null;
    };
  }

  msgs: Message[] = [];
  constructor(private _apiService: ApiServiceService , private confirmationService : ConfirmationService, private titlecasePipe: TitleCasePipe) {
  }
  dateTimeChange(date: any) {
    return moment(date).format('YYYY-MM-DDT18:30:00')
  }

  titleCase(string:any){
    return this.titlecasePipe.transform(string);
  }


  dateChange(date: any) {
    return moment(date).format('YYYY')
  }

  calendarDateFormat(date: any) {
    return moment(date).format('MM/DD/YYYY')
  }

  getLocalStorageDetails() {
    let local_id = localStorage.getItem('UserObject');
    if (local_id) {
      // return JSON.parse(local_id).supplierId;
      return JSON.parse(local_id);
    }
  }

  //validate user mobile number
  inputMobile(event: any) {
    if (event.keyCode != 9) {
      if (event.keyCode != 8 && event.keyCode != 189 && event.keyCode != 107 && event.keyCode != 16 && event.keyCode != 187) {
        if (!/^[0-9]$/.test(event.key)) {
          event.preventDefault();
        }
      }
    }
  }

  validateMobile(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 10
    ) {
      // this.invalidMobile = true;
      return true
    }

    else {
      // this.invalidMobile = false;
      return false
    }
  }

  onFileChange(event: any , string ? :any) {
    if (event?.target?.files && event?.target?.files[0]) {
      if (event.target.files[0].size < 2000000) {
        // debugger;
        if(string == 'certificate'){
          if (event.target.files[0].type == 'application/pdf') {
            var filesAmount = event.target.files.length;
            if (filesAmount > 1) {
              return event.target.files;
            }
  
            else {
              return event.target.files[0];
            }
            
          }

          else {
            this._apiService.showMessage('Please Upload Pdf Document', 'error')
            return false;
          }
        }

        else{
          if (event.target.files[0].type == 'image/jpeg' || 'image/jpg' || 'image/png' || 'application/pdf') {
            var filesAmount = event.target.files.length;
            if (filesAmount > 1) {
              return event.target.files;
            }
  
            else {
              return event.target.files[0];
            }
          }
        }
      }

      else {
        this._apiService.showMessage('Max file upload size should be 2MB ', 'error')
        return false;
      }
    }
  }


  _valueLoader: boolean = false;
  loader(value: boolean) {
    this._valueLoader = value;
  }

  getloaderValue() {
    return this._valueLoader;
  }


  downloadFile(data: any, name?: any) {
    var blob = new Blob([data], { type: '.xlsx' });
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = name + ".xlsx";
    anchor.href = url;
    anchor.click();
  }

  async getDropdownData() {
    let returnData: any = [];
    let otherCategoryData: any;
    await this._apiService.dropdowndata('state').then((res: any) => {
      returnData.push({ stateDropdown: res.returnValue });
    })

    await this._apiService.dropdowndata('paymentTerms').then((res: any) => {
      returnData.push({ paymentDropdown: res.returnValue });
    })

    await this._apiService.dropdowndata('purpose').then((res: any) => {
      returnData.push({ purposeDropdown: res.returnValue });
    })

    await this._apiService.dropdowndata('manufacturing').then((res: any) => {
      returnData.push({ manufacturingData: res.returnValue });
    })

    await this._apiService.dropdowndata('materialconstruction').then((res: any) => {
      returnData.push({ materialofconstructionData: res.returnValue });
    })

    await this._apiService.dropdowndata('othercategory').then((res: any) => {
      otherCategoryData = res.returnValue;
      returnData.push({ otherCategoryData: otherCategoryData });
    })

    return returnData;
  }

  getImageUrl(url: any) {
    return `http://103.155.84.143:9072/SupplierOnboarding/` + url;
  }

  exportExcel(productList : any) {
    console.log(productList);
    let variable : any = [];
    variable.push(productList);
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(variable);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer : any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  public b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete Document?',
      header: 'Delete Document',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // return true;
        this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
      },
      reject: () => {
        // return false;
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }
}


//, paymentDropdown , purposeDropdown , manufacturingData , materialofconstructionData , otherCategoryData