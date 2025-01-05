import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-curiosidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curiosidades.component.html',
  styleUrl: './curiosidades.component.css'
})
export class CuriosidadesComponent {
  public curiosidades =[
    {
      texto: "dfsdfsdf sdgsdgsdgsdfsdfs fsdfdsgsdsdf sdfsdfsdfsdf"
    },
    {
      texto: "dfsdfsdf sdgsdgsdgsdfsdfs fsdfdsgsdsdf sdfsdfsdfsdf"
    },
    {
      texto: "dfsdfsdf sdgsdgsdgsdfsdfs fsdfdsgsdsdf sdfsdfsdfsdf"
    }
  ]
}
