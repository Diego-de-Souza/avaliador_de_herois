import { Component } from '@angular/core';
import ApexCharts from 'apexcharts'
import { HeaderPlatformComponent } from '../../../components/header-platform/header-platform.component';

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [HeaderPlatformComponent],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent {
  totalUsuarios = 1240;
  totalAcessos = 8930;
  totalArtigos = 348;

  ngOnInit() {
    this.renderCharts();
  }

  renderCharts() {
    const options: ApexCharts.ApexOptions = {
      chart: { type: 'area' },
      series: [{ name: 'Usuários', data: [10, 20, 15, 30, 45, 60, 80] }],
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
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

    this.renderChart('#chart-users', options);
    this.renderChart('#chart-access', options);
    this.renderChart('#chart-posts', options_posts);
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
  
}
