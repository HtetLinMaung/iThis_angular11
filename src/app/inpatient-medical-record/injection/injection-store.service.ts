import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Injection from './Injection.model';

interface SelectType {
  value: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class InjectionStoreService {
  private readonly _currentSysKey = new BehaviorSubject<number>(0);
  private readonly _injections = new BehaviorSubject<Injection[]>([]);
  private readonly _isUpdate = new BehaviorSubject<boolean>(false);
  private readonly _tabNo = new BehaviorSubject<number>(2);
  private readonly _deleteDialog = new BehaviorSubject<boolean>(false);
  private readonly _routes = new BehaviorSubject<SelectType[]>([]);
  private readonly _doses = new BehaviorSubject<SelectType[]>([]);

  readonly currentSysKey$ = this._currentSysKey.asObservable();
  readonly injections$ = this._injections.asObservable();
  readonly isUpdate$ = this._isUpdate.asObservable();
  readonly tabNo$ = this._tabNo.asObservable();
  readonly deleteDialog$ = this._deleteDialog.asObservable();
  readonly routes$ = this._routes.asObservable();
  readonly doses$ = this._doses.asObservable();

  constructor() {}

  set currentSysKey(v: number) {
    this._currentSysKey.next(v);
  }

  set injections(v: Injection[]) {
    this._injections.next(v);
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

  set routes(v: SelectType[]) {
    this._routes.next(v);
  }

  set doses(v: SelectType[]) {
    this._doses.next(v);
  }

  get isUpdate(): boolean {
    return this._isUpdate.getValue();
  }

  get tabNo(): number {
    return this._tabNo.getValue();
  }

  get injections(): Injection[] {
    return this._injections.getValue();
  }

  get currentSysKey(): number {
    return this._currentSysKey.getValue();
  }

  get deleteDialog(): boolean {
    return this._deleteDialog.getValue();
  }

  get routes(): SelectType[] {
    return this._routes.getValue();
  }

  get doses(): SelectType[] {
    return this._doses.getValue();
  }
}
