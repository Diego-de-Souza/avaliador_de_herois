import { Component, inject } from '@angular/core';
import ApexCharts from 'apexcharts'
import { HeaderPlatformComponent } from '../../../shared/components/header-platform/header-platform.component';
import { DashboardHttpService } from '../../../core/service/http/dashboard-http.service';

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [HeaderPlatformComponent],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent {
  private readonly dashBoardService = inject(DashboardHttpService)
  
  totalUsuariosRegistrados = 0;
  totalAcessos = 0;
  totalAcessosSite = 0;
  totalAcessosPlataforma = 0;
  acessosPorMes: any = {};
  totalArtigos = 348;
  totalEventos = 0;
  acessosUsuariosPorMes: any = {};

  ngOnInit() {
    this.getDataDashboard();
  }

  renderCharts() {
    // Converter acessosUsuariosPorMes (objeto) para array ordenado
    const usuariosData = this.convertMonthsObjectToArray(this.acessosUsuariosPorMes);
    
    // Converter acessosPorMes (objeto) para array ordenado
    const acessosData = this.convertMonthsObjectToArray(this.acessosPorMes);
    
    // Configuração do gráfico de Usuários
    const optionsUsers: ApexCharts.ApexOptions = {
      chart: { type: 'area' },
      series: [{ name: 'Usuários', data: usuariosData }],
      xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] },
      theme: { mode: this.isDarkTheme ? 'dark' : 'light' }
    };

    // Configuração do gráfico de Acessos
    const optionsAccess: ApexCharts.ApexOptions = {
      chart: { type: 'area' },
      series: [{ name: 'Acessos', data: acessosData }],
      xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] },
      theme: { mode: this.isDarkTheme ? 'dark' : 'light' }
    };

    const options_posts: ApexCharts.ApexOptions = {
      series: [{
            name: 'Jan',
            data: this.generateData(20, {
              min: -30,
              max: 55
            })
          },
          {
            name: 'Feb',
            data: this.generateData(20, {
              min: -30,
              max: 55
            })
          },
          {
            name: 'Mar',
            data: this.generateData(20, {
              min: -30,
              max: 55
            })
          },
          {
            name: 'Apr',
            data: this.generateData(20, {
              min: -30,
              max: 55
            })
          },
          {
            name: 'May',
            data: this.generateData(20, {
              min: -30,
              max: 55
            })
          },
          {
            name: 'Jun',
            data: this.generateData(20, {
              min: -30,
              max: 55
            })
          },
          {
            name: 'Jul',
            data: this.generateData(20, {
              min: -30,
              max: 55
            })
          },
          {
            name: 'Aug',
            data: this.generateData(20, {
              min: -30,
              max: 55
            })
          },
          {
            name: 'Sep',
            data: this.generateData(20, {
              min: -30,
              max: 55
            })
          }
        ],
          chart: {
          height: 350,
          type: 'heatmap',
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            radius: 0,
            useFillColorAsStroke: true,
            colorScale: {
              ranges: [{
                  from: -30,
                  to: 5,
                  name: 'low',
                  color: '#00A100'
                },
                {
                  from: 6,
                  to: 20,
                  name: 'medium',
                  color: '#128FD9'
                },
                {
                  from: 21,
                  to: 45,
                  name: 'high',
                  color: '#FFB200'
                },
                {
                  from: 46,
                  to: 55,
                  name: 'extreme',
                  color: '#FF0000'
                }
              ]
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 1
        },
        title: {
          text: 'HeatMap Chart with Color Range'
        },
    };

    this.renderChart('#chart-users', optionsUsers);
    this.renderChart('#chart-access', optionsAccess);
    this.renderChart('#chart-posts', options_posts);
  }

  /**
   * Converte objeto de meses para array ordenado (janeiro a dezembro)
   * Exemplo: { janeiro: 4, fevereiro: 0, ... } -> [4, 0, ...]
   */
  private convertMonthsObjectToArray(monthsObject: any): number[] {
    if (!monthsObject || typeof monthsObject !== 'object') {
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    const monthOrder = [
      'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    return monthOrder.map(month => monthsObject[month] || 0);
  }

  private renderChart(selector: string, options: ApexCharts.ApexOptions) {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = ''; // evita duplicações
      const chart = new ApexCharts(element, options);
      chart.render();
    }
  }

  isDarkTheme = true;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-mode', this.isDarkTheme);
    this.renderCharts();
  }

  private generateData(count: number, { min, max }: { min: number; max: number }) {
    return Array.from({ length: count }).map((_, i) => ({
      x: `W${i + 1}`,
      y: Math.floor(Math.random() * (max - min + 1)) + min
    }));
  }
  
  getDataDashboard() {
    this.dashBoardService.getDashboardData().subscribe((response:any) => {
      console.log(response.data[0]);
      const data = response.data[0];
      
      this.totalArtigos = data.numberArticlesRegistered;
      this.totalUsuariosRegistrados = data.numberUsersRegistered;
      this.totalEventos = data.numberEventsRegistered;
      
      // Filtrar acessos por actionType: 'page_view' para acessos ao site
      if (data.numberAcessesRegistered && Array.isArray(data.numberAcessesRegistered)) {
        this.totalAcessosSite = data.numberAcessesRegistered.filter(
          (access: any) => access.actionType === 'page_view'
        ).length;
      } else {
        this.totalAcessosSite = 0;
      }
      
      // Filtrar acessos por actionType: 'login' para acessos à plataforma
      if (data.numberAcessesRegistered && Array.isArray(data.numberAcessesRegistered)) {
        this.totalAcessosPlataforma = data.numberAcessesRegistered.filter(
          (access: any) => access.actionType === 'login'
        ).length;
      } else {
        this.totalAcessosPlataforma = 0;
      }
      
      this.acessosPorMes = data.numberAcessesByMonth || {};
      this.acessosUsuariosPorMes = data.numberAcessesByMonthUsers || {};
      
      // Renderizar gráficos após receber os dados
      this.renderCharts();
    });
  }
}
