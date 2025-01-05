import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-artigos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artigos.component.html',
  styleUrl: './artigos.component.css'
})
export class ArtigosComponent {
  public artigos = [
    {
      img: "teste",
      titulo: "teste",
      descricao: "sndjkskdjbbsdkjfbsjkdfjsf sjdfkjsbdfjks fjhsjkdfh sjhf jksh fjkshdkfjhsd jfhh  shdjfhskjhdfjkshdfjkshj fhjshdjfhskjd f"
    },
    {
      img: "teste2",
      titulo: "teste2",
      descricao: "sndjkskdjbbsdkjfbsjkdfjsf sjdfkjsbdfjks fjhsjkdfh sjhf jksh fjkshdkfjhsd jfhh  shdjfhskjhdfjkshdfjkshj fhjshdjfhskjd f2"
    },
    {
      img: "teste3",
      titulo: "teste3",
      descricao: "sndjkskdjbbsdkjfbsjkdfjsf sjdfkjsbdfjks fjhsjkdfh sjhf jksh fjkshdkfjhsd jfhh  shdjfhskjhdfjkshdfjkshj fhjshdjfhskjd f2"
    },
    {
      img: "teste4",
      titulo: "teste4",
      descricao: "sndjkskdjbbsdkjfbsjkdfjsf sjdfkjsbdfjks fjhsjkdfh sjhf jksh fjkshdkfjhsd jfhh  shdjfhskjhdfjkshdfjkshj fhjshdjfhskjd f2"
    },
    {
      img: "teste4",
      titulo: "teste4",
      descricao: "sndjkskdjbbsdkjfbsjkdfjsf sjdfkjsbdfjks fjhsjkdfh sjhf jksh fjkshdkfjhsd jfhh  shdjfhskjhdfjkshdfjkshj fhjshdjfhskjd f2"
    },
    {
      img: "teste4",
      titulo: "teste4",
      descricao: "sndjkskdjbbsdkjfbsjkdfjsf sjdfkjsbdfjks fjhsjkdfh sjhf jksh fjkshdkfjhsd jfhh  shdjfhskjhdfjkshdfjkshj fhjshdjfhskjd f2"
    }
  ]
}
