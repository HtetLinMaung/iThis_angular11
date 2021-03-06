import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Menu from './menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuStoreService {
  private readonly _currentSysKey = new BehaviorSubject<number>(0);
  private readonly _detailSysKey = new BehaviorSubject<number>(0);
  private readonly _menus = new BehaviorSubject<Menu[]>([]);
  private readonly _isUpdate = new BehaviorSubject<boolean>(false);
  private readonly _tabNo = new BehaviorSubject<number>(2);
  private readonly _deleteDialog = new BehaviorSubject<boolean>(false);

  readonly currentSysKey$ = this._currentSysKey.asObservable();
  readonly detailSysKey$ = this._detailSysKey.asObservable();
  readonly menus$ = this._menus.asObservable();
  readonly isUpdate$ = this._isUpdate.asObservable();
  readonly tabNo$ = this._tabNo.asObservable();
  readonly deleteDialog$ = this._deleteDialog.asObservable();

  constructor() {}

  set currentSysKey(v: number) {
    this._currentSysKey.next(v);
  }

  set menus(v: Menu[]) {
    this._menus.next(v);
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

  set detailSyskey(v: number) {
    this._detailSysKey.next(v);
  }

  get isUpdate(): boolean {
    return this._isUpdate.getValue();
  }

  get tabNo(): number {
    return this._tabNo.getValue();
  }

  get menus(): Menu[] {
    return this._menus.getValue();
  }

  get currentSysKey(): number {
    return this._currentSysKey.getValue();
  }

  get deleteDialog(): boolean {
    return this._deleteDialog.getValue();
  }

  get detailSyskey(): number {
    return this._detailSysKey.getValue();
  }
}
