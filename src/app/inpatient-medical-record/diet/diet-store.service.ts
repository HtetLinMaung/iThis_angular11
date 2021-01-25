import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Diet from './diet.model';

@Injectable({
  providedIn: 'root',
})
export class DietStoreService {
  private readonly _currentSysKey = new BehaviorSubject<number>(0);
  private readonly _diets = new BehaviorSubject<Diet[]>([]);
  private readonly _isUpdate = new BehaviorSubject<boolean>(false);
  private readonly _tabNo = new BehaviorSubject<number>(1);
  private readonly _deleteDialog = new BehaviorSubject<boolean>(false);

  readonly currentSysKey$ = this._currentSysKey.asObservable();
  readonly diets$ = this._diets.asObservable();
  readonly isUpdate$ = this._isUpdate.asObservable();
  readonly tabNo$ = this._tabNo.asObservable();
  readonly deleteDialog$ = this._deleteDialog.asObservable();

  constructor() {}

  set currentSysKey(v: number) {
    this._currentSysKey.next(v);
  }

  set diets(v: Diet[]) {
    this._diets.next(v);
  }

  set tabNo(v: number) {
    this._tabNo.next(v);
  }

  set isUpdate(v: boolean) {
    this._isUpdate.next(v);
  }

  set deleteDialog(v: boolean) {
    this._deleteDialog.next(v);
  }

  get isUpdate(): boolean {
    return this._isUpdate.getValue();
  }

  get tabNo(): number {
    return this._tabNo.getValue();
  }

  get diets(): Diet[] {
    return this._diets.getValue();
  }

  get currentSysKey(): number {
    return this._currentSysKey.getValue();
  }

  get deleteDialog(): boolean {
    return this._deleteDialog.getValue();
  }
}
