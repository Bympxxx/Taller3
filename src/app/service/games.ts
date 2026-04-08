import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/games';

  getAll(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl);
  }

  getById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }

  create(game: Game): Observable<Game> {
    return this.http.post<Game>(`${this.apiUrl}/guardarGame`, game);
  }

  update(id: number, game: Partial<Game>): Observable<Game> {
    return this.http.put<Game>(`${this.apiUrl}/actualizarGame/${id}`, game);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminarGame/${id}`);
  }
}
