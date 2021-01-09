import { NgModule } from '@angular/core';
import { NursingActivityWorklistComponent } from './nursing-activity-worklist/nursing-activity-worklist.component';
import { NursingActivityWorklistListComponent } from './nursing-activity-worklist/nursing-activity-worklist-list/nursing-activity-worklist-list.component';
import { NursingActivityWorklistFormComponent } from './nursing-activity-worklist/nursing-activity-worklist-form/nursing-activity-worklist-form.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    NursingActivityWorklistComponent,
    NursingActivityWorklistListComponent,
    NursingActivityWorklistFormComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'nursing-activity-worklist',
        component: NursingActivityWorklistComponent,
      },
    ]),
  ],
})
export class NursingActivityWorklistModule {}
