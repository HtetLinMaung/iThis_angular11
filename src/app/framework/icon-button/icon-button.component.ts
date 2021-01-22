import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css'],
})
export class IconButtonComponent implements OnInit {
  @Input() width = '35px';
  @Input() height = '35px';
  @ViewChild('iconBtn') iconBtn: ElementRef;
  constructor() {}

  ngOnInit(): void {}

  clickHandler(e) {
    console.log(e);
  }
}
