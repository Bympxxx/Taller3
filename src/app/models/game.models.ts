export interface Game {
  id?: number;
  titulo: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  genero?: string;
  stock?: number;
  rating?: number;
  platform?: string;
  releaseYear?: number;
}