import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MenuComponent],
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
