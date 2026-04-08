import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  role: string;
}

@Component({
  selector: 'app-nosotros',
  imports: [CommonModule],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.css',
})
export class Nosotros {
  cityInfo = signal({
    name: '',
    population: '2.8 millones',
    altitude: '2,850 m.s.n.m',
    description: 'Capital de Ecuador, corazon de los Andes. Hogar de GameOver Studio.'
  });

  contactInfo = signal({
    address: 'ITSQMET - Instituto Tecnologico Superior Quito Metropolitano',
    phone2: '+593 99 123-4567',
    email: 'gameover@itsqmet.edu.ec',
    hours: 'Lunes a Viernes: 08:00 - 17:00'
  });

  team = signal<TeamMember[]>([
    { name: 'Bryan Yepez', role: 'Desarrollador' },
    { name: 'Alex Toapanta', role: 'Desarrolador' },
    { name: 'Alex Lumbi', role: 'Desarrolador' },
    { name: 'Anderson Guabil', role: 'Desarrollador' }
  ]);
}