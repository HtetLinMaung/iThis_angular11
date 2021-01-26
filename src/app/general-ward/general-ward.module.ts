import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { GeneralWardFormComponent } from './general-ward/general-ward-form/general-ward-form.component';
import { GeneralWardListComponent } from './general-ward/general-ward-list/general-ward-list.component';
import { GeneralWardComponent } from './general-ward/general-ward.component';

@NgModule({
  declarations: [
    GeneralWardComponent,
    GeneralWardFormComponent,
    GeneralWardListComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'general-ward',
        component: GeneralWardComponent,
      },
    ]),
  ],
})
export class GeneralWardModule {}
