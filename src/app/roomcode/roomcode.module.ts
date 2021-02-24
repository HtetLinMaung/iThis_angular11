import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { RoomcodeFormComponent } from './roomcode-form/roomcode-form.component';
import { RoomcodeListComponent } from './roomcode-list/roomcode-list.component';
import { RoomcodeComponent } from './roomcode.component';

@NgModule({
  declarations: [RoomcodeFormComponent, RoomcodeListComponent, RoomcodeComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'roomcode',
        component: RoomcodeComponent,
      }
    ])
  ]
})
export class RoomcodeModule { }
