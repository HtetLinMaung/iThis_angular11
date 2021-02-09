import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStoreService } from '../app-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    public appStoreService: AppStoreService
  ) {}

  navigate(n: number) {
    switch (n) {
      case 1:
        this.router.navigate(['/inpatient-medication-record/instruction']);
        break;
      case 2:
        this.router.navigate(['/inpatient-medication-record/stat-medication']);
        break;
      case 3:
        this.router.navigate(['/nursing-activity-worklist']);
        break;
      case 4:
        this.router.navigate(['/inpatient-medication-record/non-parenteral']);
        break;
      case 5:
        this.router.navigate(['/inpatient-medication-record/injection']);
        break;
      case 6:
        this.router.navigate(['/inpatient-medication-record/blood']);
        break;
      case 7:
        this.router.navigate(['/inpatient-medication-record/diet']);
        break;
      case 8:
        this.router.navigate(['/general-ward']);
    }
  }
  navigate1(n: number) {
    switch (n) {
      case 1:
        this.router.navigate(['/nurse-shift-summary']);
        break;
    }
  }
  navigate2(n: number) {
    switch (n) {
      case 1:
        this.router.navigate(['/nursing-care-record']);
        break;
    }
  }
  navigate3(n: number) {
    switch (n) {
      case 1:
        this.router.navigate(['/common-type']);
        break;
    }
  }

  ngOnInit(): void {}
}
