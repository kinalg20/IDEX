import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, Message, PrimeNGConfig } from 'primeng/api';
import { ApiServiceService } from 'src/app/api-service.service';
import { AppUtility } from 'src/app/interceptor/appUtitlity';

@Component({
  selector: 'app-request-for-quotation',
  templateUrl: './request-for-quotation.component.html',
  styleUrls: ['./request-for-quotation.component.scss']
})
export class RequestForQuotationComponent implements OnInit {
  @ViewChild('drawing') itemDrawing: ElementRef;
  item_dropdown: any = [];
  costBreakup_dropdown: any = [];
  disableSelect: boolean = true;
  openCostBreakupSection: boolean = false;
  errorMsg: string = ''
  submitButton: string = 'Submit'
  date: any;
  errorMsgCheck: string = ''
  myDate: any;
  msgs: Message[] = [];
  itemModel: any = {};
  updateId: any;
  itemButton: string = 'Add';
  constructor(public _apiservice: ApiServiceService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig, private fb: FormBuilder, private router: Router, public _utility: AppUtility, private activate: ActivatedRoute) { }

  ngOnInit(): void {
    this.getStatic();
    this.primengConfig.ripple = true;
    let data = this.activate.snapshot.params;
    console.log(data.id);
    this.itemModel = {
      itemId: '',
      itemName: '',
      unitName: '',
      enggDrawing: '',
      rawPartWeight: '',
      finishPartWeight: '',
      volume: '',
      enquiryDesc: '',
      status: 3,
      quantity: 1,
      otherCategory: '0',
      entryType: '',
      remark: ''
    }

    this.updateId = data.id;
    if (!(data.id)) {
      this.myDate = new Date();
      this.costBreakupData();
      this.requestForQuotationForm.controls['enquiryDate'].setValue(this.myDate);
    }

    else {
      this.getEnquiryById(data.id);
      this.submitButton = 'Update';
    }
  }

  breadcrumb = [
    {
      title: 'Request For Quotation',
      subTitle: 'Dashboard'
    }
  ]

  requestForQuotationForm = this.fb.group({
    itemArray: this.fb.array([], [Validators.required]),
    costBreakupArray: this.fb.array([], [Validators.required]),
    enquiryDate: new FormControl('', [Validators.required]),
    projectName: new FormControl(''),
    enquiryId: new FormControl(''),
    enquiryNo: new FormControl(''),
    manufacturingList: this.fb.array([]),
    SelectedManufacturingList: this.fb.array([])
  });

  itemArray = this.fb.group({
    itemId: [null, Validators.required],
    unitName: ['', Validators.required],
    quantity: ['', Validators.required],
    rawPartWeight: ['', Validators.required],
    finishPartWeight: ['', Validators.required],
    volume: ['', Validators.required],
    enquiryDesc: new FormControl(''),
    entryType: new FormControl(''),
    remark: new FormControl(''),
    materialOfConstruction: new FormControl('', Validators.required),
    manufacturingProcessList: new FormControl('', Validators.required),
    apqpRequire : new FormControl(false),
    ppapRequire : new FormControl(false),
    toolLoanAgreement : new FormControl(false),
    toolHealthCheckup : new FormControl(false)
  });

  costBreakupArray = this.fb.group({
    costBreakupName: new FormControl('', [Validators.required]),
    isChecked: new FormControl(false, [Validators.required])
  })



  addItemObject: FormArray;
  async addNewItemRow() {
    let objectCheck = this.checkObjectStatus();
    let data = this.getItemArray();
    console.log(objectCheck);
    data.value.filter((res: any) => {
      if (res.itemId == this.itemModel.itemId) {
        objectCheck = -1;
      }
    })
    console.log(objectCheck);
    let drawingId: number = 0;
    if (objectCheck == -1) {
      this.errorMsg = 'Duplicate Entry'
      this.errorMsgCheck = 'error'
      this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck)
      this.itemModel["quantity"] = 1;
    }

    else if (objectCheck == 1) {
      this.errorMsg = 'Please fill the item details'
      this.errorMsgCheck = 'error'
      this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
      this.itemModel.quantity = 1;
    }

