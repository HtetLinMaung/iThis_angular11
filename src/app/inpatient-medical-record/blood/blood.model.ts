import { CheckList } from '../non-parenteral/non-parenteral.model';

export default class Blood {
  constructor(
    public syskey = 0,
    public routeSyskey = '1',
    public medication = '',
    public dose = 1,
    public stockId = '',
    public doseTypeSyskey = '1',
    public remark = '',
    public checkList: CheckList[] = [new CheckList()],
    public routeDesc = '',
    public doseTypeDesc = '',
    public frequency = 0,
    public moConfirmDate = '',
    public moConfirmTime = '',
    public nurseConfirmDate = '',
    public nurseConfirmTime = '',
    public givenByType = '',
    public patientId = '',
    public patientName = '',
    public adNo = '',
    public rgsNo = '',
    public key = new Date().toISOString()
  ) {}
}
