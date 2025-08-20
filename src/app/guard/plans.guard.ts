import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../core/service/auth/auth.service";
import { inject } from "@angular/core";

export const plansGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
      
    const accessToken = sessionStorage.getItem('access_token');
    
    if (!accessToken) {
        console.error('Acesso negado: Usuário não logado para acessar o conteúdo.');
        
        // Mostrar alerta informativo
        showSubscriptionAlert();
        
        // Redirecionar para página de planos
        router.navigate(['/shopping/plans'], { queryParams: { returnUrl: state.url } });
        return false;
    }
    
    try {
        const dataUser = authService.decodeJwt(accessToken);
        return true;
    } catch (error) {
        console.error('Token inválido:', error);
        sessionStorage.removeItem('access_token');
        
        // Mostrar alerta para token inválido
        showInvalidTokenAlert();
        
        router.navigate(['/login']);
        return false;
    }
}

// Função para mostrar alerta de assinatura necessária
function showSubscriptionAlert(): void {
    // Opção 1: Alert simples do navegador
    alert('🦸‍♂️ Para acessar esta funcionalidade é necessário ter uma assinatura ativa!\n\nEscolha um plano e desperte o herói que existe em você!');
    
    // Opção 2: Você pode usar um modal mais sofisticado se tiver
    // showCustomModal();
}

// Função para mostrar alerta de token inválido
function showInvalidTokenAlert(): void {
    alert('⚠️ Sua sessão expirou!\n\nPor favor, faça login novamente para continuar.');
}

// Opção 2: Se quiser usar um modal customizado, adicione esta função
function showCustomModal(): void {
    // Criar modal dinamicamente
    const modal = document.createElement('div');
    modal.className = 'subscription-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🦸‍♂️ Assinatura Necessária</h2>
                </div>
                <div class="modal-body">
                    <p>Para acessar esta funcionalidade incrível, você precisa ter uma assinatura ativa!</p>
                    <p><strong>Desperte o herói que existe em você!</strong></p>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="this.closest('.subscription-modal').remove()">
                        Ver Planos
                    </button>
                    <button class="btn-secondary" onclick="this.closest('.subscription-modal').remove()">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar estilos inline para o modal
    const style = document.createElement('style');
    style.textContent = `
        .subscription-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background: #1e1e1e;
            color: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 210, 255, 0.3);
            border: 2px solid #00d2ff;
        }
        
        .modal-header h2 {
            margin: 0 0 1rem 0;
            color: #00d2ff;
        }
        
        .modal-body p {
            margin: 0.5rem 0;
        }
        
        .modal-actions {
            margin-top: 1.5rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        .btn-primary {
            background: linear-gradient(45deg, #00d2ff, #ff0080);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .btn-secondary {
            background: transparent;
            color: #ccc;
            border: 1px solid #666;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 210, 255, 0.4);
        }
        
        .btn-secondary:hover {
            border-color: #999;
            color: white;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Remover modal após 10 segundos
    setTimeout(() => {
        if (document.body.contains(modal)) {
            modal.remove();
            style.remove();
        }
    }, 10000);
}