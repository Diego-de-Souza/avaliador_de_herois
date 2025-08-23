import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
    


  public processImageField(imageField: any, mimeType: string): string {
    if (typeof imageField === 'string') {
      return imageField;
    }
    if (imageField && imageField.data) {
      try {
        const uint8Array = new Uint8Array(imageField.data);
        const blob = new Blob([uint8Array], { type: mimeType });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('Erro ao converter buffer para imagem:', error);
        return '';
      }
    }
    return '';
  }
}