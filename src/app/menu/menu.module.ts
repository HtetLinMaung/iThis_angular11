import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MenuListComponent } from './menu/menu-list/menu-list.component';
import { MenuFormComponent } from './menu/menu-form/menu-form.component';
import { MenuOrderComponent } from './menu/menu-order/menu-order.component';

@NgModule({
  declarations: [
    MenuComponent,
    MenuListComponent,
    MenuFormComponent,
    MenuOrderComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'menu/menu',
        component: MenuComponent,
      },
    ]),
  ],
})
export class MenuModule {}
