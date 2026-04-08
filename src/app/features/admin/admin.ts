import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamesService } from '../../service/games';
import { Game } from '../../models/game.models';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private gamesService = inject(GamesService);

  games = signal<Game[]>([]);
  loading = signal(false);
  editando = signal(false);
  guardando = signal(false);
  dirty = false;
  gameForm: Partial<Game> = this.formVacio();

  formVacio(): Partial<Game> {
    return {
      titulo: '',
      genero: '',
      platform: '',
      descripcion: '',
      precio: 0,
      rating: 0,
      releaseYear: new Date().getFullYear(),
      imagen: '',
      stock: 0
    };
  }

  ngOnInit() {
    this.cargarJuegos();
  }

  cargarJuegos() {
    this.loading.set(true);
    this.gamesService.getAll().subscribe({
      next: g => { this.games.set(g); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  abrirEditar(game: Game) {
    this.gameForm = { ...game };
    this.editando.set(true);
    this.dirty = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.gameForm = this.formVacio();
    this.editando.set(false);
    this.dirty = false;
  }

  guardar() {
    this.guardando.set(true);
    const game = this.gameForm as Game;

    const req = this.editando()
      ? this.gamesService.update(game.id!, game)
      : this.gamesService.create(game);

    req.subscribe({
      next: () => {
        this.cargarJuegos();
        this.cancelarEdicion();
        this.guardando.set(false);
        this.dirty = false;
      },
      error: () => this.guardando.set(false)
    });
  }

  onFormChange() {
    this.dirty = true;
  }

  eliminar(game: Game) {
    if (!confirm(`¿Eliminar "${game.titulo}"?`)) return;
    this.gamesService.delete(game.id!).subscribe({
      next: () => this.cargarJuegos()
    });
  }
}
