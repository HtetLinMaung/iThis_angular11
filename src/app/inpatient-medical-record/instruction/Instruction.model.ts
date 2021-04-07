export default class Instruction {
  constructor(
    public syskey: number,
    public date: string,
    public dateTaken: string,
    public drugAllergyTo: string,
    public instruction: string,
    public remarks: string,
    public fmtDate: string,
    public fmtDateTaken: string,
    public pId: number,
    public patientId: string,
    public patientName: string,
    public adNo: string,
    public rgsNo = ''
  ) {}
}
