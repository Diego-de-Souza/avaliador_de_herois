import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GamesHttpService } from '../../../../core/service/http/game-http.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderPlatformComponent, ReactiveFormsModule, ModalSucessoCadastroComponent],
  templateUrl: './cadastro-games.html',
  styleUrl: './cadastro-games.css'
})
export class Games implements OnInit {
  public gamesForm: FormGroup;
  public isEditMode: boolean = false;
  public gameId: number | null = null;
  public showModal = false;
  public modalTitle: string = '';
  public modalMessage: string = '';
  public imagePreview: string | null = null;
  public imageError: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private gamesHttpService: GamesHttpService,
    private readonly router: Router
  ) {
    this.gamesForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      link: ['', [Validators.required, Validators.pattern(/^\/[a-zA-Z0-9\/-]+$/)]],
      icon: [''],
      type: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.gameId = Number(idParam);
        this.isEditMode = true;
        this.gamesHttpService.getGameById(this.gameId).subscribe((response: any) => {
          if (response?.data || response?.dataUnit) {
            const gameData = response.data || response.dataUnit;
            this.gamesForm.patchValue({
              name: gameData.name || '',
              description: gameData.description || '',
              link: gameData.link || '',
              type: gameData.type || ''
            });
            if (gameData.icon) {
              this.imagePreview = gameData.icon;
              this.gamesForm.patchValue({ icon: gameData.icon });
            }
          }
        });
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.gamesForm.get(field);
    return control ? !control.valid && control.touched : false;
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    this.imageError = '';

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.imageError = 'Apenas imagens JPG, PNG ou GIF são permitidas.';
      return;
    }

    // Validar tamanho (máximo 500KB)
    const maxSize = 500 * 1024; // 500KB
    if (file.size > maxSize) {
      this.imageError = 'A imagem deve ter no máximo 500KB.';
      return;
    }

    // Validar dimensões (64x64)
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e: any) => {
      img.src = e.target.result;
      img.onload = () => {
        if (img.width !== 64 || img.height !== 64) {
          this.imageError = 'A imagem deve ter exatamente 64x64 pixels.';
          return;
        }
        this.imagePreview = e.target.result;
        this.gamesForm.patchValue({ icon: e.target.result });
      };
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.gamesForm.valid) {
      const gameData = {
        ...this.gamesForm.value
      };
      
      // Log para debug (pode remover depois)
      console.log('Dados do formulário:', gameData);

      if (this.isEditMode) {
        this.gamesHttpService.updateGame(this.gameId!, gameData).subscribe(
          (response: any) => {
            if (response.status === 404) {
              this.modalTitle = 'Atualização de Game';
              this.modalMessage = response.message;
              this.showModal = true;
            }
            if (response.status === 200) {
              this.modalTitle = 'Atualização de Game';
              this.modalMessage = 'Game atualizado com sucesso!';
              this.showModal = true;
            }
          },
          (error: any) => {
            console.log('Erro ao atualizar o game:', error);
            this.modalTitle = 'Atualização de Game';
            this.modalMessage = 'Erro ao atualizar o game. Tente novamente.';
            this.showModal = true;
          }
        );
      } else {
        this.gamesHttpService.createGame(gameData).subscribe(
          (response: any) => {
            if (response.status === 409) {
              this.modalTitle = 'Cadastro de Game';
              this.modalMessage = response.message;
              this.showModal = true;
            }
            if (response.status === 201) {
              this.modalTitle = 'Cadastro de Game';
              this.modalMessage = 'Game cadastrado com sucesso!';
              this.showModal = true;
              this.router.navigate(['/plataforma/view/view-games']);
            }
          },
          (error: any) => {
            console.log('Erro ao cadastrar game:', error);
            this.modalTitle = 'Cadastro de Game';
            this.modalMessage = 'Erro ao cadastrar o game. Tente novamente.';
            this.showModal = true;
          }
        );
      }
    } else {
      return;
    }
  }

  onCancel() {
    const confirmCancel = confirm('Tem certeza que deseja cancelar?');
    if (confirmCancel) {
      this.clearForm();
    }
  }

  clearForm() {
    this.gamesForm.reset();
    this.isEditMode = false;
    this.gameId = null;
    this.imagePreview = null;
    this.imageError = '';
  }

  closeModal() {
    this.showModal = false;
  }
}
