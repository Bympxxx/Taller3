import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/authService';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMsg = '';
  loading = false;
  showPassword = false;

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor completa todos los campos.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    try {
      const result = await firstValueFrom(
        this.authService.login(this.email, this.password).pipe(
          catchError(err => throwError(() => ({ code: this.mapHttpError(err) })))
        )
      );
      this.authService.setCurrentUser(result);
      this.router.navigate(['/tienda']);
    } catch (error: any) {
      this.errorMsg = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  private mapHttpError(err: any): string {
    if (err.status === 0) return 'No conectado al servidor.';
    if (err.status === 401) return 'auth/wrong-password';
    if (err.status === 404) return 'auth/user-not-found';
    if (err.status >= 400) return 'auth/invalid-credential';
    return 'unknown';
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found': return 'Usuario no encontrado.';
      case 'auth/wrong-password': return 'Contraseña incorrecta.';
      case 'auth/invalid-email': return 'Email inválido.';
      case 'auth/invalid-credential': return 'Credenciales incorrectas.';
      case 'auth/too-many-requests': return 'Demasiados intentos. Intenta más tarde.';
      default: return 'Error al iniciar sesión. Verifica consola.';
    }
  }
}
