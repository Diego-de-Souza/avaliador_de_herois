import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history-payment-user',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './history-payment-user.component.html',
  styleUrl: './history-payment-user.component.css'
})
export class HistoryPaymentUserComponent {
  pedidos = [
    { id: 1, data: '2025-08-01', produto: 'Assinatura Premium', valor: 29.90, status: 'Pago' },
    { id: 2, data: '2025-07-15', produto: 'Moedas Hero', valor: 9.90, status: 'Pendente' }
  ];

  metodosPagamento = [
    { id: 1, tipo: 'Cartão de Crédito', numero: '**** 1234' },
    { id: 2, tipo: 'Pix', numero: 'chave@email.com' }
  ];

  preferencias = {
    emailCobranca: true,
    smsCobranca: false
  };

  removerMetodo(id: number) {
    this.metodosPagamento = this.metodosPagamento.filter(m => m.id !== id);
  }

  adicionarMetodo() {
    // Implemente a lógica de adicionar novo método
  }

  salvarPreferencias() {
    // Implemente a lógica de salvar preferências
  }
}
