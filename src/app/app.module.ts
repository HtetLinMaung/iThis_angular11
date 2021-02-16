import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CommonTypeModule } from './common-type/common-type.module';
import { GeneralWardModule } from './general-ward/general-ward.module';
import { InpatientMedicalRecordModule } from './inpatient-medical-record/inpatient-medical-record.module';
import { LoginComponent } from './login/login.component';
import { NurseShiftSummaryModule } from './nurse-shift-summary/nurse-shift-summary.module';
import { NursingActivityWorklistModule } from './nursing-activity-worklist/nursing-activity-worklist.module';
import { NursingCareRecordModule } from './nursing-care-record/nursing-care-record.module';
import { SharedModule } from './shared/shared.module';
import { NavBarComponent } from './framework/nav-bar/nav-bar.component';
import { DrawerComponent } from './framework/drawer/drawer.component';
import { ListItemComponent } from './framework/list-item/list-item.component';
import { MenuModule } from './menu/menu.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    DrawerComponent,
    ListItemComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    InpatientMedicalRecordModule,
    NursingActivityWorklistModule,
    NurseShiftSummaryModule,
    SharedModule,
    NursingCareRecordModule,
    CommonTypeModule,
    GeneralWardModule,
    MenuModule,
    RouterModule.forRoot([
      {
        path: '',
        component: LoginComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
