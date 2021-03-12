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
    public adNo = '',
    public moConfirmDate = '',
    public moConfirmTime = '',
    public nurseConfirmDate = '',
    public nurseConfirmTime = '',
    public diagnosis = '',
    public drugAllergyTo = '',
    public chronicRenalFailure = false,
    public pregnant = false,
    public tubeFeed = false,
    public liquidMedication = false,
    public dateStart = '',
    public dateOff = '',
    public givenByType = 'X1',
    public rgsNo = 0
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
