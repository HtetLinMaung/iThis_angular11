import { Component, OnInit } from '@angular/core';
import { MenuStoreService } from '../menu-store.service';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css'],
})
export class MenuFormComponent implements OnInit {
  menuPosition = 1;
  menus = [
    {
      value: '0',
      text: '-',
    },
  ];
  menu = '0';
  code = '';
  description = '';
  link = '';
  isSetup = false;
  btns = [
    {
      title: 'New',
    },
    { title: 'Save' },
    { title: 'Delete' },
    { title: 'Print' },
    {
      title: 'Issued',
    },
    { title: 'Routine' },
    { title: 'Urgent' },
    { title: 'RePrint' },
  ].map((btn) => ({ ...btn, selected: false }));

  constructor(public menuStoreService: MenuStoreService) {}

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    const tabEle3 = document.getElementById('tab3');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';
    tabEle3.style.background = '#8C9899';
  }

  clickChip(btn) {
    btn.selected = !btn.selected;
  }

  new() {}

  save() {}

  delete() {}
}