    else if (objectCheck == 0) {
      let formData = new FormData();
      if (this.itemDrawings.length > 0) {
        this.itemDrawings.forEach(element => {
          formData.append('filePaths', element);
        });
        formData.append('itemId', this.itemModel.itemId)
        await this._apiservice.uploadDrawings(formData).then((res: any) => {
          drawingId = res.returnValue;
          this.itemDrawing.nativeElement.value = '';
          this.itemDrawings = [];
        })
      }

      let array = [];
      let selectedList = this.getSelectedManufacturingList();
      array = this.requestForQuotationForm.controls['manufacturingList'].value?.filter((x: any) => x.isChecked == true);
      array.forEach((data: any) => {
        selectedList?.push(this.fb.group({
          itemId: this.itemModel.itemId,
          ManufacturingId: data.id
        }))
      })
      let data: string = '';
      array?.map((res: any, index: any) => {
        console.log(res, index, array.length - 1);
        data = data + res.id + (index != array.length - 1 ? ',' : '')
      })

      this.addItemObject = this.requestForQuotationForm.get('itemArray') as FormArray;
      this.addItemObject.push(this.fb.group({
        itemId: this.itemModel.itemId,
        unitName: this.itemModel.unitName,
        documentNo: drawingId,
        itemName: this.itemModel.itemName,
        enquiryDesc: this.itemModel.enquiryDesc ? this.itemModel.enquiryDesc : '',
        quantity: this.itemModel.quantity,
        rawPartWeight: this.itemModel.rawPartWeight == '' ? 0 : this.itemModel.rawPartWeight,
        finishPartWeight: this.itemModel.finishPartWeight == '' ? 0 : this.itemModel.finishPartWeight,
        volume: this.itemModel.volume == '' ? 0 : this.itemModel.volume,
        otherCategoryId: this.itemModel.otherCategory,
        materialOfConstruction: this.materialofconstructionData,
        manufacturingProcessList: data,
        entryType: this.itemModel.entryType,
        remark: this.itemModel.remark,
        apqpRequire : this.toolsList?.apqpRequire ? this.toolsList?.apqpRequire : false,
        ppapRequire : this.toolsList?.ppapRequire ? this.toolsList?.ppapRequire : false,
        toolLoanAgreement : this.toolsList?.toolLoanAgreement ? this.toolsList?.toolLoanAgreement : false,
        toolHealthCheckup : this.toolsList?.toolHealthCheckup ? this.toolsList?.toolHealthCheckup : false
      }));

      this.itemModel = {
        itemId: '',
        itemName: '',
        unitName: '',
        rawPartWeight: '',
        finishPartWeight: '',
        volume: '',
        enquiryDesc: '',
        status: 3,
        quantity: 1,
        otherCategory: '0',
        entryType: '',
        remark: ''
      }

      this.toolsList = {};
      console.log(this.addItemObject.value);
      this.editUploadedDrawing = [];
      this.materialofconstructionData = '';
      this.requestForQuotationForm.controls['manufacturingList'].clear();
      this.getStatic();
    }
  }



  requestForQuotationSubmit() {
    let costBreakupObjectDetails: any = [];
    console.log(this.requestForQuotationForm.value, this.requestForQuotationForm.valid);
    if (this.requestForQuotationForm.valid) {
      costBreakupObjectDetails = this.requestForQuotationForm.value.costBreakupArray.filter((value: any) => {
        if (value.isChecked) {
          let id = value.costBreakupId;
          return id;
        }
      })

      if (costBreakupObjectDetails.length > 0) {
        this._utility.loader(true);
        let object = {
          "enquiryDate": this._utility.dateTimeChange(this.requestForQuotationForm.value.enquiryDate),
          "enquiryItemDetails": this.requestForQuotationForm.value.itemArray,
          "enquiryCostBreakupDetails": costBreakupObjectDetails,
          "manufacturingProcessList": this.requestForQuotationForm.value.SelectedManufacturingList,
          "projectName": this.requestForQuotationForm.value.projectName
        };

        if (this.submitButton == 'Submit') {
          this._apiservice.addenquiryDetails(object).then((res: any) => {
            this._utility.loader(false);
            if (res.success == true) {
              this.errorMsg = res.message;
              this.errorMsgCheck = 'success'
              this.router.navigateByUrl('supplierAssign/' + res.returnValue)
              this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck)
              window.scroll(0, 0)
              this.requestForQuotationForm.reset();
              Object.keys(this.requestForQuotationForm.controls).forEach(key => {
                this.requestForQuotationForm.controls[key].setErrors(null)
              });
            }
            else {
              this.errorMsg = res.message;
              this.errorMsgCheck = 'error'
              this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
            }

          })
        }

        else if (this.submitButton == 'Update') {
          object['enquiryId'] = this.editEnquiryId;
          this._apiservice.editenquiryDetails(object).then((res: any) => {
            this._utility.loader(false);
            if (res.success == true) {
              this.errorMsg = res.message;
              this.errorMsgCheck = 'success'
              this.router.navigateByUrl('supplierAssign/' + this.updateId)
              this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck)
              window.scroll(0, 0)
              this.requestForQuotationForm.reset();
              Object.keys(this.requestForQuotationForm.controls).forEach(key => {
                this.requestForQuotationForm.controls[key].setErrors(null)
              });
            }
            else {
              this.errorMsg = res.message;
              this.errorMsgCheck = 'error'
              this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
            }

          })
        }

      }

      else {
        this._apiservice.showMessage('Please Select Cost Breakup', 'error');
      }

    }

    else {
      this._utility.loader(false);
      window.scroll(0, 0);

      if (this.getItemArray().value.length == 0) {
        this.errorMsg = "Please Enter Part Details";
        this.errorMsgCheck = "error";
      }

      else {
        this.errorMsg = "Please Fill Form Data";
        this.errorMsgCheck = "error";
      }
      this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck);
    }
  }

  confirm1(itemId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete Cost Breakup Record',
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


  editUploadedDrawing: any;
  itemName : string = '';
  drawingUploaded : any;
  async getAllItemDrawing(itemId , itemName , string) {
    this.itemName = itemName;
    // debugger;
    await this._apiservice.getEnggDrawing(itemId).then((res: any) => {
      if (res.success) {
        if(string == 'editMode'){
          this.editUploadedDrawing = res.returnValue;
        }
        else{
          this.drawingUploaded = res.returnValue;
          this.displayDialog = true;
        }
      }
      else{
        if(string == 'editMode'){
          this.editUploadedDrawing = [];
        }
        else{
          this.drawingUploaded = [];
        }
      }
    })

    console.log(this.editUploadedDrawing);
  }



  manufacturingData: any = [];
  materialofconstructionData: string = '';
  otherCategoryData: any = [];
  async getStatic() {
    this.manufacturingData = [];
    this._apiservice.getItemMaster().then((res: any) => {
      this.item_dropdown = res.returnValue;
    })

    await this._utility.getDropdownData().then((res: any) => {
      console.log(res);
      res[3].manufacturingData.forEach((data: any) => {
        data['isChecked'] = false;
        this.getManufacturingList().push(this.fb.group({
          id: data.id,
          value: data.value,
          isChecked: false
        }))

      })
      this.otherCategoryData = res[5].otherCategoryData;
    })
  }

  fillFormData(item: any) {
    let data = this.getItemArray();
    let objectCheck: number = 1;
    let itemIdValue: any;
    itemIdValue = item.target.value;
    console.log(objectCheck);
    data.value.filter((res: any) => {
      if (res.itemId == this.itemModel.itemId) {
        Object.keys(this.itemModel).forEach((i) => this.itemModel[i] = '');
        objectCheck = -1;
        this.errorMsg = 'Duplicate Entry'
        this.errorMsgCheck = 'error'
        this._apiservice.showMessage(this.errorMsg, this.errorMsgCheck)
        this.itemModel["quantity"] = 1;
        this.itemButton = 'Add'
      }
    })

    if (objectCheck == 1) {
      this._apiservice.getItemMasterById(itemIdValue)
      .then((res: any) => {
        if (res.success == true) {
          console.log(res);
          this.itemModel = {
            itemId: res.returnValue?.itemId,
            itemName: res.returnValue?.itemName,
            unitName: res.returnValue?.unitName,
            rawPartWeight: res.returnValue?.rawPartWeight,
            finishPartWeight: res.returnValue?.finishPartWeight,
            volume: '',
            enquiryDesc: '',
            quantity: 1,
            otherCategory: '0',
            enggDrawing: res.returnValue?.dUploadPath,
            entryType: res.returnValue?.entryType,
            remark: res.returnValue?.remark
          }
          this.materialofconstructionData = res.returnValue?.materialofconstructionList;
        }
      })
      this.getAllItemDrawing(itemIdValue , this.itemModel.itemName , 'editMode');
    }
  }

  deleteItem(itemId: any) {
    console.log(itemId);
    let data = this.getItemArray();
    console.log(data);
    data.value.filter((res: any, index: any) => {
      if (res.itemId == itemId) {
        data.removeAt(index);
      }
    })
  }

  costBreakupData() {
    let costBreakupArray = this.requestForQuotationForm.get('costBreakupArray') as FormArray;
    costBreakupArray.clear();
    this._apiservice.getcostBreakup().then((res: any) => {
      let costBreakup_dropdown = res.returnValue;
      if (costBreakup_dropdown.length > 0) {
        for (let index = 0; index < costBreakup_dropdown.length; index++) {
          const element = costBreakup_dropdown[index];
          costBreakupArray.push(this.fb.group({
            costBreakupName: element.costBreakupName,
            costBreakupId: element.costBreakupId,
            isChecked: false
          }));
        }
      }
    })
  }


  toolsList : any = {};

  async editCostBreakupData() {
    let costBreakupArray = this.requestForQuotationForm.get('costBreakupArray') as FormArray;
    costBreakupArray.clear();
    await this._apiservice.getcostBreakup().then((res: any) => {
      let costBreakup_dropdown_local = res.returnValue;
      for (let index = 0; index < costBreakup_dropdown_local.length; index++) {
        let element = false;
        this.costBreakup_dropdown.filter((res: any) => {
          if (costBreakup_dropdown_local[index].costBreakupId == res.costBreakupId) {
            element = true;
          }
        })
        costBreakupArray.push(this.fb.group({
          costBreakupName: costBreakup_dropdown_local[index].costBreakupName,
          costBreakupId: costBreakup_dropdown_local[index].costBreakupId,
          isChecked: element
        }));
      }
    })

    setTimeout(() => {
      this._utility.loader(false);
    }, 2000);


  }



  getCostBreakArray() {
    return this.requestForQuotationForm.get('costBreakupArray') as FormArray
  }

  getItemArray() {
    return this.requestForQuotationForm.get('itemArray') as FormArray
  }

  getManufacturingList() {
    return this.requestForQuotationForm.get('manufacturingList') as FormArray
  }
  getSelectedManufacturingList() {
    return this.requestForQuotationForm.get('SelectedManufacturingList') as FormArray
  }

  checkObjectStatus() {
    let variable: number = 0;
    console.log(this.itemModel);
    Object.entries(this.itemModel).forEach(([key]) => {
      if (!(['enquiryDesc', 'otherCategory', 'volume', 'entryType', 'remark'].includes(key))) {
        if (this.itemModel[key] == '') {
          console.log('variable', key);
          variable = 1;
        }
      }
    })
    return variable;
  }

  getTableData(event: any) {
    console.log(event);
    if (event == 'getTableData') {
      this.costBreakupData();
    }
  }


  itemDrawings: any = [];

  getAllFile(event: any) {
    this.itemDrawings = [];
    let drawings = this._utility.onFileChange(event);
    if (drawings.length > 0) {
      this.itemDrawings = drawings;
    }

    else {
      this.itemDrawings.push(drawings);
    }
    console.log(this.itemDrawings);
  }

  editEnquiryId: any;
  async getEnquiryById(id) {
    this._utility.loader(true);
    await this._apiservice.geteditenquiryDetailsById(id).then((res: any) => {
      console.log('res', res.returnValue);
      this.editEnquiryId = res.returnValue.enquiryId
      let items = this.getItemArray();
      let array: any = [];
      for (let index = 0; index < res.returnValue.enquiryItemDetails.length; index++) {
        items.push(this.fb.group({
          itemName: res.returnValue.enquiryItemDetails[index].itemName,
          itemId: res.returnValue.enquiryItemDetails[index].itemId,
          documentNo: res.returnValue.enquiryItemDetails[index].documentNo,
          enquiryDesc: res.returnValue.enquiryItemDetails[index].enquiryDesc,
          unitName: res.returnValue.enquiryItemDetails[index].unitName,
          quantity: res.returnValue.enquiryItemDetails[index].quantity,
          rawPartWeight: res.returnValue.enquiryItemDetails[index].rawPartWeight,
          finishPartWeight: res.returnValue.enquiryItemDetails[index].finishPartWeight,
          otherCategoryId: res.returnValue.enquiryItemDetails[index].otherCategoryId,
          statusName: res.returnValue.enquiryItemDetails[index].statusName,
          volume: res.returnValue.enquiryItemDetails[index].volume,
          materialOfConstruction: res.returnValue.enquiryItemDetails[index].materialofconstructionList,
          manufacturingProcessList: res.returnValue?.enquiryItemDetails[index].manufacturingProcessidList,
          apqpRequire : res.returnValue.enquiryItemDetails[index].apqpRequire,
          ppapRequire : res.returnValue.enquiryItemDetails[index].ppapRequire,
          toolLoanAgreement : res.returnValue.enquiryItemDetails[index].toolLoanAgreement,
          toolHealthCheckup : res.returnValue.enquiryItemDetails[index].toolHealthCheckup
        }));
      }

      let selectedList = this.getSelectedManufacturingList();
      res.returnValue.manufacturingProcessList?.forEach((data: any) => {
        selectedList?.push(this.fb.group({
          itemId: data.itemId,
          ManufacturingId: data.manufacturingId
        }))
      })

      this.requestForQuotationForm.controls["enquiryId"].setValue(res.returnValue.enquiryId);
      this.requestForQuotationForm.controls["enquiryNo"].setValue(res.returnValue.enquiryNo);
      this.requestForQuotationForm.controls['projectName'].setValue(res.returnValue.projectName);

      let date: any;
      date = moment(res.returnValue.enquiryDate).format('MM/DD/YYYY');
      this.requestForQuotationForm.controls["enquiryDate"].setValue(date);
      this.costBreakup_dropdown = res.returnValue?.enquiryCostBreakupDetails;
      this.editCostBreakupData();
    })
  }

  openModel(){
    this.drawingUploaded = this.editUploadedDrawing;
    this.itemName = this.itemModel.itemName;
    this.displayDialog = true;
    // this.getAllItemDrawing()
  }

  otherDocumentList : any = [];
  displayOtherDialog : boolean = false;
  async getOtherDocument(data:any){
    console.log(data);
    if(data.documentNo){
      let object = {
        Mode : 'TempDrawingDetails',
        Cond3 : data.documentNo
      }
      await this._apiservice.dropdowndata('' , object).then((res:any)=>{
        console.log(res);
        if(res.success){
          this.otherDocumentList = res.returnValue;
        }
  
        else{
          this.otherDocumentList = [];
        }
      })
  
      if(this.otherDocumentList.length > 0){
        this.displayOtherDialog = true;
      }
    }
    else{
      let enquiryId = this.requestForQuotationForm.get('enquiryId')?.value;
      let object = {
        Mode : 'DrawingDetails',
        Cond3 :  enquiryId,
        itemId : data.itemId
      }
      this._apiservice.dropdowndata('' , object).then((res:any)=>{
        console.log(res);
        if(res.success){
          this.displayOtherDialog = true;
          this.otherDocumentList = res.returnValue;
        }
  
        else{
          this.otherDocumentList = [];
        }
      })
    }
  }

  displayDialog : boolean = false;
}
