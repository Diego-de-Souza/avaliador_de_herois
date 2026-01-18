import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EmailRequest {
  to: string | string[];
  subject: string;
  template?: string;
  templateData?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string;
    contentType?: string;
  }>;
}

export interface EmailResponse {
  status: number;
  message: string;
  messageId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiURL}/email`;

  sendEmail(emailData: EmailRequest): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(`${this.apiUrl}/send`, emailData);
  }

  sendNotificationEmail(
    to: string,
    notification: {
      title: string;
      message: string;
      type: string;
      link?: string;
    }
  ): Observable<EmailResponse> {
    return this.sendEmail({
      to,
      subject: notification.title,
      template: 'notification',
      templateData: {
        title: notification.title,
        message: notification.message,
        type: notification.type,
        link: notification.link || `${window.location.origin}/webmain/client-area`
      }
    });
  }

  sendSACTicketEmail(
    to: string,
    ticket: {
      ticket_number: string;
      subject: string;
      message: string;
      type: string;
    }
  ): Observable<EmailResponse> {
    return this.sendEmail({
      to,
      subject: `Ticket #${ticket.ticket_number} - ${ticket.subject}`,
      template: 'sac_ticket',
      templateData: {
        ticket_number: ticket.ticket_number,
        subject: ticket.subject,
        message: ticket.message,
        type: ticket.type,
        link: `${window.location.origin}/webmain/client-area/sac`
      }
    });
  }

  sendSACResponseEmail(
    to: string,
    ticket: {
      ticket_number: string;
      subject: string;
      response: string;
      author: string;
    }
  ): Observable<EmailResponse> {
    return this.sendEmail({
      to,
      subject: `Resposta ao Ticket #${ticket.ticket_number}`,
      template: 'sac_response',
      templateData: {
        ticket_number: ticket.ticket_number,
        subject: ticket.subject,
        response: ticket.response,
        author: ticket.author,
        link: `${window.location.origin}/webmain/client-area/sac`
      }
    });
  }
}
