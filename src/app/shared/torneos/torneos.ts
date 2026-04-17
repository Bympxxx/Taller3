import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Agregado DatePipe
import { TorneoService } from '../../service/torneoService';
import { Torneo } from '../../models/torneo.models';

@Component({
  selector: 'app-torneos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './torneos.html',
  styleUrl: './torneos.css'
})
export class Torneos implements OnInit {
  torneos: Torneo[] = [];
  filtro: string = 'TODOS';

  constructor(private torneoService: TorneoService) {}

  ngOnInit(): void {
    this.cargarTorneos();
  }

  cargarTorneos(): void {
    // Corregido: Definir tipo (data: Torneo[]) para eliminar error TS7006
    this.torneoService.getAll().subscribe((data: Torneo[]) => {
      this.torneos = data;
    });
  }

  // Solución: Función que faltaba en el HTML
  badgeColor(estado: string): string {
    switch (estado) {
      case 'PROXIMO': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'ACTIVO': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'FINALIZADO': return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default: return 'bg-white/10 text-white';
    }
  }

  get torneosFiltrados(): Torneo[] {
    if (this.filtro === 'TODOS') return this.torneos;
    return this.torneos.filter(t => t.estado === this.filtro);
  }
}