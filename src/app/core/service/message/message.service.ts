import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  currentMessage = new BehaviorSubject<any>(null);
  private apiUrl = environment.apiURL;

  constructor(private messaging: Messaging, private http: HttpClient) {
    this.requestPermission();
    this.receiveMessage();
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, { 
          vapidKey: 'BHCFudQpErY_P4n6Jn1jrecHCccGKNgXz5bd7Ajy6bkhyY-Gj30t8S5IrhtVEAD5pGM0VLrO_D8fGNvTUJHc6Zg' 
        });
        if (token) {
          console.log('Token recebido:', token);
          // Envie o token para seu backend para usar nas notificações
        } else {
          console.log('Token não disponível mesmo com permissão concedida.');
        }
      } else {
        console.log('Permissão para notificações negada pelo usuário.');
      }
    } catch (err) {
      console.error('Erro ao obter token', err);
    }
  }

  receiveMessage() {
    onMessage(this.messaging, (payload) => {
      console.log('Mensagem recebida:', payload);
      this.currentMessage.next(payload);
    });
  }

  async getToken(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, {
          vapidKey: 'BHCFudQpErY_P4n6Jn1jrecHCccGKNgXz5bd7Ajy6bkhyY-Gj30t8S5IrhtVEAD5pGM0VLrO_D8fGNvTUJHc6Zg'
        });
        return token;
      } else {
        console.warn('Permissão negada para notificações.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  }

  tokenGuard(data: FormData): Observable<ArrayBuffer> {
      return this.http.post<ArrayBuffer>(`${this.apiUrl}/fcm-token/register`, data);
  }

  public sendTokenToServer(token: string, user_id:number): void {
    const userId = user_id; 

    this.http.post<{ message: string }>(`${this.apiUrl}/fcm-token/register`, { userId, token })
      .subscribe(
        response => console.log('Token enviado para o servidor:', response),
        error => console.error('Erro ao enviar token para o servidor:', error)
      );
  }

  public sendMessage(data: any):void{
    console.log("mensagem na service")
    this.http.post<any>(`${this.apiUrl}/fcm-token/single`, data)
      .subscribe({
        next: (response) => {
          console.log('Resposta da API:', response);
        },
        error: (error) => {
          console.error('Erro ao enviar a mensagem:', error);
        }
      });
  }

}
