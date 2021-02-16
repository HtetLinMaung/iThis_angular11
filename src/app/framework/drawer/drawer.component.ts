import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
              action: () => this.router.navigate(['/menu/menu']),
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

  constructor(private router: Router) {}

  ngOnInit(): void {}
}
