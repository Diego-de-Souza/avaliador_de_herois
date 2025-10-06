import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history-payment-user',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './history-payment-user.component.html',
  styleUrl: './history-payment-user.component.css'
})
export class HistoryPaymentUserComponent implements OnInit {
  pedidos: any[] = [];
  metodosPagamento: any[] = [];
  preferencias = {
    emailCobranca: true,
    smsCobranca: false
  };
  
  loading = true;
  hasData = false;

  ngOnInit() {
    this.carregarDados();
  }

  async carregarDados() {
    this.loading = true;
    try {
      // Simule chamada ao backend
      await this.buscarDadosBackend();
      
      // Verificar se há pelo menos algum dado
      this.hasData = this.pedidos.length > 0 || this.metodosPagamento.length > 0;
      this.loading = false;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.hasData = false;
    } finally {
      this.loading = false;
    }
  }

  private async buscarDadosBackend() {
    // Simular delay do backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular dados vazios/nulos do backend (comentar as linhas abaixo para testar dados vazios)
    // this.pedidos = [
    //   { id: 1, data: '2025-08-01', produto: 'Assinatura Premium', valor: 29.90, status: 'Pago' },
    //   { id: 2, data: '2025-07-15', produto: 'Moedas Hero', valor: 9.90, status: 'Pendente' }
    // ];
    
    // this.metodosPagamento = [
    //   { id: 1, tipo: 'Cartão de Crédito', numero: '**** 1234' },
    //   { id: 2, tipo: 'Pix', numero: 'chave@email.com' }
    // ];

    // Para testar sem dados, descomente as linhas abaixo:
    this.pedidos = [];
    this.metodosPagamento = [];
  }

  removerMetodo(id: number) {
    this.metodosPagamento = this.metodosPagamento.filter(m => m.id !== id);
    this.hasData = this.pedidos.length > 0 || this.metodosPagamento.length > 0;
  }

  adicionarMetodo() {
    // Implemente a lógica de adicionar novo método
  }

  salvarPreferencias() {
    // Implemente a lógica de salvar preferências
  }
}