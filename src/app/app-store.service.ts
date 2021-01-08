import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Patient } from './patient.model';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  private readonly _pId = new BehaviorSubject<number>(300268449);
  private readonly _patientInfo = new BehaviorSubject<Patient>(
    new Patient('', '', '')
  );
  readonly pId$ = this._pId.asObservable();
  readonly patientInfo$ = this._patientInfo.asObservable();

  constructor() {}

  set pId(v: number) {
    this._pId.next(v);
  }

  get pId(): number {
    return this._pId.getValue();
  }

  set patientInfo(v: Patient) {
    this._patientInfo.next(v);
  }

  get patientInfo(): Patient {
    return this._patientInfo.getValue();
  }
}
