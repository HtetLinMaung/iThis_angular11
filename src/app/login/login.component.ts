import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {}

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
    }
  }

  ngOnInit(): void {}
}
