import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../core/service/auth/auth.service";
import { ToastService } from "../core/service/toast/toast.service";

export const GameGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    try{
        const dataUser = authService.getUser();
        if(!dataUser){
            console.error('Acesso negado: Usuário não logado para acessar jogo.');
            toastService.error('Acesso negado: Usuário não logado para acessar jogo. Faça login para continuar.', 'Erro no Acesso', { duration: 8000 });
            router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        return true;
    }catch(error){
        console.error('Token inválido:', error);
        sessionStorage.removeItem('access_token');
        router.navigate(['/login']);
        return false;
    }
}