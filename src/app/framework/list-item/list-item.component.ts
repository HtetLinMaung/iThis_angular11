import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent implements OnInit {
  @Input() key = '';
  @Input() items = [];
  @Input() title = '';

  constructor() {}

  ngOnInit(): void {}

  handleParentClick() {
    const ele = document.getElementById(this.key);
    ele.classList.toggle('__active');
  }

  handleInnerClick(path = '') {
    const ele = document.getElementById('inner-' + this.key);
    ele.classList.toggle('__active');
    
  }
}
