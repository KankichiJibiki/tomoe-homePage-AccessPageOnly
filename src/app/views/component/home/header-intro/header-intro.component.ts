import { GlobalService } from './../../../../service/global/global.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-intro',
  templateUrl: './header-intro.component.html',
  styleUrls: ['./header-intro.component.css']
})
export class HeaderIntroComponent implements OnInit {

  constructor(
    public globalService: GlobalService,
  ) { }

  ngOnInit(): void {
  }

}
