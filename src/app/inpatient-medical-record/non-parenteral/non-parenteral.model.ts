export default class NonParenteral {
  constructor(
    public syskey = 0,
    public routeSyskey = '',
    public medication = '',
    public dose = 0,
    public stockId = '',
    public doseTypeSyskey = 0,
    public remark = '',
    public checkList: CheckList[] = [],
    public routeDesc = '',
    public doseTypeDesc = '',
    public frequency = 0,
    public patientId = '',
    public patientName = '',
    public adNo = ''
  ) {}
}

export class CheckList {
  constructor(
    public syskey = 0,
    public done = false,
    public nurseId = 0,
    public doneAt = ''
  ) {}
}
