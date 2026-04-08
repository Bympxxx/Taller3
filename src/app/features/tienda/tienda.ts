import { Component } from '@angular/core';
import { CatalogoGames } from '../../shared/catalogo-games/catalogo-games';

@Component({
  selector: 'app-tienda',
  imports: [CatalogoGames],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css'
})
export class Tienda {}