import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-modal-qrcode',
  imports: [CommonModule],
  templateUrl: './modal-qrcode.html',
  styleUrl: './modal-qrcode.css'
})
export class ModalQrcode implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);
  @Input() modalTitle: string = '';
  @Input() modalMessage: string = '';
  @Input() qrCodeUrl: string = '';
  @Output() closeModalEvent = new EventEmitter<void>();
  public _themeModal = 'dark';

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this._themeModal = theme;
    });
  }

  closeModalClick() {
    this.closeModalEvent.emit();
  }
}
