import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Torneo } from '../models/torneo.models';

@Injectable({
  providedIn: 'root'
})
export class TorneoService {
  private apiUrl = 'http://localhost:8080/torneos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(this.apiUrl);
  }

  create(torneo: Torneo): Observable<Torneo> {
    return this.http.post<Torneo>(`${this.apiUrl}/guardartorneo`, torneo);
  }

  update(id: number, torneo: Torneo): Observable<Torneo> {
    return this.http.put<Torneo>(`${this.apiUrl}/${id}`, torneo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}