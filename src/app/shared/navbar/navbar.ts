import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../service/authService';
import { User } from '../../models/usuarios.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  menuOpen = false;
  currentUser: User | null = null;

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  usuarioLogueado(): boolean {
    return this.authService.isLoggedIn();
  }

  esAdmin(): boolean {
    return this.currentUser?.rol === 'ADMIN';
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}
