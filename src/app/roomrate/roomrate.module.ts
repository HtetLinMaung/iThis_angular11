import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { RoomrateFormComponent } from './roomrate-form/roomrate-form.component';
import { RoomrateListComponent } from './roomrate-list/roomrate-list.component';
import { RoomrateComponent } from './roomrate.component';

@NgModule({
  declarations: [RoomrateComponent, RoomrateFormComponent, RoomrateListComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'roomrate',
        component: RoomrateComponent,
      }
    ])
  ]
})
export class RoomrateModule { }
