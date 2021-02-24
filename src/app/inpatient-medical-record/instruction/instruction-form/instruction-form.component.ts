import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { InstructionStoreService } from '../instruction-store.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { AppStoreService } from 'src/app/app-store.service';

@Component({
  selector: 'app-instruction-form',
  templateUrl: './instruction-form.component.html',
  styleUrls: ['./instruction-form.component.css'],
})
export class InstructionFormComponent implements OnInit {
  date = '';
  dateTaken = '';
  drugAllergyTo = '';
  instruction = '';
  remarks = '';
  filteredInstructions = [];
  drugAllergyToCurrent = '';

  constructor(
    private http: HttpService,
    public instructionStoreService: InstructionStoreService,
    public appStoreService: AppStoreService
  ) {}

  ngOnInit(): void {
    this.bindEditData();
  }

  new() {
    this.instructionStoreService.isUpdate = false;
    this.date = '';
    this.dateTaken = '';
    this.drugAllergyTo = '';
    this.instruction = '';
    this.remarks = '';
    this.fetchAllergiesByPatient(this.appStoreService.pId);
  }

  bindEditData() {
    if (this.instructionStoreService.isUpdate) {
      const tabEle1 = document.getElementById('tab1');
      const tabEle2 = document.getElementById('tab2');
      tabEle2.style.background = '#3b5998';
      tabEle1.style.background = '#8C9899';

      const instruction = this.instructionStoreService.instructions.find(
        (v) => v.syskey == this.instructionStoreService.currentSysKey
      );

      this.date = instruction.date;
      this.dateTaken = instruction.dateTaken;
      this.drugAllergyTo = instruction.drugAllergyTo;
      this.instruction = instruction.instruction;
      this.remarks = instruction.remarks;
    } else {
      this.appStoreService.onPatientIdChanged = () => {
        this.fetchAllergiesByPatient(this.appStoreService.pId);
      };
    }
  }

  save() {
    this.http
      .doPost(
        `inpatient-medical-record/${
          this.instructionStoreService.isUpdate
            ? 'update-instruction/' + this.instructionStoreService.currentSysKey
            : 'save-instruction'
        }`,
        {
          syskey: 0, // dummy syskey, it is not used in service
          pId: this.appStoreService.pId,
          RgsNo: this.appStoreService.rgsNo,
          userid: '',
          username: '',
          date: this.date,
          dateTaken: this.dateTaken,
          drugAllergyTo: this.drugAllergyTo,
          instruction: this.instruction,
          remarks: this.remarks,
        }
      )
      .subscribe((data: any) => {
        if (!this.instructionStoreService.isUpdate) {
          this.instructionStoreService.currentSysKey = data.syskey;
        }
        this.instructionStoreService.isUpdate = true;
      });
  }

  delete() {
    if (this.instructionStoreService.isUpdate)
      this.instructionStoreService.deleteDialog = true;
  }

  print() {
    this.filteredInstructions = this.appStoreService.pId
      ? this.instructionStoreService.instructions.filter(
          (instruction) => instruction.pId == this.appStoreService.pId
        )
      : [...this.instructionStoreService.instructions];

    const doc = new jsPDF();

    setTimeout(() => {
      (doc as any).autoTable({
        html: '#inpatient__record',
        startY: 35,
        theme: 'grid',
        didDrawCell: (data) => {
          switch (data.row.index) {
            case 1:
              doc.setFontSize(9);
              switch (data.column.index) {
                case 0:
                  doc.text('WARD', data.cell.x + 2, data.cell.y + 5);
                  doc.text(
                    this.appStoreService.patientInfo.ward,
                    data.cell.x + 5,
                    data.cell.y + 10
                  );
                  break;
                case 1:
                  doc.text('BED', data.cell.x + 2, data.cell.y + 5);
                  doc.text(
                    this.appStoreService.patientInfo.bed,
                    data.cell.x + 5,
                    data.cell.y + 10
                  );
                  break;
              }
              break;
            case 2:
              doc.setFontSize(9);
              doc.text('DRUG ALLERGY', data.cell.x + 1, data.cell.y + 3);
              doc.text('DRUG ALLERGY TO:', data.cell.x + 40, data.cell.y + 3);
              doc.text(
                this.appStoreService.patientInfo.drugAllergyTo,
                data.cell.x + 73,
                data.cell.y + 3
              );

              doc.rect(data.cell.x + 3, data.cell.y + 5, 5, 5);
              doc.text('YES', data.cell.x + 10, data.cell.y + 9);

              doc.rect(data.cell.x + 25, data.cell.y + 5, 5, 5);
              doc.text('NO', data.cell.x + 32, data.cell.y + 9);
              break;
          }
        },
        styles: {
          minCellWidth: 15,
          fontSize: 11,
          cellPadding: 4,
          valign: 'middle',
          halign: 'center',
        },
      });

      doc.setFontSize(11);
      doc.text('ASIA ROYAL HOSPITAL', 105, 15, { align: 'center' });
      doc.text('IN-PATIENT MEDICATION RECORD - INSTRUCTION', 105, 23, {
        align: 'center',
      });

      const y = 80;

      doc.setFontSize(10);
      doc.text('HT: ', 18, y);
      doc.line(25, y, 45, y);

      doc.text('WT: ', 55, y);
      doc.line(62, y, 82, y);

      doc.text('DATE TAKEN: ', 135, y);
      doc.line(147 + 15, y, 180 + 15, y);

      doc.setFontSize(9);
      doc.text('(To be taken on admission)', 31, y + 3);

      (doc as any).autoTable({
        html: '#instruction__print',
        startY: 90,
        theme: 'grid',
        styles: {
          fontSize: 12,
          valign: 'middle',
          halign: 'center',
        },
        headStyles: {
          fillColor: '#686869',
        },
      });
      doc.save('instruction.pdf');
    }, 1000);
  }

  fetchAllergiesByPatient(pId: number) {
    console.log('running fetchAllergiesByPatient');
    this.http
      .doGet(`inpatient-medical-record/allergies/${pId}`)
      .subscribe((data: any) => {
        this.drugAllergyTo = data.length ? data[0].allergy : '';
      });
  }
}
