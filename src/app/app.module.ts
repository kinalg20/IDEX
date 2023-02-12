import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterStyleOneComponent } from './components/common/footer-style-one/footer-style-one.component';
import { NavbarStyleOneComponent } from './components/common/navbar-style-one/navbar-style-one.component';
import { NavbarStyleTwoComponent } from './components/common/navbar-style-two/navbar-style-two.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { AccordionModule } from 'primeng/accordion';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { DashboardNavbarComponent } from './components/common/dashboard-navbar/dashboard-navbar.component';
import { CopyrightsComponent } from './components/pages/dashboard/copyrights/copyrights.component';
import { DashboardWalletComponent } from './components/pages/dashboard/dashboard-wallet/dashboard-wallet.component';
import { DashboardMyProfileComponent } from './components/pages/dashboard/dashboard-my-profile/dashboard-my-profile.component';
import { DashboardAddListingsComponent } from './components/pages/dashboard/dashboard-add-listings/dashboard-add-listings.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { MessagesModule } from 'primeng/messages';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SidebarModule } from 'primeng/sidebar';
import { CostBreakerComponent } from './components/custom/admin-components/cost-breaker/cost-breakup.component';
import { CostComponent } from './components/custom/admin-components/cost/cost.component';
import { ItemMasterComponent } from './components/custom/admin-components/item-master/item-master.component';
import { RegisterUserComponent } from './components/custom/admin-components/register-user/register-user.component';
import { SupplierListComponent } from './components/custom/admin-components/supplier-list/supplier-list.component';
import { SupplierOnboardingDataComponent } from './components/custom/admin-components/supplier-onboarding-data/supplier-onboarding-data.component';
import { CommonFieldsComponent } from './components/custom/common-components/common-fields/common-fields.component';
import { PrimeToastComponent } from './components/custom/common-components/prime-toast/prime-toast.component';
import { ReportsComponent } from './components/custom/common-components/reports/reports.component';
import { SupplierOnboardingComponent } from './components/custom/supplier-components/supplier-onboarding/supplier-onboarding.component';
import { UserAccountComponent } from './components/custom/supplier-components/user-account/user-account.component';
import { VerificationFormComponent } from './components/custom/supplier-components/verification-form/verification-form.component';
import { EnquiryComparisonComponent } from './components/custom/user-components/enquiry-comparison/enquiry-comparison.component';
import { RequestForQuotationComponent } from './components/custom/user-components/request-for-quotation/request-for-quotation.component';
import { SupplierAssignListComponent } from './components/custom/user-components/supplier-assign-list/supplier-assign-list.component';
import { SupplierAssignComponent } from './components/custom/user-components/supplier-assign/supplier-assign.component';
import { LoginComponent } from './components/custom/user-profile/login/login.component';
import { ResetAccountInfoComponent } from './components/custom/user-profile/reset-account-info/reset-account-info.component';
import { SupplierOrderDetailsComponent } from './components/custom/supplier-components/supplier-order-details/supplier-order-details.component';
import { APQPComponent } from './components/custom/supplier-components/apqp/apqp.component';
import { PpapComponent } from './components/custom/supplier-components/ppap/ppap.component';
import { ApqpDocumentComponent } from './components/custom/common-components/apqp-document/apqp-document.component';
import { LoanToolAgreementComponent } from './components/custom/supplier-components/loan-tool-agreement/loan-tool-agreement.component';
import { ManufacturingProcessListComponent } from './components/custom/admin-components/manufacturing-process-list/manufacturing-process-list.component';
import { MaterialConstructionProcessComponent } from './components/custom/admin-components/material-construction-process/material-construction-process.component';
import { DashboardSidemenuComponent } from './components/common/dashboard-sidemenu/dashboard-sidemenu.component';
import { RecentActivitiesComponent } from './components/pages/dashboard/recent-activities/recent-activities.component';
import { StatsComponent } from './components/pages/dashboard/stats/stats.component';
import { SupplierFormDetailsComponent } from './components/custom/supplier-components/supplier-form-details/supplier-form-details.component';
import { GroupbyPipe } from './groupby.pipe';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { DocumentMasterComponent } from './components/custom/common-components/document-master/document-master.component';
import { SplitPipe } from './split.pipe';
import { CustomerFormComponent } from './components/custom/supplier-components/customer-form/customer-form.component';
import { SupplierchangerequestComponent } from './components/custom/supplier-components/supplierchangerequest/supplierchangerequest.component';
import { EnquiryComparisonByIdComponent } from './components/custom/user-components/enquiry-comparison-by-id/enquiry-comparison-by-id.component';
import { OrdersComponent } from './components/custom/admin-components/orders/orders.component';
import { KeyFilterModule} from 'primeng/keyfilter';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FinanceComponent } from './components/custom/user-components/finance/finance.component';
import { CarouselModule} from 'primeng/carousel';
import { SupplierChangeApprovalComponent } from './components/custom/user-components/supplier-change-approval/supplier-change-approval.component';
import { TitleCasePipe } from '@angular/common';
import { SuccessPageComponent } from './components/custom/common-components/success-page/success-page.component';
@NgModule({
  declarations: [
    AppComponent,
    FooterStyleOneComponent,
    NavbarStyleOneComponent,
    NavbarStyleTwoComponent,
    NotFoundComponent,
    DashboardComponent,
    DashboardNavbarComponent,
    DashboardSidemenuComponent,
    CopyrightsComponent,
    RecentActivitiesComponent,
    DashboardWalletComponent,
    DashboardMyProfileComponent,
    DashboardAddListingsComponent,
    UserAccountComponent,
    ResetAccountInfoComponent,
    VerificationFormComponent,
    SupplierOnboardingComponent,
    ItemMasterComponent,
    CostBreakerComponent,
    PrimeToastComponent,
    RequestForQuotationComponent,
    CostComponent,
    SupplierAssignComponent,
    LoginComponent,
    SupplierListComponent,
    StatsComponent,
    SupplierOnboardingDataComponent,
    RegisterUserComponent,
    EnquiryComparisonComponent,
    ReportsComponent,
    CommonFieldsComponent,
    SupplierAssignListComponent,
    SupplierOrderDetailsComponent,
    APQPComponent,
    PpapComponent,
    ApqpDocumentComponent,
    LoanToolAgreementComponent,
    ManufacturingProcessListComponent,
    MaterialConstructionProcessComponent,
    SupplierFormDetailsComponent,
    GroupbyPipe,
    DocumentMasterComponent,
    SplitPipe,
    CustomerFormComponent,
    SupplierchangerequestComponent,
    EnquiryComparisonByIdComponent,
    OrdersComponent,
    FinanceComponent,
    SupplierChangeApprovalComponent,
    SuccessPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
    SelectDropDownModule,
    NgxTypedJsModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    ConfirmDialogModule,
    MessagesModule,
    BadgeModule,
    SidebarModule,
    AccordionModule,
    KeyFilterModule,
    InputNumberModule,
    ClipboardModule
  ],
  providers: [ConfirmationService, MessageService,TitleCasePipe,
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
