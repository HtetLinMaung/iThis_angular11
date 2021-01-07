export default class Instruction {
  constructor(
    public date: string,
    public dateTaken: string,
    public drugAllergyTo: string,
    public instruction: string,
    public remarks: string
  ) {}
}
