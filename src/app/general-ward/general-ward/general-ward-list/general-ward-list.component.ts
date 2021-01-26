import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-ward-list',
  templateUrl: './general-ward-list.component.html',
  styleUrls: ['./general-ward-list.component.css'],
})
export class GeneralWardListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle1.style.background = '#3b5998';
    tabEle2.style.background = '#8C9899';
  }
}
