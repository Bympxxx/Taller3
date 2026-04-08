import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GamesService } from '../../service/games';
import { AuthService } from '../../service/authService';
import { User } from '../../models/usuarios.models';
import { Game } from '../../models/game.models';

@Component({
  selector: 'app-catalogo-games',
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo-games.html',
  styleUrl: './catalogo-games.css'
})
export class CatalogoGames implements OnInit {
  private gamesService = inject(GamesService);
  private authService = inject(AuthService);

  games = signal<Game[]>([]);
  carrito = signal<Game[]>([]);
  historial = signal<Game[]>([]);
  usuario = signal<User | null>(null);
  carritoAbierto = signal(true);

  ngOnInit() {
    this.gamesService.getAll().subscribe({
      next: games => this.games.set(games),
      error: err => console.error('Error cargando games:', err)
    });

    this.authService.currentUser$.subscribe((user: User | null) => {
      this.usuario.set(user);
    });
  }

  agregar(game: Game) {
    if (!this.carrito().find(g => g.id === game.id)) {
      this.carrito.set([...this.carrito(), game]);
    }
  }

  quitar(game: Game) {
    this.carrito.set(this.carrito().filter(g => g.id !== game.id));
  }

  comprar() {
    if (!this.carrito().length) return;
    this.historial.set([...this.historial(), ...this.carrito()]);
    this.carrito.set([]);
  }

  get total() {
    return this.carrito().reduce((acc, g) => acc + (g.precio ?? 0), 0).toFixed(2);
  }

  get esAdmin(): boolean {
    return this.usuario()?.rol === 'ADMIN';
  }

  get planActual(): string {
    return this.esAdmin ? '👑 Admin' : '🎮 Gamer';
  }
}
