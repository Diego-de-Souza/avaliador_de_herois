import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroisService } from '../../../../core/service/herois/herois.service';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { StudioService } from '../../../../core/service/studios/studio.service';
import { Quiz } from '../../../../core/interface/studio.interface';
import { TeamService } from '../../../../core/service/team/team.service';
import { Team } from '../../../../core/interface/team.interface';
import { GENRE_OPTIONS } from '../../../../core/enums/genre.enum';
import { ImageService } from '../../../../core/service/image/image.service';

@Component({
  selector: 'app-cadastro-dados',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, HeaderPlatformComponent],
  templateUrl: './cadastro-dados.component.html',
  styleUrl: './cadastro-dados.component.css'
})
export class CadastroDadosComponent implements OnInit, OnDestroy {
  private readonly studioService = inject(StudioService);
  private readonly teamService = inject(TeamService);
  private readonly fb = inject(FormBuilder);
  private readonly searchHerois = inject(HeroisService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly imageService = inject(ImageService);
  private destroy$ = new Subject<void>();

  public cadastroDados!: FormGroup;
  public studio_id: Quiz[] = [];
  public team_id: Team[] = [];
  public isSubmitting = false;
  public isEditMode = false;
  public heroId: string | null = null;

  public faUser = faUser;

  public imagemCardUrl: string | null = null;
  public imagemCoverUrl: string | null = null;

  public showPopup = false;

  public genreOptions = GENRE_OPTIONS;

  ngOnInit(): void {
    this.initializeForm();

    this.studioService.getAllStudios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => { this.studio_id = response.data; },
        error: (error) => console.error('Erro ao buscar estúdios:', error)
      });

    this.teamService.getAllTeams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => { this.team_id = response.data; },
        error: (error) => console.error('Erro ao buscar equipes:', error)
      });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.heroId = idParam;
        console.log(this.heroId);
        this.isEditMode = true;
        this.loadHeroForEdit(this.heroId);
      }
    });
  }

  private loadHeroForEdit(id: string): void {
    this.searchHerois.getDataHero(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        const data = response.dataUnit ?? response;
        const studioId = data.studio?.id ?? data.studio_id;
        const teamId = data.team?.id ?? data.team_id;
        const releaseDate = data.release_date ?? data.release_data ?? '';

        const imgCard = data.image1 ?? data.imagem;
        const imgCover = data.image2 ?? data.imagem_cover;
        this.imagemCardUrl = imgCard ? this.imageService.processImageField(imgCard, 'image/jpeg') : null;
        this.imagemCoverUrl = imgCover ? this.imageService.processImageField(imgCover, 'image/png') : null;

        this.cadastroDados.patchValue({
          name: data.name ?? '',
          morality: data.morality ?? '',
          studio_id: studioId ?? null,
          power_type: data.power_type ?? '',
          release_date: releaseDate ? this.formatDateForInput(releaseDate) : '',
          first_appearance: data.first_appearance ?? '',
          creator: data.creator ?? '',
          weak_point: data.weak_point ?? '',
          team_id: teamId ?? null,
          affiliation: data.affiliation ?? '',
          story: data.story ?? '',
          genre: data.genre ?? '',
          imagem: this.imagemCardUrl ?? '',
          imagem_cover: this.imagemCoverUrl ?? ''
        });
      },
      error: (error) => console.error('Erro ao carregar herói:', error)
    });
  }

  private formatDateForInput(value: string | Date): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
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
    if (!this.cadastroDados.valid || this.isSubmitting) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.heroId) {
      this.updateHero();
    } else {
      this.createHero();
    }
  }

  private createHero(): void {
    const formData = new FormData();
    const value = this.cadastroDados.value;

    Object.keys(value).forEach((key) => {
      if (key !== 'imagem' && key !== 'imagem_cover') {
        const val = value[key];
        if (val !== null && val !== undefined) {
          formData.append(key, String(val));
        }
      }
    });

    const imagemCard = value.imagem;
    const imagemCover = value.imagem_cover;
    if (imagemCard instanceof File) formData.append('imagens', imagemCard);
    if (imagemCover instanceof File) formData.append('imagens', imagemCover);

    this.searchHerois.heroRecord(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.showPopup = true;
        setTimeout(() => { this.showPopup = false; }, 3000);
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Erro ao cadastrar herói:', error);
        this.isSubmitting = false;
      }
    });
  }

  private updateHero(): void {
    const value = this.cadastroDados.value;
    const buildPayload = (imgCard: string, imgCover: string) => {
      const payload: Record<string, unknown> = {
        name: value.name,
        morality: value.morality,
        studio_id: value.studio_id,
        power_type: value.power_type,
        release_date: value.release_date,
        first_appearance: value.first_appearance,
        creator: value.creator,
        weak_point: value.weak_point,
        team_id: value.team_id,
        affiliation: value.affiliation,
        story: value.story,
        genre: value.genre
      };
      if (imgCard) payload['image1'] = imgCard;
      if (imgCover) payload['image2'] = imgCover;
      return payload;
    };

    const imgCard = value.imagem;
    const imgCover = value.imagem_cover;

    const toBase64 = (f: File): Promise<string> =>
      new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.readAsDataURL(f);
      });

    const cardPromise = imgCard instanceof File ? toBase64(imgCard) : Promise.resolve(typeof imgCard === 'string' ? imgCard : '');
    const coverPromise = imgCover instanceof File ? toBase64(imgCover) : Promise.resolve(typeof imgCover === 'string' ? imgCover : '');

    Promise.all([cardPromise, coverPromise]).then(([c, cv]) => {
      this.doUpdate(buildPayload(c, cv));
    });
  }

  private doUpdate(payload: Record<string, unknown>): void {
    if (!this.heroId) return;
    this.searchHerois.putUpdateHero(this.heroId, payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.showPopup = true;
        setTimeout(() => {
          this.showPopup = false;
          this.router.navigate(['/plataforma/view/view-heroes']);
        }, 3000);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Erro ao atualizar herói:', error);
        this.isSubmitting = false;
      }
    });
  }

  private resetForm(): void {
    this.cadastroDados.reset();
    this.imagemCardUrl = null;
    this.imagemCoverUrl = null;
    this.isEditMode = false;
    this.heroId = null;
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.cadastroDados.controls).forEach(key => {
      this.cadastroDados.get(key)?.markAsTouched();
    });
  }
}
