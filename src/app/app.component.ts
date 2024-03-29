import { Component, ViewChild } from '@angular/core';
import { Data, Router } from '@angular/router';
import { DataServiceService } from './dataService/data-service.service';
import { NgbActiveModal, NgbCarousel, NgbModal, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as bcrypt from 'bcryptjs';
import * as firebase from 'firebase';
import { WindowService } from './dataService/window.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'PIZZA HUNTER';
  loginReactiveForm!: FormGroup;
  signupReactiveForm!: FormGroup;
  loginData: any = {};
  validatingForm!: FormGroup;
  CartDetails: any;
  CartOpenOrNot: any;
  BuyingCartDetail: any;
  DuplicateBuyingOrNot: boolean | undefined;
  customerData: any;
  adminData: any;
  adminloginOrNot: any;
  customerloginOrNot: boolean = false;
  OrderOpenOrNot: boolean | undefined;
  OrderDetails: Object[][] = [];
  customerdataToAdmin: Object[] = [];
  DuplicateOrdertails: boolean = false;
  BuyOrNot: any;
  NewData: any;
  NewData1: any;
  newItems: any;
  ErrorPage: any;
  url: any;
  customerDatabaseData: any;
  dataarray: any;
  customerduplicateOrNot: any = false;
  adminduplicateOrNot: any = false;
  data: any;
  isCustomer = true;
  isAdmin = false;
  isCustomerSigup = true;
  isAdminSigup = false;
  ispopUpShow: any;
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;
  isModelUse = false;
  lengthVariable = -1;


  
  // carousel------------------------------------------------------------------------
  @ViewChild('carousel', { static: true })
  carousel!: NgbCarousel;
  contentIsOpenOrNot: boolean = false;
  DataOfAdmin: any;
  adminDataFromDatabase: any;
  customerData1: any = {};
  windowRef: any;
  adminData1: any;
  temp: any;
  loginDetailFromLocalStorage!: string | null;
  OTPopen: boolean = false;
  OTPJSON: any;
  OTPDATA: any;
  OTPMESSAGE: any = { error: { verification: false, msg: '' } };
  isLoginModel: any;
  isSignupModel: any;
  loginAdminReactiveForm!: FormGroup;

  constructor(private afAuth: AngularFireAuth, private windowService: WindowService, private router: Router, private _dataService: DataServiceService, private modalService: NgbModal, private SpinnerService: NgxSpinnerService, private cookieService: CookieService) {
    this.windowRef = this.windowService.windowRef;
    this._dataService.adminloginOrNot.subscribe((res) => {
      this.adminloginOrNot = res;
    });
    this._dataService.customerData.subscribe((res: any) => {
      this.customerData = res;
    })
    this._dataService.customerloginOrNot.subscribe((res) => {
      this.customerloginOrNot = res;
    });
    // this._dataService.customerloginOrNot.subscribe((res)=>{
    //   this.customerloginOrNot=res;
    // })   
    this._dataService.CartDetails.subscribe((res) => {
      this.CartDetails = res;
    });
    this._dataService.OrderOpenOrNot.subscribe((res) => {
      this.OrderOpenOrNot = res;
    });
    this._dataService.BuyOrNot.subscribe((res) => {
      this.BuyOrNot = res;
    })
    this._dataService.CartOpenOrNot.subscribe((res) => {
      this.CartOpenOrNot = res;
    });
    this._dataService.BuyingCartDetail.subscribe((res) => {
      this.BuyingCartDetail = res;
    });
    this._dataService.customerdataToAdmin.subscribe((res) => {
      this.customerdataToAdmin = res;
    });
    this._dataService.ErrorPage.subscribe((res: any) => {
      this.ErrorPage = res;
    });
    // this._dataService.customerloginOrNot.subscribe((res)=>{
    //   this.customerloginOrNot=res;
    // })

  }
  getDataOfCustomerInLogin() {
    this._dataService.getDataOfCustomer().subscribe((res) => {
      this.customerDatabaseData = res;

    });

    this._dataService.getDataOfAdmin().subscribe((res) => {
      this.data = res;
    });
  }
  ngOnInit(): void {
    this.customerloginOrNot = (localStorage.getItem('token') == null) ? false : true;
    this.loginDetailFromLocalStorage = localStorage.getItem('userDetails');
    this.loginReactiveForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$")]),
      // 'phonenumber': new FormControl('', [Validators.required, Validators.pattern("(0|91)?[7-9][0-9]{9}")]),
      // 'otp': new FormControl('')
      // [Validators.required, Validators.minLength(6)]
    })
    this.loginAdminReactiveForm=new FormGroup({

      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$")]),
    })
    this.signupReactiveForm = new FormGroup({
      'firstname': new FormControl('', [Validators.required]),
      'lastname': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$")]),
      'phonenumber': new FormControl('', [Validators.required, Validators.pattern("(0|91)?[7-9][0-9]{9}")]),
      'address': new FormControl('', [Validators.required])
    })
    this.getDataOfCustomerInLogin();
    this.getDataOfItemsFromDatabase();
    this.getDataOfAdminFromDatabase();
    this._dataService.CartDetails.subscribe((res: any) => {
      this.CartDetails = res;
    })
  }
  openOTP() {

    this.OTPopen = true;

  }
  verifyOTP() {
    this.OTPDATA.otp = this.loginReactiveForm.value.otp;
    this._dataService.verifyOTP(this.OTPDATA).subscribe((res: any) => {
      this.OTPMESSAGE = res;
      if (this.OTPMESSAGE.error.verification == true) {
        this.OTPopen = false;
      }
    }, err => {
      this.OTPMESSAGE.error.verification = err.error.verification;
      this.OTPMESSAGE.error.msg = err.error.msg;
    })


  }
  // User Defined Function-------------------------------------------------------
  getDataOfItemsFromDatabase() {
    this._dataService.getDataOfItems().subscribe((res) => {
      this.CartDetails = res;
      this._dataService.CartDetails.next(this.CartDetails);
    });
  }
  getLoginDataFromDatabase() {
    this._dataService.getDataOfLoginUser(this.loginReactiveForm.getRawValue()).subscribe((res: any) => {
      this.customerData = this.loginReactiveForm.getRawValue();
      localStorage.setItem('token', res['token']);
      // this.router.navigate(['menu'])
    });
  }
  getadminLoginDataFromDatabase() {
    this._dataService.getDataOfLoginAdmin(this.loginAdminReactiveForm.getRawValue().email).subscribe((res: any) => {
      this.adminData1 = this.loginAdminReactiveForm.getRawValue();
      localStorage.setItem('tokenAdmin',res['token']);
    });
  }
  getDataOfAdminFromDatabase() {
    this._dataService.getDataOfAdmin().subscribe((res) => {
      this.DataOfAdmin = res;
      this.lengthVariable = this.DataOfAdmin.length;
    });
  }

  logout() {
    this.OTPMESSAGE = { error: { verification: false, msg: '' } };
    this._dataService.logoutCookie().subscribe((res: any) => {
    })
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
    this._dataService.customerdataToAdmin.next([]);
    this._dataService.BuyOrNot.next(false);
    this._dataService.BuyingCartDetail.next([]);
    for (let i = 0; i < this.CartDetails.length; i++) {
      this.CartDetails[i]['count'] = 0;
    }
    this._dataService.CartDetails.next(this.CartDetails);
    this._dataService.customerData.next({});
    this._dataService.OrderDetails.next([]);
    this._dataService.adminData.next({});
    this._dataService.customerloginOrNot.next(false);
    this._dataService.adminloginOrNot.next(false);
    this.CartOpenOrNot = false;
    this._dataService.OrderOpenOrNot.next(false);
    this._dataService.adminData.next({});
    this._dataService.customerData.next({});
    this.OrderOpenOrNot = false;
    this.isModelUse = false;
    this.isAdmin = false;
    this.isCustomer = true;
    this.isAdminSigup = false;
    this.isCustomerSigup = true;
    this._dataService.CartOpenOrNot.next(false);
    this.router.navigate(['']);
  }
  ChangeCartOpeningStatus() {
    this.CartOpenOrNot = true;
    this._dataService.CartOpenOrNot.next(this.CartOpenOrNot);
  }
  ChangeOrdersOpeningStatus() {
    this.OrderOpenOrNot = true;
    this._dataService.OrderOpenOrNot.next(this.OrderOpenOrNot);
  }
  AddToBuyingCart(Data: any) {
    this.NewData = Data;
    this.BuyingCartDetail.push(this.NewData);
    this.BuyingCartDetail[this.BuyingCartDetail.length - 1]['count']++;
    this._dataService.BuyingCartDetail.next(this.BuyingCartDetail);
  }
  // decrease(item: any) {
  //   for (let i = 0; i < this.BuyingCartDetail.length; i++) { 
  //     if (this.BuyingCartDetail[i]['name'] == item['name']) {
  //       this.BuyingCartDetail[i]['count']--;
  //       if (this.BuyingCartDetail[i]['count'] <= 0) {
  //         this.BuyingCartDetail.splice(i, 1);
  //       }
  //     }
  //   }
  //   this._dataService.BuyingCartDetail.next(this.BuyingCartDetail);
  // }
  // increase(item: any) {
  //   for (let i = 0; i < this.BuyingCartDetail.length; i++) {
  //     if (this.BuyingCartDetail[i]['name'] == item['name']) {
  //       this.BuyingCartDetail[i]['count']++;
  //     }
  //   }
  //   this._dataService.BuyingCartDetail.next(this.BuyingCartDetail);
  // }
  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }
  openVerticallyCentered(content: any,data:any) {

    if(data=="login" && this.isSignupModel==false){
      this.isLoginModel=true
    }
    else if(data=="signup" && this.isLoginModel==false){
      this.isSignupModel=true;
    }
    this.getDataOfCustomerInLogin();
    if (this.isModelUse == false) {
      this.modalService.open(content, { centered: true, scrollable: true, backdrop: 'static', keyboard: false });
      this.isModelUse = true;
    }
  }
  closeModal() {
    this.isModelUse = false;
    this.signupReactiveForm.reset(this.signupReactiveForm.value);
    this.loginReactiveForm.reset(this.loginReactiveForm.value);
    this.modalService.dismissAll();
    this.isLoginModel=false;
    this.isSignupModel=false;
  }
  changeStateAdmin() {
    this.isAdmin = true;
    this.isCustomer = false;
  }
  changeStateCustomer() {
    this.isAdmin = false;
    this.isCustomer = true;
  }
  changeStateCustomerSigup() {
    this.isAdminSigup = false;
    this.isCustomerSigup = true;
  }
  changeStateAdminSigup() {

    this.isCustomerSigup = false;
    this.isAdminSigup = true;
    this.signupReactiveForm.reset(this.signupReactiveForm.value);
  }
  closetoggle() {
    this.router.navigate(['']);
  }
  closePop() {
    this.ispopUpShow = false;
  }

  verifyCustomer() {
    this.SpinnerService.show();
    this.getLoginDataFromDatabase();

    setTimeout(() => {
      if (localStorage.getItem('token') == null) {
        this.SpinnerService.hide();
        alert("your account is not found");
      }
      else {
        for (let i = 0; i < this.customerDatabaseData.length; i++) {
          if (this.customerDatabaseData[i]['email'] == this.loginReactiveForm.value.email) {
            this.customerData1["_id"] = this.customerDatabaseData[i]['_id'];
          }
        }
        this.customerData = {
          "id": this.customerData1['_id'],
          "name": this.loginReactiveForm.value.email,
          "password": this.loginReactiveForm.value.password
        }
        localStorage.setItem('userDetails', this.loginReactiveForm.value.email);
        this.loginDetailFromLocalStorage = localStorage.getItem('userDetails');
        this._dataService.customerloginOrNot.next(true);
        this._dataService.customerData.next(this.customerData);
        this.getDataOfItemsFromDatabase();
        this.router.navigate(['menu']);
        this.closeModal();
        this.modalService.dismissAll();
        this.SpinnerService.hide();
      }
      // if(this.customerData1==null){
      // 
      // }
      // else if(!this.temp){
      //   this.SpinnerService.hide();
      //   alert("Password is incorrect");
      // }
      // else if(this.temp && this.customerData1!=null){
      // this._dataService.customerloginOrNot.next(true);
      // 
      // this._dataService.customerData.next(this.customerData);
      // this.getDataOfItemsFromDatabase();

      // this.router.navigate(['menu']);
      // this.closeModal();
      // this.modalService.dismissAll();
      // this.SpinnerService.hide();
      //   }
    }, 2000);

  }
  verifyAdmin() {
    // this.getDataOfAdminFromDatabase();
    this.SpinnerService.show();
    this.getadminLoginDataFromDatabase();
    
    setTimeout(() => {
      if (localStorage.getItem('tokenAdmin')== null) {
        this.SpinnerService.hide();
        alert("your account is not found");
      }
      else {
        this._dataService.adminloginOrNot.next(true);
        this.adminData = {
          "id": this.adminData1['_id'],
          "name": this.loginAdminReactiveForm.value.email,
          "password": this.loginAdminReactiveForm.value.password
        }
        this._dataService.adminData.next(this.adminData);
        this.router.navigate(['admin-home']);
        this.closeModal();
        this.modalService.dismissAll();
        this.SpinnerService.hide();
      }
    }, 2000);

  }
  dataCustomer() {
    for (let i = 0; i < this.customerDatabaseData.length; i++) {
      if (this.signupReactiveForm.value.email == this.customerDatabaseData[i]['email'] || this.signupReactiveForm.value.password == this.customerDatabaseData[i]['password']) {
        alert("Please Don't enter existing data");
        this.customerduplicateOrNot = true;
      }
    }
    if (this.customerduplicateOrNot == false) {

      this._dataService.AddDataToCustomer({ "first_name": this.signupReactiveForm.value.firstname, "last_name": this.signupReactiveForm.value.lastname, "email": this.signupReactiveForm.value.email, "Pass": this.signupReactiveForm.value.password, "phone_number": this.signupReactiveForm.value.phonenumber, "address": this.signupReactiveForm.value.address }).subscribe((res) => {
        //  localStorage.setItem('token',res["token"]);
        //  this.router.navigate(['']);
        this.getDataOfCustomerInLogin();
      },
        (err) => {
          console.log(err);
        })
      this._dataService.AddDataToOrder({ "email": this.signupReactiveForm.value.email, "orders": [] }).subscribe((res) => {
      });
      this.modalService.dismissAll();
      this.signupReactiveForm.reset(this.signupReactiveForm.value);
      this.closeModal();
      alert("Account is Created!");
      this.router.navigate(['']);
    }
    this.customerduplicateOrNot = false;
  }
  dataAdmin() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.signupReactiveForm.value.email == this.data[i]['email'] && this.signupReactiveForm.value.password == this.data[i]['Pass']) {
        alert("Please Don't enter existing data");
        this.adminduplicateOrNot = true;
      }
    }
    if (this.adminduplicateOrNot == false) {
      this._dataService.AddDataToAdmin({ "first_name": this.signupReactiveForm.value.firstname, "last_name": this.signupReactiveForm.value.lastname, "email": this.signupReactiveForm.value.email, "Pass": this.signupReactiveForm.value.password, "phone_number": this.signupReactiveForm.value.phonenumber, "address": this.signupReactiveForm.value.address }).subscribe((res) => {
        this.getDataOfAdminFromDatabase();
      },
        (err) => {
          console.log(err); 
        }
      )
      this.modalService.dismissAll();
      alert("Account is Created!");
      this.signupReactiveForm.reset(this.signupReactiveForm.value);
      this.closeModal();
      this.router.navigate(['']);
    }
    this.adminduplicateOrNot = false;

  }
  loginAlert() { }
  GoTobodyComponent() {
    if (this.customerloginOrNot == true) {
      this.router.navigate(['menu']);
    }
    else if (this.adminloginOrNot == true) {
      this.router.navigate(['admin-home'])
    }
    else {
      this.router.navigate(['']);
    }
  }
}





  // LOGIN SYSTEM

// if(this.customerDatabaseData==null){
  //   alert("Username does not Exist");
  // }
  // for(let i=0;i<this.customerDatabaseData.length;i++){
  //   if(this.customerDatabaseData[i].email==this.loginReactiveForm.value.email && bcrypt.compare(this.customerDatabaseData[i].Pass,this.loginReactiveForm.value.password)){
  //   this._dataService.customerloginOrNot.next(true);  
  //   this.customerData={
  //     "id":this.customerDatabaseData[i]['_id'],
  //     "name":this.loginReactiveForm.value.email,
  //     "password":this.loginReactiveForm.value.password
  //   };
  //   this._dataService.customerData.next(this.customerData);
  //    this.customerloginOrNot=true;
  //     if(this.customerloginOrNot==true){
  //       this.closeModal();
  //         this.modalService.dismissAll();
  //     }
  //     this.router.navigate(['menu'])
  //   }
  // }
  // if(this.customerloginOrNot==false){
  //   alert("Please Enter Correct Email and Password");  
  // }
