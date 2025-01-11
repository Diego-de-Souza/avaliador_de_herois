import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';
import { HeaderPlatformComponent } from '../../../components/header-platform/header-platform.component';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [HeaderPlatformComponent],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent implements OnInit{
  public users: any[] = [];
  
    constructor(private userService: UserService, private router: Router){}
  
    ngOnInit(): void {
        this.loadTeams();
    }
  
    loadTeams(): void {
      this.userService.getAllUsers().subscribe({
        next: (data)=>{
          console.log(data);
          this.users = data.dadosUsers;
        },error: (error)=>{
          console.error("Error ao carregar as Equipes", error);
        }
      })
    }
  
    deleteUser(id:number): void{
      if(confirm('Tem certeza que deseja excluir esta Equipe?')){
        this.userService.deleteoneUser(id).subscribe({
          next: ()=>{
            this.loadTeams();
          }, error: (error)=>{
            console.error("Erro ao excluir a Equipe", error);
          }
        })
      }
    }
  
    editUser(id: number): void {
      this.router.navigate([`/update/user/${id}`]);
    }
}
