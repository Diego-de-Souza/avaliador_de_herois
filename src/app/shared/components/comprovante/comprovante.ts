import { DatePipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-comprovante',
  imports: [CommonModule],
  templateUrl: './comprovante.html',
  styleUrl: './comprovante.css'
})
export class Comprovante implements OnInit{
  private readonly authService = inject(AuthService);
  
  now: Date = new Date();
  data = inject(MAT_DIALOG_DATA) as {
    paymentId: string,
    userName?: string,
    items?: Array<{ plan?: { name: string, price: number, currency: string }, name?: string, price?: number, currency?: string, quantity?: number }>
  };
  dialogRef = inject(MatDialogRef<Comprovante>);

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.data.userName = user?.email || 'Usuário Desconhecido'; 
    
  }

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
