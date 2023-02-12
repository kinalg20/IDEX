import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { HttpUrlEncodingCodec } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  public _baseurl = environment.base_url;
  codec = new HttpUrlEncodingCodec;
  constructor(public http: HttpClient, private messageService: MessageService, private primengConfig: PrimeNGConfig) {
    this.primengConfig.ripple = true;
  }

  ngEncode(param?: string) {
    return this.codec.encodeValue(param);
  }

  dropdowndata(string: any, object?: any): Promise<any> {
    let endpoint = 'dropdowns';
    if (!object) {
      return this.http.get(this._baseurl + 'dropdowns' + "?Mode=" + string).toPromise()
    }
    else {
      if (object) {
        var queryStrings = new HttpParams({ fromObject: object }).toString();
        endpoint = `${endpoint}?${queryStrings}`;
      }
      return this.http.get(`${this._baseurl}${endpoint}`).toPromise()
    }
  }

  // customer process
  customerRegistration(registerFormData: any): Promise<any> {
    return this.http.post(this._baseurl + 'Customer', registerFormData).toPromise()
  }

  // supplier process
  supplierRegistration(registerFormData: any): Promise<any> {
    return this.http.post(this._baseurl + 'supplier', registerFormData).toPromise()
  }

  supplierUpdate(registerFormData: any, mode?: string): Promise<any> {
    if (!mode) {
      return this.http.put(this._baseurl + 'supplier', registerFormData).toPromise()
    }

    else {
      return this.http.put(this._baseurl + 'supplier/' + mode, registerFormData).toPromise();
    }
  }

  supplierGetById(id: any): Promise<any> {
    return this.http.get(this._baseurl + 'supplier/' + id).toPromise()
  }
  
  supplierById(id: any): Promise<any> {
    return this.http.get(this._baseurl + 'supplier/getdatasupplier/' + id).toPromise()
  }

  supplierRaiseRequest(object:any):Promise<any>{
    return this.http.post(this._baseurl+'SupplierRaiseRequest',object).toPromise();
  }



  verifySupplier(object: any): Promise<any> {
    return this.http.get(this._baseurl + 'SupplierLinkCreationVerification' + "?MobileNo=" + this.ngEncode(object.mobileNo) + "&EmailAddress=" + object.emailAddress + "&IsApplied=" + object.isApplied).toPromise()
  }

  generateLinkForSupplier(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'SupplierLinkCreationVerification', object).toPromise()
  }

  getAllLinkedSupplier() {
    return this.http.get(this._baseurl + 'SupplierLinkCreationVerification/search').toPromise()
  }

  getSupplier(supplier_id?: any): Promise<any> {
    if (supplier_id) {
      return this.http.get(this._baseurl + 'supplier/' + supplier_id).toPromise();
    }

    else {
      return this.http.get(this._baseurl + 'supplier').toPromise();
    }
  }

  postSupplier(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'supplier', object).toPromise();
  }

  putJDEEntry(supplierId: any): Promise<any> {
    return this.http.put(this._baseurl + 'supplier/finance', supplierId).toPromise();
  }

  putRaiseRequest(object){
    return this.http.put(this._baseurl+'supplier/updateraiseRequst', object).toPromise();
  }

  postSupplierRFQReply(array: any): Promise<any> {
    return this.http.post(this._baseurl + 'supplierRFQReply', array).toPromise();
  }


  certificateUpload(formData: any): Promise<any> {
    return this.http.post(this._baseurl + 'supplier/CertificatesUpload', formData).toPromise()
  }
  
  assessmentUpload(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'supplier/assessment', object).toPromise()
  }


  //user 
  login(logindata: any): Promise<any> {
    return this.http.post(this._baseurl + 'User/login', logindata).toPromise()
  }

  register(registerdata: any): Promise<any> {
    return this.http.post(this._baseurl + 'User/insert', registerdata).toPromise()
  }

  getAllRegisteredUser() {
    return this.http.get(this._baseurl + 'User').toPromise();
  }

  updateUserInfo(registerdata: any) {
    return this.http.put(this._baseurl + 'User/update', registerdata).toPromise()
  }

  forgotPassword(email: any): Promise<any> {
    return this.http.put(this._baseurl + 'User/forgot-password', email).toPromise()
  }

  matchOTP(OTP: any): Promise<any> {
    return this.http.put(this._baseurl + 'User/match-otp', OTP).toPromise()
  }

  changePassword(password: any): Promise<any> {
    return this.http.post(this._baseurl + 'User/change-password', password).toPromise()
  }


  //supplier
  supplierDocUpload(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'supplierOnboarding', object).toPromise()
  }

  getAllSupplierUploadedDoc(): Promise<any> {
    return this.http.get(this._baseurl + 'supplierOnboarding').toPromise()
  }

  getSupplierDocById(object: any): Promise<any> {
    return this.http.get(this._baseurl + 'supplierOnboarding/' + object).toPromise()
  }

  deleteSupplierDocs(object: any): Promise<any> {
    return this.http.delete(this._baseurl + 'supplierOnboarding/' + object).toPromise()
  }

  updateDocStatus(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'supplierOnboarding', object).toPromise()
  }


  //item master
  addItemMaster(object?: any): Promise<any> {
    return this.http.post(this._baseurl + 'item', object).toPromise()
  }

  getItemMaster(): Promise<any> {
    return this.http.get(this._baseurl + 'item').toPromise()
  }

  getItemMasterById(id: any): Promise<any> {
    return this.http.get(this._baseurl + 'item/' + id).toPromise()
  }
  
  getEnggDrawing(itemId : any){
    return this.http.get(this._baseurl + 'item/EngineeringDrawing/' + itemId ).toPromise()
  }
  
  uploadEnggDrawing(object:any){
    return this.http.put(this._baseurl + 'item/updateEngineeringDrawing' , object ).toPromise()
  }
  deleteEnggDrawing(itemId : any){
    return this.http.delete(this._baseurl + 'item/DeleteEngineeringDrawing/' + itemId ).toPromise()
  }

  editItemMaster(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'item', object).toPromise()
  }

  deleteItemMaster(id: any): Promise<any> {
    return this.http.delete(this._baseurl + 'item/' + id).toPromise()
  }




  //cost breakup
  addcostBreakup(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'CostBreakup', object).toPromise()
  }

  getcostBreakup(): Promise<any> {
    return this.http.get(this._baseurl + 'CostBreakup').toPromise()
  }

  editcostBreakup(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'CostBreakup', object).toPromise()
  }

  deletecostBreakup(id: any): Promise<any> {
    return this.http.delete(this._baseurl + 'CostBreakup/' + id).toPromise()
  }

  //manufacture process
  addmanufacture(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'Manufacturing', object).toPromise()
  }

  getmanufacture(): Promise<any> {
    return this.http.get(this._baseurl + 'Manufacturing').toPromise()
  }

  editmanufacture(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'Manufacturing', object).toPromise()
  }

  deletemanufacture(id: any): Promise<any> {
    return this.http.delete(this._baseurl + 'Manufacturing/' + id).toPromise()
  }

  //materialConstruction process
  addmaterialConstruction(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'Materialconstruction', object).toPromise()
  }

  getmaterialConstruction(): Promise<any> {
    return this.http.get(this._baseurl + 'Materialconstruction').toPromise()
  }

  editmaterialConstruction(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'Materialconstruction', object).toPromise()
  }

  deletematerialConstruction(id: any): Promise<any> {
    return this.http.delete(this._baseurl + 'Materialconstruction/' + id).toPromise()
  }


  //enquiry details
  addenquiryDetails(data: any): Promise<any> {
    return this.http.post(this._baseurl + 'Enquiry', data).toPromise()
  }

  editenquiryDetails(data: any): Promise<any> {
    return this.http.put(this._baseurl + 'Enquiry', data).toPromise()
  }

  getenquiryDetailsById(data: any): Promise<any> {
    return this.http.get(this._baseurl + 'Enquiry/' + data).toPromise()
  }

  geteditenquiryDetailsById(data: any): Promise<any> {
    return this.http.get(this._baseurl + 'Enquiry/getalldata/' + data).toPromise()
  }

  getAllEnquiryDetails(): Promise<any> {
    return this.http.get(this._baseurl + 'Enquiry').toPromise()
  }

  uploadDrawings(itemDrawings: any) {
    return this.http.post(this._baseurl + 'enquiry/drawingUpload', itemDrawings).toPromise()
  }



  assignSupplier(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'AssignSupplier', object).toPromise()
  }

  getAssignedSupplierById(object?: any): Promise<any> {
    if (object.supplierId) {
      return this.http.get(this._baseurl + 'AssignSupplier' + "?SupplierId=" + object.supplierId + "&roleName=" + object.roleName).toPromise()
    }

    else if (object.loginId) {
      return this.http.get(this._baseurl + 'AssignSupplier' + "?roleName=" + object.roleName).toPromise()
    }
  }

  getAssignedSupplierByIdWithEnquiryNo(object: any): Promise<any> {
    if(object?.enquiryNo){
      return this.http.get(this._baseurl + 'AssignSupplier/getbyId' + "?SupplierId=" + object.supplierId + "&enquiryNo=" + object.enquiryNo + "&roleName=" + object.roleName).toPromise()
    }
    else{
      return this.http.get(this._baseurl + 'AssignSupplier/getbyId' + "?SupplierId=" + object.supplierId + "&enquiryId=" + object.enquiryId + "&roleName=" + object.roleName).toPromise()
    }
  }

  getAssignedSupplierQuotationCostBreakup(object: any): Promise<any> {
    return this.http.get(this._baseurl + 'AssignSupplier/getcostbreakup' + "?SupplierId=" + object.supplierId + "&enquiryNo=" + object.enquiryNo + "&itemId=" + object.itemId).toPromise()
  }




  //profile
  profile(object: any) {
    return this.http.get(this._baseurl + 'profile' + "?id=" + object.loginId + "&roleName=" + object.roleName).toPromise();
  }



  //comparison

  getItemFromQuotation(object?: any): Promise<any> {
    return this.http.get(this._baseurl + 'PurchaseEnquiryCompare/getEnquiryItem').toPromise()
  }



  getQuotationByItemId(object: any) {
    return this.http.get(this._baseurl + 'PurchaseEnquiryCompare/getByItemId' + "?enquiryId=" + object.enquiryId).toPromise()
  }

  getJson(object: any) {
    return this.http.get(this._baseurl + 'PurchaseEnquiryCompare/getJson' + "?Ids=" + object.enquiryId).toPromise()
  }

  submitOrderQuantity(object: any) {
    return this.http.post(this._baseurl + 'PurchaseEnquiryCompare', object).toPromise();
  }

  submitOrderConfirmation(object: any) {
    return this.http.put(this._baseurl + 'PurchaseEnquiryCompare', object).toPromise();
  }

  get(endpoint: string, searchParam?: any, options?: any): Observable<any> {
    if (searchParam) {
      var queryStrings = new HttpParams({ fromObject: searchParam }).toString();
      endpoint = `${endpoint}?${queryStrings}`;
    }
    return this.http.get(`${this._baseurl}${endpoint}`, options);
  }


  //report
  getRFQListReport(object: any): Promise<any> {
    return this.get('RFQReports/getRFQ', object, { responseType: 'blob' }).toPromise()
  }

  getRFQDetailReport(object: any): Promise<any> {
    return this.get('RFQReports/getRFQDetails', object, { responseType: 'blob' }).toPromise()
  }

  getRFQSupplierReport(object: any): Promise<any> {
    return this.get('RFQReports/getRFQSupplierDetails', object, { responseType: 'blob' }).toPromise()
  }
  getRFQOrderReport(object: any): Promise<any> {
    return this.get('RFQReports/getOrderList', object, { responseType: 'blob' }).toPromise()
  }


  //orders
  getSupplierOrders(object?: any) {
    console.log(object);
    let endpoint = 'OrderList'
    if (object) {
      if (object.supplier == '') {
        if (object?.enquiryId) {
          endpoint = endpoint + '/' + object.enquiryId + '/' + 0;
        }
      }

      else if (object.supplier == 'supplierbyId') {
        if (object?.enquiryId) {
          endpoint = endpoint + '/' + object.enquiryId;
        }
        if (object?.supplierId) {
          endpoint = endpoint + '/' + object.supplierId;
        }
      }

      else if (object.supplier == 'supplier') {
        endpoint = endpoint + "?supplierId=" + object.supplierId
        // var queryStrings = new HttpParams({ fromObject: object }).toString();
        // endpoint = `${endpoint}?${queryStrings}`;
      }
    }
    return this.http.get(this._baseurl + endpoint).toPromise()
  }



  //apqp
  getAPQPDataByItemId(object: any): Promise<any> {
    let endpoint = 'APQP';
    if (object) {
      var queryStrings = new HttpParams({ fromObject: object }).toString();
      endpoint = `${endpoint}?${queryStrings}`;
    }
    return this.http.get(this._baseurl + endpoint).toPromise();
  }

  postAPQPDocument(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'APQP', object).toPromise();
  }

  getAPQPInfo(object: any): Promise<any> {
    let endpoint : any = 'APQP/getAPQPDocumentDetails';
    if (object) {
      var queryStrings = new HttpParams({ fromObject: object }).toString();
      endpoint = `${endpoint}?${queryStrings}`;
    }
    return this.http.get(this._baseurl + endpoint).toPromise();
  }

  putAPQPDocument(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'APQP', object).toPromise();
  }

  getApqpData(object?:any): Promise<any> {
    let endpoint = 'APQP';
    if (object) {
      var queryStrings = new HttpParams({ fromObject: object }).toString();
      endpoint = `${endpoint}?${queryStrings}`;
    }
    return this.http.get(this._baseurl + endpoint).toPromise();
  }

  // getAPQPInfo(object): Promise<any> {
  //   let endpoint = 'APQP/getAPQPDocumentDetails';
  //   if (object) {
  //     var queryStrings = new HttpParams({ fromObject: object }).toString();
  //     endpoint = `${endpoint}?${queryStrings}`;
  //   }
  //   return this.http.get(this._baseurl + endpoint).toPromise();
  // }


  //raiseRequest
  raiseRequest(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'supplier/raiseRequst', object).toPromise();
  }



  //ppap
  getPPAPDataByItemId(object: any): Promise<any> {
    let endpoint = 'PPAP';
    if (object) {
      var queryStrings = new HttpParams({ fromObject: object }).toString();
      endpoint = `${endpoint}?${queryStrings}`;
    }
    return this.http.get(this._baseurl + endpoint).toPromise();
  }

  getPPAPData(object?:any): Promise<any> {
    let endpoint = 'PPAP';
    if (object) {
      var queryStrings = new HttpParams({ fromObject: object }).toString();
      endpoint = `${endpoint}?${queryStrings}`;
    }
    return this.http.get(this._baseurl + endpoint).toPromise();
  }


  postPPAPDocument(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'PPAP', object).toPromise();
  }

  putPPAPDocument(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'PPAP', object).toPromise();
  }


  getPPAPInfo(object): Promise<any> {
    let endpoint = 'PPAP/getPPAPDocumentDetails';
    if (object) {
      var queryStrings = new HttpParams({ fromObject: object }).toString();
      endpoint = `${endpoint}?${queryStrings}`;
    }
    return this.http.get(this._baseurl + endpoint).toPromise();
  }


  //ToolLoanAgreement
  getToolLoanAgreementDataByItemId(object: any): Promise<any> {
    let endpoint = 'ToolLoanAgreement';
    if (object) {
      var queryStrings = new HttpParams({ fromObject: object }).toString();
      endpoint = `${endpoint}?${queryStrings}`;
    }
    return this.http.get(this._baseurl + endpoint).toPromise();
  }

  postToolLoanAgreementDocument(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'ToolLoanAgreement', object).toPromise();
  }

  putToolLoanAgreementDocument(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'ToolLoanAgreement', object).toPromise();
  }

  //ToolHealthCheck
  getToolHealthCheckDataByItemId(object: any): Promise<any> {
    let endpoint = 'ToolHealthCheckup';
    if (object) {
      var queryStrings = new HttpParams({ fromObject: object }).toString();
      endpoint = `${endpoint}?${queryStrings}`;
    }
    return this.http.get(this._baseurl + endpoint).toPromise();
  }

  postToolHealthCheckDocument(object: any): Promise<any> {
    return this.http.post(this._baseurl + 'ToolHealthCheckup', object).toPromise();
  }

  putToolHealthCheckDocument(object: any): Promise<any> {
    return this.http.put(this._baseurl + 'ToolHealthCheckup', object).toPromise();
  }




  //common functions
  validateUserEmail(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.target.value) == false) {
      return false;
    }
    return true;
  }

  validateEmail(event: any) {
    const value = event.target.value;

    if (
      value &&
      !/^[0-9]*$/.test(value) &&
      !this.validateUserEmail(event)
    ) {
      return true
    }

    else {
      return false
    }
  }

  showMessage(errorMsg: any, errorMsgCheck: any) {
    this.messageService.add({ severity: errorMsgCheck, summary: errorMsgCheck, detail: errorMsg });
  }


  //document
  addDocument(object: any) {
    return this.http.post(this._baseurl + 'document', object).toPromise();
  }

  editDocument(object: any) {
    return this.http.put(this._baseurl + 'document', object).toPromise();
  }

  getDocument() {
    return this.http.get(this._baseurl + 'document').toPromise();
  }

  deleteDocument(id: any): Promise<any> {
    return this.http.delete(this._baseurl + 'document/' + id).toPromise()
  }

}
