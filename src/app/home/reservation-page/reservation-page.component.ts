import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { ReserveService } from './reserve.service';
import * as moment from 'moment';
import { S3Request } from 'src/app/model/s3Request';
import { ImageList } from 'src/app/model/imageList';
import { ApiUrls } from 'src/app/constants/ApiUrls';

@Component({
  selector: 'app-reservation-page',
  templateUrl: './reservation-page.component.html',
  styleUrls: ['./reservation-page.component.css']
})
export class ReservationPageComponent implements OnInit, OnDestroy{
  isCollapsed: boolean = true;
  s3RequestOptions = new S3Request();
  imageList: ImageList[] = [];

  constructor(
    public globalService: GlobalService, 
    public reserveService: ReserveService,
  ) { }

  ngOnInit(): void {
    this.globalService.initialImage = '../../assets/images/tomoe-image3.JPG';
    moment.locale('ja');
    this.getImagesFromS3();
  }

  getImagesFromS3() {
    if(this.imageList.length > 0) {
      this.globalService.animated(true, this.imageList);
      return;
    }

    this.s3RequestOptions.prefix = ApiUrls.RESERVATION;
    this.globalService.downloadImagesFromS3(this.s3RequestOptions).subscribe({
      next: (res: Response | any) => {
        console.log(res.data);
        if(res.data.length <= 0) return;
        this.imageList = res.data;
        this.globalService.animated(true, this.imageList);
      },
      error: (res: any) => {
        console.log(res.message);
      },
      complete: () => {
      }
    });
  }

  ngOnDestroy(): void {
    this.reserveService.destroyForms();
    this.globalService.clearMyInterval();
  }


}
