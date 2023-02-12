import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from './AuthGuards/auth-guard.guard';
import { CostBreakerComponent } from './components/custom/admin-components/cost-breaker/cost-breakup.component';
import { ItemMasterComponent } from './components/custom/admin-components/item-master/item-master.component';
import { ManufacturingProcessListComponent } from './components/custom/admin-components/manufacturing-process-list/manufacturing-process-list.component';
import { MaterialConstructionProcessComponent } from './components/custom/admin-components/material-construction-process/material-construction-process.component';
import { OrdersComponent } from './components/custom/admin-components/orders/orders.component';
import { RegisterUserComponent } from './components/custom/admin-components/register-user/register-user.component';
import { SupplierListComponent } from './components/custom/admin-components/supplier-list/supplier-list.component';
import { SupplierOnboardingDataComponent } from './components/custom/admin-components/supplier-onboarding-data/supplier-onboarding-data.component';
import { ApqpDocumentComponent } from './components/custom/common-components/apqp-document/apqp-document.component';
import { DocumentMasterComponent } from './components/custom/common-components/document-master/document-master.component';
import { ReportsComponent } from './components/custom/common-components/reports/reports.component';
import { SuccessPageComponent } from './components/custom/common-components/success-page/success-page.component';
import { APQPComponent } from './components/custom/supplier-components/apqp/apqp.component';
import { CustomerFormComponent } from './components/custom/supplier-components/customer-form/customer-form.component';
import { LoanToolAgreementComponent } from './components/custom/supplier-components/loan-tool-agreement/loan-tool-agreement.component';
import { PpapComponent } from './components/custom/supplier-components/ppap/ppap.component';
import { SupplierFormDetailsComponent } from './components/custom/supplier-components/supplier-form-details/supplier-form-details.component';
import { SupplierOnboardingComponent } from './components/custom/supplier-components/supplier-onboarding/supplier-onboarding.component';
import { SupplierOrderDetailsComponent } from './components/custom/supplier-components/supplier-order-details/supplier-order-details.component';
import { SupplierchangerequestComponent } from './components/custom/supplier-components/supplierchangerequest/supplierchangerequest.component';
import { UserAccountComponent } from './components/custom/supplier-components/user-account/user-account.component';
import { VerificationFormComponent } from './components/custom/supplier-components/verification-form/verification-form.component';
import { EnquiryComparisonByIdComponent } from './components/custom/user-components/enquiry-comparison-by-id/enquiry-comparison-by-id.component';
import { EnquiryComparisonComponent } from './components/custom/user-components/enquiry-comparison/enquiry-comparison.component';
import { RequestForQuotationComponent } from './components/custom/user-components/request-for-quotation/request-for-quotation.component';
import { SupplierAssignListComponent } from './components/custom/user-components/supplier-assign-list/supplier-assign-list.component';
import { SupplierAssignComponent } from './components/custom/user-components/supplier-assign/supplier-assign.component';
import { SupplierChangeApprovalComponent } from './components/custom/user-components/supplier-change-approval/supplier-change-approval.component';
import { LoginComponent } from './components/custom/user-profile/login/login.component';
import { ResetAccountInfoComponent } from './components/custom/user-profile/reset-account-info/reset-account-info.component';
// import { AboutUsComponent } from './components/pages/about-us/about-us.component';
// import { AuthorProfileComponent } from './components/pages/author-profile/author-profile.component';
// import { BlogDetailsComponent } from './components/pages/blog-details/blog-details.component';
// import { BlogGridComponent } from './components/pages/blog-grid/blog-grid.component';
// import { BlogRightSidebarComponent } from './components/pages/blog-right-sidebar/blog-right-sidebar.component';
// import { CartComponent } from './components/pages/cart/cart.component';
// import { CategoriesComponent } from './components/pages/categories/categories.component';
// import { CheckoutComponent } from './components/pages/checkout/checkout.component';
// import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
// import { ContactComponent } from './components/pages/contact/contact.component';
import { DashboardAddListingsComponent } from './components/pages/dashboard/dashboard-add-listings/dashboard-add-listings.component';
// import { DashboardBookingsComponent } from './components/pages/dashboard/dashboard-bookings/dashboard-bookings.component';
// import { DashboardBookmarksComponent } from './components/pages/dashboard/dashboard-bookmarks/dashboard-bookmarks.component';
// import { DashboardInvoiceComponent } from './components/pages/dashboard/dashboard-invoice/dashboard-invoice.component';
// import { DashboardMessagesComponent } from './components/pages/dashboard/dashboard-messages/dashboard-messages.component';
// import { DashboardMyListingsComponent } from './components/pages/dashboard/dashboard-my-listings/dashboard-my-listings.component';
import { DashboardMyProfileComponent } from './components/pages/dashboard/dashboard-my-profile/dashboard-my-profile.component';
// import { DashboardReviewsComponent } from './components/pages/dashboard/dashboard-reviews/dashboard-reviews.component';
import { DashboardWalletComponent } from './components/pages/dashboard/dashboard-wallet/dashboard-wallet.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
// import { EventsDetailsComponent } from './components/pages/events-details/events-details.component';
// import { EventsComponent } from './components/pages/events/events.component';
// import { FaqComponent } from './components/pages/faq/faq.component';
// import { GalleryComponent } from './components/pages/gallery/gallery.component';
// import { GridListingsFullWidthComponent } from './components/pages/grid-listings-full-width/grid-listings-full-width.component';
// import { GridListingsLeftSidebarComponent } from './components/pages/grid-listings-left-sidebar/grid-listings-left-sidebar.component';
// import { GridListingsRightSidebarComponent } from './components/pages/grid-listings-right-sidebar/grid-listings-right-sidebar.component';
// import { HomeDemoTwoComponent } from './components/pages/home-demo-two/home-demo-two.component';
// import { HowItWorksPageComponent } from './components/pages/how-it-works-page/how-it-works-page.component';
// import { ListingsDetailsComponent } from './components/pages/listings-details/listings-details.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
// import { PricingComponent } from './components/pages/pricing/pricing.component';
// import { ProductsDetailsComponent } from './components/pages/products-details/products-details.component';
// import { ProductsListComponent } from './components/pages/products-list/products-list.component';
// import { TopPlaceComponent } from './components/pages/top-place/top-place.component';
// import { VerticalListingsFullWidthComponent } from './components/pages/vertical-listings-full-width/vertical-listings-full-width.component';
// import { VerticalListingsLeftSidebarComponent } from './components/pages/vertical-listings-left-sidebar/vertical-listings-left-sidebar.component';
// import { VerticalListingsRightSidebarComponent } from './components/pages/vertical-listings-right-sidebar/vertical-listings-right-sidebar.component';

