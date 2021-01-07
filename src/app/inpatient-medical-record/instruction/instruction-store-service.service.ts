import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstructionStoreServiceService {
  private readonly _currentSysKey = new BehaviorSubject<number>(0);

  readonly currentSysKey$ = this._currentSysKey.asObservable();

  constructor() {}

  private set currentSysKey(v: number) {
    this._currentSysKey.next(v);
  }

  setCurrentSysKey(v: number) {
    this.currentSysKey = v;
  }
}
