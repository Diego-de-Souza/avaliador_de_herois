import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { UserService } from '../../../../core/service/user/user.service';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [CommonModule, HeaderPlatformComponent],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent implements OnInit{
  private readonly userService = inject(UserService);
  
  public users = signal<any[]>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users.set(response.data);
      }
    });
  }

  deleteUser(id: number): void {}

  editUser(id: number): void {}
}
