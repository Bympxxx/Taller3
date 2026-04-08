import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../service/authService';
import { UsersService } from '../../service/usuariosService';
import { User } from '../../models/usuarios.models';
import { firstValueFrom } from 'rxjs';

interface Plan {
  id: 'basic' | 'premium' | 'ultimate';
  name: string;
  price: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-suscripcion',
  imports: [CommonModule],
  templateUrl: './suscripcion.html',
  styleUrl: './suscripcion.css',
})
export class Suscripcion implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  selectedPlan = signal<Plan | null>(null);
  usuarioActual = signal<User | null>(null);
  suscrito = signal(false);

  juegosSemana = [
    { emoji: '🔫', nombre: 'Cyberpunk 2078', genero: 'RPG / Open World', plan: 'basic', descuento: null },
    { emoji: '⚔️', nombre: 'Shadow Realm', genero: 'Action RPG', plan: 'premium', descuento: 20 },
    { emoji: '🚀', nombre: 'StarVoid Online', genero: 'MMO / Sci-Fi', plan: 'premium', descuento: 15 },
    { emoji: '🏎️', nombre: 'NitroX Racing', genero: 'Racing / Arcade', plan: 'ultimate', descuento: 40 },
  ];

  plans = signal<Plan[]>([
    {
      id: 'basic',
      name: 'Basic',
      price: '$0',
      description: 'Perfecto para empezar',
      features: [
        '✓ 1 juego gratuito por mes',
        '✓ Comunidad Discord',
        '✓ Newsletter semanal',
        '✗ Descuentos semanales',
        '✗ Juegos exclusivos',
        '✗ Sin publicidad',
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      description: 'Experiencia completa',
      features: [
        '✓ Todo lo de Basic +',
        '✓ 20% descuento cada semana',
        '✓ 3 juegos exclusivos/mes',
        '✓ Sin publicidad',
        '✓ Sorteo semanal de juegos',
        '✗ Early access',
      ]
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: '$19.99',
      description: 'Domina sin límites',
      features: [
        '✓ Todo lo de Premium +',
        '✓ 40% descuento toda la semana',
        '✓ Early access 7 días antes',
        '✓ Juego AAA gratis/mes',
        '✓ Torneos exclusivos',
        '✓ Beta tester oficial',
      ]
    }
  ]);

  ngOnInit() {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.usuarioActual.set(user);
      if (user) {
        this.usersService.getAll().subscribe((usuarios: User[]) => {
          const found = usuarios.find(u => u.email === user.email);
          if (found) {
            this.usuarioActual.set(found);
            const planActual = this.plans().find(p => p.id === found.plan);
            if (planActual) this.selectedPlan.set(planActual);
          }
        });
      }
    });
  }

  selectPlan(plan: Plan) {
    this.selectedPlan.set(plan);
  }

  async subscribe() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selectedPlan()) {
      return;
    }

    const usuario = this.usuarioActual();
    if (!usuario?.id) return;

    await firstValueFrom(
      this.usersService.update(usuario.id, { plan: this.selectedPlan()!.id })
    );

    const usuarioActualizado: User = { ...usuario, plan: this.selectedPlan()!.id };
    this.authService.setCurrentUser(usuarioActualizado);
    this.usuarioActual.set(usuarioActualizado);

    this.suscrito.set(true);
    setTimeout(() => this.suscrito.set(false), 4000);
  }
}
