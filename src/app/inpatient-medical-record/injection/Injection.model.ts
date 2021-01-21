import { CheckList } from '../non-parenteral/non-parenteral.model';

export default class Injection {
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
    public frequency = 0
  ) {}
}
