import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comprovante',
  templateUrl: './comprovante.component.html',
  styleUrls: ['./comprovante.component.css'],
  imports: [DatePipe]
})
export class ComprovanteComponent {
  now: Date = new Date();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { paymentId: string },
    private dialogRef: MatDialogRef<ComprovanteComponent>
  ) {}

  imprimir() {
    window.print();
  }

  salvarPDF() {
    window.print();
  }

  fechar() {
    this.dialogRef.close();
  }
}
