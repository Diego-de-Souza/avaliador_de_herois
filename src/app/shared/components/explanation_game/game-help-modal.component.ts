import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { GAME_SECTIONS, CLASSES_INFO, ELEMENTAL_INFO } from '../../../data/explanation_game_heroes_battle';
import { GameSection, ClassInfo, ElementalInfo } from '../../../core/interface/explanation_game_heroes_battle.interface';

@Component({
  selector: 'app-game-help-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-help-modal.component.html',
  styleUrls: ['./game-help-modal.component.css']
})
export class GameHelpModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  private readonly themeService = inject(ThemeService);
  public _themeService = 'dark';

  public sections = GAME_SECTIONS;
  public classesInfo = CLASSES_INFO;
  public elementalInfo = ELEMENTAL_INFO;
  public activeSection = 'overview';

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this._themeService = theme;
    });
  }

  close() {
    this.closeModal.emit();
  }

  selectSection(sectionId: string) {
    this.activeSection = sectionId;
  }

  getActiveSection(): GameSection | undefined {
    return this.sections.find(section => section.id === this.activeSection);
  }
}