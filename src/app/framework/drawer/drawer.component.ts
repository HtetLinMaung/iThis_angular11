import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css'],
})
export class DrawerComponent implements OnInit {
  drawers = [
    {
      key: '1',
      title: 'Setup',
      items: [
        {
          title: 'Parameters',
          action: () => {
            console.log('action');
          },
          items: [
            {
              title: 'Menu',
              action: () => {
                console.log('inner action');
              },
            },
            {
              title: 'Button',
              action: () => {},
            },
          ],
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
