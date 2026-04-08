import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../service/authService';
import { User } from '../models/usuarios.models';
import { map, take } from 'rxjs/operators';

export const canMatchGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map((user: User | null) => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }
      if (user.rol === 'ADMIN') return true;  
      router.navigate(['/']);
      return false;
    })
  );
};