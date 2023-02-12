import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ConfirmationService, Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import * as moment from 'moment';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.scss']
})
export class ItemMasterComponent implements OnInit {

  tax_dropdown: any = [{ value: 'jde entry', id: '1' }, { value: 'vms entry', id: '2' }];
  errorMsg: string = ''
  date: any;
  errorMsgCheck: string = ''
  itemMasterTable: any = [];
  myDate: any;
  loading: boolean = false;
  value: Date;
  msgs: Message[] = [];
  submitButton: string = 'Submit'
  filterval: string;
  dateFilterVal: string;
  constructor(private _apiservice: ApiServiceService, private fb: FormBuilder, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig, public _utility: AppUtility , private sanitizer : DomSanitizer) { }
  @ViewChild('enggDrawing') enggDrawing : ElementRef
  ngOnInit(): void {
    this.getState();
    this.getAllTableData();
    this.primengConfig.ripple = true;
    this.date = new Date();
    this.myDate = moment(this.date).format('MM/DD/YYYY');
    this.itemMaster.controls['itemDate'].setValue(this.myDate);
  }

  breadcrumb = [
    {
      title: 'Part Master',
      subTitle: 'Dashboard'
    }
  ]

  itemMaster = this.fb.group({
    // itemName: new FormControl('', [Validators.required]),
    itemDate: new FormControl({value : '' , disabled : true}, [Validators.required]),
    itemDesc: new FormControl('', [Validators.required]),
    itemCode: new FormControl('', [Validators.required]),
    unitName: new FormControl('', [Validators.required]),
    materialOfConstruction: this.fb.array([], Validators.required),
    materialRemark : new FormControl(''),
    rawPartWeight: new FormControl(''),
    finishPartWeight: new FormControl(''),
    remark: new FormControl(''),
    entryType: new FormControl('')
  })



