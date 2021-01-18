export default class NonParenteral {
  constructor(
    public syskey = 0,
    public routeSyskey = '',
    public medication = '',
    public dose = 0,
    public stockId = '',
    public doseTypeSyskey = 0,
    public remark = '',
    public checkList: CheckList[] = []
  ) {}
}

export class CheckList {
  constructor(public done = false, public nurseId = 0, public doneAt = '') {}

  toggleDone(nurseId = 0) {
    this.done = !this.done;
    if (this.done) {
      this.nurseId = nurseId;
      this.doneAt = new Date().toISOString();
    }
  }
}
