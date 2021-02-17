import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStoreService } from 'src/app/app-store.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css'],
})
export class DrawerComponent implements OnInit {
  constructor(
    private router: Router,
    public appStoreService: AppStoreService
  ) {}

  ngOnInit(): void {
    this.appStoreService.menus = [
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
                title: 'Button Name',
                action: () => this.router.navigate(['/menu/button']),
              },
            ],
          },
        ],
      },
    ];
  }
}