  async itemMasterSubmit(itemMaster: FormGroupDirective) {
    this.mocBoolean = false;
    this.getMaterialofConstruction().value.forEach((res: any) => {
      if (res.isChecked == true) {
        this.mocBoolean = true;
      }
    })

    if (this.itemMaster.valid && this.mocBoolean) {
      let object = this.itemMaster.value;
      if (this.submitButton == 'Submit') {
        this._utility.loader(true);
        object.itemDate = moment(object.itemDate).format("YYYY-MM-DDThh:mm:ss");

        let formData = new FormData();
        let json: any = {};
        let materialConstrution: any = [];


        this.getMaterialofConstruction().value.forEach((res: any) => {
          console.log(res.id);
          if (res.isChecked == true) {
            materialConstrution.push({ MaterialconstructionId: res.id })
          }
        })


        json = {
          itemMaterialconstructionDetails: materialConstrution,
          itemName: object['itemCode'],
          itemDate: this.myDate,
          itemCode: object['itemCode'],
          itemDesc: object['itemDesc'],
          unitName: object['unitName'],
          rawPartWeight: object['rawPartWeight'],
          finishPartWeight: object['finishPartWeight'],
          remark: object['remark'],
          entryType: object['entryType'],
          materialRemark : object['materialRemark'],
          volumnAnnum: object['volumnAnnum']
        }

        formData.append('json', JSON.stringify(json));
        if (this.file) {
          if(Object.keys(this.file).length > 0 ){
            console.log(this.file);
            this.file?.forEach((res:any)=>{
              console.log(res);
              formData.append('dUploadPath', res)
            })
          }
          else{
            formData.append('dUploadPath', this.file);
          }
        }

        this._apiservice.addItemMaster(formData).then((res: any) => {
          this._utility.loader(false);
          if (res.success == true) {
            this.errorMsg = res.message;
            window.scroll(0, 0)
            this.errorMsgCheck = 'success'
            this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
            this.getAllTableData();
            this.itemMaster.reset();
            Object.keys(this.itemMaster.controls).forEach(key => {
              this.itemMaster.controls[key].setErrors(null)
            });
            itemMaster.resetForm();
            this.getState();
            this.enggDrawing.nativeElement.value = null;
            this.itemMaster.controls['itemDate'].setValue(this.myDate);
            this.itemMaster.controls['entryType'].setValue('');
          }
          else {
            this.errorMsg = res.message;
            this.errorMsgCheck = 'error'
            this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
            this.getAllTableData();
          }
          this.editUploadedDrawing = [];

        })
      }
      else {
        object['itemId'] = this.editItemId;
        this._utility.loader(true);
        object.itemDate = moment(object.itemDate).format("YYYY-MM-DDThh:mm:ss");
        let formData = new FormData();
        let json: any = {};
        let materialConstrution: any = [];

        this.getMaterialofConstruction().value.forEach((res: any) => {
          console.log(res.id);
          if (res.isChecked == true) {
            materialConstrution.push({ MaterialconstructionId: res.id })
          }
        })

        json = {
          itemMaterialconstructionDetails: materialConstrution,
          itemName: object['itemCode'],
          itemDate: object['itemDate'],
          itemCode: object['itemCode'],
          itemDesc: object['itemDesc'],
          unitName: object['unitName'],
          remark: object['remark'],
          entryType: object['entryType'],
          itemId: this.editItemId,
          rawPartWeight: object['rawPartWeight'],
          finishPartWeight: object['finishPartWeight']
        }

        formData.append('json', JSON.stringify(json));
        let formData1 = new FormData();
        if (this.file) {
          if(Object.keys(this.file).length > 0 ){
            console.log(this.file);
            this.file?.forEach((res:any)=>{
              console.log(res);
              formData1.append('dUploadPath', res)
            })
          }
          else{
            formData1.append('dUploadPath', this.file);
          }
        }

        formData1.append('itemId' , this.editItemId)
        formData1.append('itemCode' , this.editItemId),
        formData1.append('itemName' , this.editItemId),
        
        await this._apiservice.uploadEnggDrawing(formData1).then((res: any) => {
          this._utility.loader(false);
          if (res.success == true) {
            this.errorMsg = res.message;
            this.errorMsgCheck = 'success'
            // this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
            // this.getAllItemDrawing(this.editItemId);
          }
        })
        this._apiservice.editItemMaster(formData).then((res: any) => {
          this._utility.loader(false);
          if (res.success == true) {
            this.errorMsg = res.message;
            this.errorMsgCheck = 'success'
            this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
            this.getAllTableData();
            this.itemMaster.reset();
            Object.keys(this.itemMaster.controls).forEach(key => {
              this.itemMaster.controls[key].setErrors(null)
            });
            itemMaster.resetForm();
            this.enggDrawing.nativeElement.value = null;
            this.itemMaster.controls['itemDate'].setValue(this.myDate);
            this.getState();
            this.submitButton = 'Submit'
          }

          else {
            this.errorMsg = res.message;
            this.errorMsgCheck = 'error'
            this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
            this.getAllTableData();
          }

          this.editUploadedDrawing = [];
        })
      }
    }
  }

  getAllTableData() {
    this._apiservice.getItemMaster()
      .then((res: any) => {
        console.log(res);
        this.itemMasterTable = res.returnValue;
      })
      .catch((error: any) => {
        this.itemMasterTable = [];
      })
  }

