import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { HeroisService } from '../../../../core/service/herois/herois.service';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { StudioService } from '../../../../core/service/studios/studio.service';
import { Quiz } from '../../../../core/interface/studio.interface';
import { TeamService } from '../../../../core/service/team/team.service';
import { Team } from '../../../../core/interface/team.interface';
import { GENRE_OPTIONS } from '../../../../core/enums/genre.enum';

@Component({
  selector: 'app-cadastro-dados',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, HeaderPlatformComponent],
  templateUrl: './cadastro-dados.component.html',
  styleUrl: './cadastro-dados.component.css'
})
export class CadastroDadosComponent implements OnInit, OnDestroy {
  private studioService = inject(StudioService);
  private teamService = inject(TeamService);
  private fb = inject(FormBuilder);
  private searchHerois = inject(HeroisService);
  private destroy$ = new Subject<void>(); // Adicionado para cleanup

  public cadastroDados!: FormGroup;
  public studio_id: Quiz[] = [];
  public team_id: Team[] = [];
  public isSubmitting = false;

  public faUser = faUser;

  public imagemCardUrl: string | null = null;
  public imagemCoverUrl: string | null = null;

  public showPopup: boolean = false;

  public genreOptions = GENRE_OPTIONS;

  constructor() {}

  ngOnInit(): void {
    // Corrigido: Adicionado tratamento completo de erros
    this.studioService.getAllStudios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {this.studio_id = response.data
        },
        error: (error) => {
          console.error('Erro ao buscar estúdios:', error);
        }
      });

    this.teamService.getAllTeams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.team_id = response.data;
        },
        error: (error) => {
          console.error('Erro ao buscar equipes:', error);
        }
      });

    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.cadastroDados = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      morality: ['', [Validators.required, Validators.minLength(3)]],
      studio_id: [null, [Validators.required]],
      power_type: ['', [Validators.required, Validators.minLength(5)]],
      release_date: ['', [Validators.required, this.validarDataCompleta()]],
      first_appearance: ['', [Validators.required, Validators.minLength(10)]],
      creator: ['', [Validators.required, Validators.minLength(3)]],
      weak_point: ['', [Validators.required, Validators.minLength(3)]],
      imagem: ['', [Validators.required]],
      imagem_cover: ['', [Validators.required]],
      team_id: [null, [Validators.required]],
      affiliation: ['', [Validators.required, Validators.minLength(3)]],
      story: ['', [Validators.required, Validators.minLength(10)]],
      genre: ['', [Validators.required]] // Removido minLength para select
    });
  }

  private validarDataCompleta() {
    return (control: any) => {
      const data = control.value;
      if (!data) {
        return null; // Deixar Validators.required lidar com isso
      }

      const dataObj = new Date(data);
      const hoje = new Date();

      if (isNaN(dataObj.getTime())) {
        return { dataInvalida: true };
      }

      if (dataObj > hoje) {
        return { dataFutura: true };
      }

      return null;
    };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.cadastroDados.get(field);
    return control ? !control.valid && control.touched : false;
  }

  onFileSelected(event: Event, tipo: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        console.error('Tipo de arquivo não permitido');
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        console.error('Arquivo muito grande');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (tipo === 'imagem') {
          this.imagemCardUrl = e.target.result;
          this.cadastroDados.patchValue({ imagem: file });
        } else if (tipo === 'imagem_cover') {
          this.imagemCoverUrl = e.target.result;
          this.cadastroDados.patchValue({ imagem_cover: file });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.cadastroDados.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = new FormData();

      Object.keys(this.cadastroDados.value).forEach((key) => {
        if (key !== 'imagem' && key !== 'imagem_cover') {
          const value = this.cadastroDados.get(key)?.value;
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
      });

      const imagemCard = this.cadastroDados.get('imagem')?.value;
      const imagemCover = this.cadastroDados.get('imagem_cover')?.value;
      
      if (imagemCard) {
        formData.append('imagens', imagemCard);
      }
      if (imagemCover) {
        formData.append('imagens', imagemCover);
      }

      this.searchHerois.heroRecord(formData).subscribe({
        next: (response) => {
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
          }, 3000);
          
          this.resetForm();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Erro na requisição: ', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private resetForm(): void {
    this.cadastroDados.reset();
    this.imagemCardUrl = null;
    this.imagemCoverUrl = null;
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.cadastroDados.controls).forEach(key => {
      this.cadastroDados.get(key)?.markAsTouched();
    });
  }
}