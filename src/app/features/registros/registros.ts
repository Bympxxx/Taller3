import { Component } from '@angular/core';
import { Formulario } from '../../shared/formulario/formulario';

@Component({
  selector: 'app-registros',
  imports: [Formulario],
  templateUrl: './registros.html',
  styleUrl: './registros.css',
})
export class Registros {
  dirty = false;
  editandoValue = false;
  editando = () => this.editandoValue;

  onDirtyChange(event: boolean) {
    this.dirty = event;
  }

  onEditandoChange(event: boolean) {
    this.editandoValue = event;
  }
}
