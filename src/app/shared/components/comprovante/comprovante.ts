import { DatePipe, CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comprovante',
  imports: [CommonModule, DatePipe],
  templateUrl: './comprovante.html',
  styleUrl: './comprovante.css'
})
export class Comprovante {
  now: Date = new Date();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      paymentId: string,
      userName?: string,
      items?: Array<{ plan?: { name: string, price: number, currency: string }, name?: string, price?: number, currency?: string, quantity?: number }>
    },
    private dialogRef: MatDialogRef<Comprovante>
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
