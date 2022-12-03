import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Booking } from 'src/app/types/booking';
// httpClient 
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class ReserveService implements OnInit{
  today: any = new Date();
  bookedTime: any;
  selectedDay!: number;
  selectedDate!: number;
  isSunday: boolean = true;
  isDateValid: boolean = true;
  is_exec : boolean = false;
  successAlert: string = '';
  emailAlert: string = '';
  isValidForm: boolean = false;
  modalRef: any;

  //For ajax
    private base_url: string = 'http://localhost/tomoe_db_restapi_dev/';
  //

  bookingInfo: Booking = {
    name : "",
    howMany : null,
    bookedDate : {} as Date,
    bookedTime : "",
    course : "",
    course_option : null,
    discription : "",
    email : "",
    phone : "",
    dateForDisplay : "",
    timeForDisplay : "",
  }


  constructor(
    private modalService: NgbModal, 
    private http: HttpClient) {

  }

  ngOnInit(): void {
    this.today = new Date(Date.now());
  }

  selectReset(){
    this.bookingInfo.course_option = null;
  }

  isSpecialCourseValid(){
    if(this.bookingInfo.course == "特別コース" && ((new Date(this.bookingInfo.bookedDate).getTime() - new Date(this.today).getTime())) <= 172800000) {
      this.isValidForm = false;
      console.log(this.isValidForm);

      console.log(new Date(this.bookingInfo.bookedDate).getTime());
      console.log(new Date(this.today).getTime());
      console.log((new Date(this.bookingInfo.bookedDate).getTime() - new Date(this.today).getTime()));

      return false;
    }
    this.isValidForm = true;
    return true;
  }

  getDay(){
    console.log(typeof this.bookingInfo.bookedDate)
    this.selectedDay = new Date(this.bookingInfo.bookedDate).getDay();
    this.selectedDate = new Date(this.bookingInfo.bookedDate).getTime();
    if(this.selectedDay == 0) {
      this.isSunday = false;
      this.isValidForm = false;
    } else if(this.selectedDate < this.today.getTime()) {
      this.isDateValid = false;
      this.isValidForm = false;
    } else {
      this.isSunday = true;
      this.isDateValid = true;
      this.isValidForm = true;
    }
  }

  getDisplay(){
    moment.locale('ja');
    this.bookedTime = this.bookingInfo.bookedDate.toString() + " " + this.bookingInfo.bookedTime;
    this.bookingInfo.dateForDisplay = moment(this.bookedTime).format('MMM Do');
    this.bookingInfo.timeForDisplay = moment(this.bookedTime).format('LT');
  }

  open(content: any){
    this.getDisplay();
		this.modalRef = this.modalService.open(content);
  }

  createBookedDateForDB(){
    return this.bookingInfo.bookedDate + " " + this.bookingInfo.bookedTime;
  }

  createBooking(){
    this.bookingInfo.bookedTime = this.createBookedDateForDB();

    return this.http.post<any>(this.base_url+"insert.php", JSON.stringify(this.bookingInfo));
  }

  getReservations(){
    return this.http.get<Booking[]>(this.base_url+"view.php");
  }

  delete(id: any){
    return this.http.delete(this.base_url + "delete.php?id=" + id);
  }

  submitEmail(){
    return this.http.post<any>(this.base_url + "submitEmail.php", JSON.stringify(this.bookingInfo), { responseType: 'text' as 'json' });
  }

  destroyForms(){
    this.bookingInfo.name = "";
    this.bookingInfo.howMany = null;
    this.bookingInfo.bookedDate = {} as Date;
    this.bookingInfo.bookedTime = "";
    this.bookingInfo.course = "";
    this.bookingInfo.course_option = null;
    this.bookingInfo.discription = "";
    this.bookingInfo.email = "";
    this.bookingInfo.phone = "";
    this.bookingInfo.dateForDisplay = "";
    this.bookingInfo.timeForDisplay = "";
  }
}
