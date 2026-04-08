import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/authService';
import { User } from '../models/usuarios.models';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map((user: User | null) => {
      if (user) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};

export const adminGuard: CanActivateFn = () => {
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
