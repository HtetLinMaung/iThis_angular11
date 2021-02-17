import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MenuListComponent } from './menu/menu-list/menu-list.component';
import { MenuFormComponent } from './menu/menu-form/menu-form.component';
import { MenuOrderComponent } from './menu/menu-order/menu-order.component';
import { ButtonComponent } from './button/button.component';
import { ButtonListComponent } from './button/button-list/button-list.component';
import { ButtonFormComponent } from './button/button-form/button-form.component';

@NgModule({
  declarations: [
    MenuComponent,
    MenuListComponent,
    MenuFormComponent,
    MenuOrderComponent,
    ButtonComponent,
    ButtonListComponent,
    ButtonFormComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'menu/menu',
        component: MenuComponent,
      },
      {
        path: 'menu/button',
        component: ButtonComponent,
      },
    ]),
  ],
})
export class MenuModule {}
