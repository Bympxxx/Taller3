import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { User } from '../models/usuarios.models';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private platformId: Object;

  constructor(
    private http: HttpClient,
    @Optional() @Inject(PLATFORM_ID) platformId?: Object
  ) {
    this.platformId = platformId || {};
    if (isPlatformBrowser(this.platformId)) {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        this.currentUserSubject.next(JSON.parse(usuarioGuardado));
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/usuarios/login`, { email, password });
  }

  setCurrentUser(usuario: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
    this.currentUserSubject.next(usuario);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuario');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('usuario');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
