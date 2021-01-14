export default class Injection {
  constructor(
    public syskey: number = 0,
    public route: string = '',
    public medication: string = '',
    public doseCount: number = 1,
    public doseDesc: string = '',
    public frequency: number = 0,
    public doseDuration: string = '',
    public nurseSign: boolean = false
  ) {}
}
