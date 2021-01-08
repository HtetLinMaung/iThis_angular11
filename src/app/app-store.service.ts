import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  private readonly _pId = new BehaviorSubject<number>(300268449);

  readonly pId$ = this._pId.asObservable();

  constructor() {}

  set pId(v: number) {
    this._pId.next(v);
  }

  get pId(): number {
    return this._pId.getValue();
  }
}
