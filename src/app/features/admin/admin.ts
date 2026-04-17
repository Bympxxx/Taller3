import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Game } from '../../models/game.models';
import { Torneo } from '../../models/torneo.models';
import { GamesService } from '../../service/games';
import { TorneoService } from '../../service/torneoService';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html'
})
export class AdminComponent implements OnInit {

  games        = signal<Game[]>([]);
  loading      = signal<boolean>(false);
  editando     = signal<boolean>(false);
  guardando    = signal<boolean>(false);

  gameForm: Game = this.reiniciarGameForm();

  fieldsGames: { key: keyof Game; label: string; type?: string }[] = [
    { key: 'titulo',      label: 'Título' },
    { key: 'imagen',      label: 'URL Imagen' },
    { key: 'genero',      label: 'Género' },
    { key: 'platform',    label: 'Plataforma' },
    { key: 'precio',      label: 'Precio',       type: 'number' },
    { key: 'rating',      label: 'Rating',        type: 'number' },
    { key: 'stock',       label: 'Stock',         type: 'number' },
    { key: 'releaseYear', label: 'Año lanzamiento', type: 'number' }
  ];


  torneos        = signal<Torneo[]>([]);
  loadingTorneos = signal<boolean>(false);
  editandoTorneo = signal<boolean>(false);
  guardandoTorneo = signal<boolean>(false);

  torneoForm: Torneo = this.reiniciarTorneoForm();

  fieldsTorneos: { key: keyof Torneo; label: string; type?: string }[] = [
    { key: 'nombre',          label: 'Nombre' },
    { key: 'juego',           label: 'Juego' },
    { key: 'fechaInicio',     label: 'Inicio',  type: 'date' },
    { key: 'fechaFin',        label: 'Fin',     type: 'date' },
    { key: 'maxParticipantes',label: 'Cupos',   type: 'number' },
    { key: 'premioPrincipal', label: 'Premio',  type: 'number' },
    { key: 'imagen',          label: 'URL Imagen' }
  ];

  constructor(
    private gamesService: GamesService,
    private torneoService: TorneoService
  ) {}

  ngOnInit() {
    this.cargarGames();
    this.cargarTorneos();
  }

  reiniciarGameForm(): Game {
    return { titulo: '', precio: 0, descripcion: '', imagen: '', genero: '', stock: 0, rating: 0, platform: '', releaseYear: 0 };
  }

  cargarGames() {
    this.loading.set(true);
    this.gamesService.getAll().subscribe({
      next: (data) => { this.games.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  guardar() {
    this.guardando.set(true);
    const payload: Game = {
      ...this.gameForm,
      precio:      Number(this.gameForm.precio),
      stock:       Number(this.gameForm.stock),
      rating:      Number(this.gameForm.rating),
      releaseYear: Number(this.gameForm.releaseYear)
    };

    const request = this.editando()
      ? this.gamesService.update(this.gameForm.id!, payload)
      : this.gamesService.create(payload);

    request.subscribe({
      next: () => { this.cargarGames(); this.cancelarEdicion(); this.guardando.set(false); },
      error: (err) => { console.error('Error:', err.error); this.guardando.set(false); }
    });
  }

  abrirEditar(g: Game) {
    this.gameForm = { ...g };
    this.editando.set(true);
  }

  eliminar(g: Game) {
    if (confirm(`¿Eliminar ${g.titulo}?`)) {
      this.gamesService.delete(g.id!).subscribe(() => this.cargarGames());
    }
  }

  cancelarEdicion() {
    this.editando.set(false);
    this.gameForm = this.reiniciarGameForm();
  }

  reiniciarTorneoForm(): Torneo {
    return { nombre: '', descripcion: '', juego: '', imagen: '', fechaInicio: '', fechaFin: '', maxParticipantes: 0, premioPrincipal: 0, estado: 'ACTIVO' };
  }

  cargarTorneos() {
    this.loadingTorneos.set(true);
    this.torneoService.getAll().subscribe({
      next: (data) => { this.torneos.set(data); this.loadingTorneos.set(false); },
      error: () => this.loadingTorneos.set(false)
    });
  }

  guardarTorneo() {
    this.guardandoTorneo.set(true);
    const payload: Torneo = {
      ...this.torneoForm,
      maxParticipantes: Number(this.torneoForm.maxParticipantes),
      premioPrincipal:  Number(this.torneoForm.premioPrincipal)
    };

    const request = this.editandoTorneo()
      ? this.torneoService.update(this.torneoForm.id!, payload)
      : this.torneoService.create(payload);

    request.subscribe({
      next: () => { this.cargarTorneos(); this.cancelarEdicionTorneo(); this.guardandoTorneo.set(false); },
      error: (err) => { console.error('Error:', err.error); this.guardandoTorneo.set(false); }
    });
  }

  abrirEditarTorneo(t: Torneo) {
    this.torneoForm = { ...t };
    this.editandoTorneo.set(true);
  }

  eliminarTorneo(t: Torneo) {
    if (confirm(`¿Eliminar ${t.nombre}?`)) {
      this.torneoService.delete(t.id!).subscribe(() => this.cargarTorneos());
    }
  }

  cancelarEdicionTorneo() {
    this.editandoTorneo.set(false);
    this.torneoForm = this.reiniciarTorneoForm();
  }
}