const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent, canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'Admin']}},
    {path: 'dashboard-my-profile', component: DashboardMyProfileComponent, canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'User' , 'Admin' , 'Supplier', 'Normal User' , 'Bussiness head', 'Finance']}},
    {path: 'linkGeneration', component: DashboardAddListingsComponent , canActivate : [AuthGuardGuard] , data: {roles: ['User' , 'Admin', 'Normal User', 'Bussiness head']}},

    // Here add new pages component
    {path: '', redirectTo:'login' , pathMatch: 'full'},
    {path: 'login', component: LoginComponent , pathMatch: 'full', canActivate : [AuthGuardGuard]},
    {path: 'register/:email', component: UserAccountComponent , pathMatch: 'full'},
    {path: 'customer', component: CustomerFormComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data : {roles: ['Admin' , 'User' , 'Supplier', 'Normal User' , 'Bussiness head']}},
    {path: 'reset-password', component: ResetAccountInfoComponent , pathMatch: 'full'},
    {path: 'verification', component: VerificationFormComponent , pathMatch: 'full'},
    {path: 'supplierOnboarding', component: SupplierOnboardingComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['Supplier']}},
    {path: 'raiseChangeRequest', component: SupplierchangerequestComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['Supplier']}},
    {path: 'APQP', component: APQPComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['Supplier' , 'Admin']}},
    {path: 'PPAP', component: PpapComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['Supplier']}},
    {path: 'loanToolAgreement', component: LoanToolAgreementComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['Admin' , 'Supplier']}},
    {path: 'toolhealthCheck', component: LoanToolAgreementComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['Admin' , 'Supplier']}},
    {path: 'manufacturingProcessList', component: ManufacturingProcessListComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['Admin']}},
    {path: 'materialConstructionList', component: MaterialConstructionProcessComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['Admin']}},
    {path: 'myOrders', component: SupplierOrderDetailsComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['Supplier']}},
    {path: 'supplierOrders', component: OrdersComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['Admin' , 'User' , 'Supplier', 'Normal User' , 'Bussiness head']}},
    {path: 'itemMaster', component: ItemMasterComponent , pathMatch: 'full', canActivate : [AuthGuardGuard] ,  data: {roles: ['SuperAdmin' , 'Admin' , 'User'] }},
    {path: 'costBreakup', component: CostBreakerComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'Admin' , 'User']}},
    {path: 'requestForQuotation', component: RequestForQuotationComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'User' , 'Normal User' , 'Bussiness head']}},
    {path: 'requestForQuotation/:id', component: RequestForQuotationComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'User' , 'Normal User' , 'Bussiness head']}},
    {path: 'apqpDocument', component: APQPComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'User' , 'Normal User' , 'Bussiness head']}},
    {path: 'ppapDocument', component: PpapComponent , pathMatch: 'full' , canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'User' , 'Normal User' , 'Bussiness head']}},
    {path: 'supplierAssign/:id', component: SupplierAssignComponent , pathMatch: 'full' ,  canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'Admin' , 'User' , 'Normal User', 'Bussiness head' ]}},
    {path: 'supplierAssign', component: SupplierAssignComponent , pathMatch: 'full' ,  canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'Admin' , 'User' , 'Normal User' , 'Bussiness head']}},
    {path: 'supplierDashboard', component: DashboardWalletComponent, canActivate : [AuthGuardGuard] , data: {roles: ['Supplier' , 'User' , 'Normal User' , 'Bussiness head']}},    
    {path: 'supplierList', component: SupplierListComponent , pathMatch: 'full', canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'Admin' , 'Supplier' , 'User' , 'Normal User' , 'Bussiness head', 'Finance']}},    
    {path: 'supplierMaster', component: SupplierFormDetailsComponent , pathMatch: 'full', canActivate : [AuthGuardGuard] , data: {roles: ['Supplier']}},    
    {path: 'userRegistration', component: RegisterUserComponent , pathMatch: 'full', canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'Admin' , 'Normal User' , 'Bussiness head']}},
    {path: 'supplierUploadedDocList', component: SupplierOnboardingDataComponent , pathMatch: 'full', canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'Admin','User', 'Finance']}},    
    {path: 'enquiryPurchase', component: EnquiryComparisonComponent , pathMatch: 'full', canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'Admin' , 'User' ,'Normal User' , 'Bussiness head']}},    
    {path: 'enquiryPurchase/:enquiryId', component: EnquiryComparisonByIdComponent , pathMatch: 'full', canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'Admin' , 'User' ,'Normal User' , 'Bussiness head']}},    
    {path: 'report', component: ReportsComponent , pathMatch: 'full', canActivate : [AuthGuardGuard] , data: {roles: ['SuperAdmin' , 'Admin' , 'User' , 'Supplier' , 'Normal User' , 'Bussiness head']}},    
    {path: 'supplierAssignList', component: SupplierAssignListComponent , pathMatch: 'full' , data: {roles: ['SuperAdmin' , 'Admin' , 'User' , 'Normal User' , 'Bussiness head']}},    
    {path: 'documentMaster', component: DocumentMasterComponent , pathMatch: 'full' , data: {roles: ['SuperAdmin' , 'Admin' , 'User' , 'Normal User' , 'Bussiness head']}},    
    {path: 'supplierChangeRequests', component: SupplierChangeApprovalComponent , pathMatch: 'full'},    
    {path: 'successPage', component: SuccessPageComponent , pathMatch: 'full'},    
    {path: '**', component: NotFoundComponent}, // This line will remain down from the whole pages component list
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule { }