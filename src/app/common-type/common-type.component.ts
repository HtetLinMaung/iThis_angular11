import { Component, OnInit } from '@angular/core';
import { HttpService } from '../framework/http.service';
import { CommonTypeService } from './common-type.service';

@Component({
  selector: 'app-common-type',
  templateUrl: './common-type.component.html',
  styleUrls: ['./common-type.component.css']
})
export class CommonTypeComponent implements OnInit {
  syskey = this.getSyskey();
  constructor(
    private http: HttpService,
    public instructionStoreService: CommonTypeService
  ) { }

  ngOnInit(): void {
    this.tabClickHandler(1);
  }
  tabClickHandler(n: number) {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    switch (n) {
      case 1:
        tabEle1.style.background = '#3b5998';
        tabEle2.style.background = '#8C9899';
        break;
      default:
        tabEle2.style.background = '#3b5998';
        tabEle1.style.background = '#8C9899';
        this.instructionStoreService._syskey = this.syskey;
    }
    this.instructionStoreService.tabNo = n;
  }
  getSyskey() {
    return {
      syskey: "",
    };
  }


}