  confirm1(itemId: any , string:any) {
    if(string == 'itemDelete'){
      this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Delete Item Master Record',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
          this.deleteItem(itemId);
        },
        reject: () => {
          this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        }
      });
    }

    else if(string == 'Drawing'){
      console.log(itemId);
      this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Delete Drawing Record',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
          this.deleteDrawing(itemId);
        },
        reject: () => {
          this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        }
      });
    }
  }

  displayDialog : boolean = false;

  deleteItem(itemId: any) {
    this.itemMaster.reset();
    Object.keys(this.itemMaster.controls).forEach(key => {
      this.itemMaster.controls[key].setErrors(null)
    });
    this._utility.loader(true);
    this._apiservice.deleteItemMaster(itemId).then((res: any) => {
      this._utility.loader(false);
      if (res.success == true) {
        this.errorMsg = res.message;
        window.scroll(0, 0)
        this.errorMsgCheck = 'success'
        this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
        this.getAllTableData();
        this.getState();
      }

      else {
        this.errorMsg = res.message;
        window.scroll(0, 0)
        this.errorMsgCheck = 'error'
        this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
        this.getAllTableData();
        this.getState();
      }
    })
  }

  deleteDrawing(drawingId:any){
    console.log(drawingId)
    this._apiservice.deleteEnggDrawing(drawingId.engineeringDrawingId).then((res:any)=>{
      console.log(res);
      if(res.success){
        this._apiservice.showMessage(res.message , 'success');
        this.getAllItemDrawing(drawingId);
      }
    })
  }

  editItemId: any;
  editUploadedDrawing : any = [];
  async EditItem(customer: any) {
    await this._apiservice.getItemMasterById(customer.itemId).then((res: any) => {
      console.log(res);
      Object.keys(this.itemMaster.controls).forEach(key => {
        if (key != 'materialOfConstruction') {
          if (key == 'itemDate') {
            res.returnValue[key] = moment(res.returnValue[key]).format('MM/DD/YYYY');
          }
          else{
              this.itemMaster.controls[key].setValue(res.returnValue[key]);
          }
        }
      });

      this.getAllItemDrawing(customer);

      if (this.getMaterialofConstruction().value.length > 0) {
        this.getMaterialofConstruction().value?.forEach((materialList: any) => {
          res.returnValue['itemMaterialconstructionDetails'].forEach((material: any) => {
            if (material.materialconstructionId == materialList.id) {
              materialList.isChecked = true;
            }
          })
        })
      }


      console.log(this.getMaterialofConstruction().value);
    })



    window.scroll(0, 0);
    this.submitButton = 'Update'
    this.editItemId = customer.itemId;
  }
  resetFields() {
    this.submitButton = 'Submit';
    this.getState();
    this.editUploadedDrawing = [];
    this.itemMaster.reset();
    // Object.keys(this.itemMaster).forEach((key:any)=>{
    //   this.itemMaster.controls[key].setValue();
    // })
    this.itemMaster.controls['itemDate'].setValue(this.myDate);
    this.itemMaster.controls['entryType'].setValue('');
  }

  previewImages : any = [];
  itemName : string = '';
  getAllItemDrawing(itemId , string?:any){
    this.itemName = itemId.itemName;  
    this._utility.loader(true);
    this._apiservice.getEnggDrawing(itemId.itemId).then((res:any)=>{
    this._utility.loader(false);
      if(res.success){
        if(string == 'Preview'){
          this.displayDialog = true;
          this.previewImages = res.returnValue;
        }

        else{
          this.editUploadedDrawing = res.returnValue;
        }
      }
      
      
      else{
        if(string == 'Preview'){
          this.displayDialog = false;
          this.previewImages = [];
        }
  
        else{
          this.editUploadedDrawing = [];
        }
      }
    })

    console.log(this.editUploadedDrawing);
  }

  file: any;
  getDrawing(event: any) {
    this.file = [];
    let file1 = this._utility.onFileChange(event);
    console.log(file1);
    this.file = file1;
    console.log(Object.keys(this.file));
    console.log(this.file);

  }



  async getState() {
    this.getMaterialofConstruction().clear();
    await this._utility.getDropdownData().then((res: any) => {
      console.log(res);
      res[4]?.materialofconstructionData.forEach((data: any) => {
        this.getMaterialofConstruction().push(this.fb.group({
          id: data.id,
          value: data.value,
          isChecked: false
        }));
      })
    })
  }


  mocBoolean: boolean = false;
  getSelectedMOC() {
    this.mocBoolean = false;
    this.getMaterialofConstruction().value.forEach((res: any) => {
      if (res.isChecked == true) {
        this.mocBoolean = true;
      }
    })
  }

  getMaterialofConstruction() {
    return this.itemMaster.get('materialOfConstruction') as FormArray;
  }

  reset(dt2) {
    dt2.reset();
    this.filterval = '';
    this.dateFilterVal = ''
  }

  getSafeUrl(file:any){
    return this.sanitizer.bypassSecurityTrustResourceUrl(file);
  }
}
