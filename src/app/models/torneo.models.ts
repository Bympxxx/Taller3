export interface Torneo {
  id?: number;
  nombre: string;
  descripcion: string;
  juego: string;
  imagen: string;
  fechaInicio: string;
  fechaFin: string;
  maxParticipantes: number;
  premioPrincipal: number;
  estado: 'PROXIMO' | 'ACTIVO' | 'FINALIZADO';
}