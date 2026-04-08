import { Component, OnInit, inject, signal, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/authService';
import { UsersService } from '../../service/usuariosService';
import { User } from '../../models/usuarios.models';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css']
})
export class Formulario implements OnInit {
  @Output() dirtyChange = new EventEmitter<boolean>();
  @Output() editandoChange = new EventEmitter<boolean>();
  dirty = false;

  nuevoUsuario: Partial<User> = {};
  listaUsuarios = signal<User[]>([]);
  editando = signal(false);
  errorMsg = '';
  successMsg = '';

  private usersService = inject(UsersService);
  private authService = inject(AuthService);

  esAdmin = computed(() => this.authService.getCurrentUser()?.rol === 'ADMIN');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getAll().subscribe({
      next: users => this.listaUsuarios.set(users),
      error: err => console.error('Error cargando usuarios:', err)
    });
  }

  markDirty() {
    this.dirty = true;
    this.dirtyChange.emit(true);
  }

  guardarUsuario() {
    if (this.editando()) {
      const payload: Partial<User> = {
        nombre: this.nuevoUsuario.nombre,
        email: this.nuevoUsuario.email,
        rol: this.nuevoUsuario.rol,
        plan: this.nuevoUsuario.plan,
      };

      if (this.nuevoUsuario.password && this.nuevoUsuario.password.trim() !== '') {
        payload.password = this.nuevoUsuario.password;
      }

      this.usersService.update(this.nuevoUsuario.id!, payload).subscribe({
        next: () => {
          this.successMsg = 'Actualizado correctamente';
          this.loadUsers();
          this.resetForm();
          this.editando.set(false);
          this.editandoChange.emit(false);
        },
        error: () => this.errorMsg = 'Error al actualizar'
      });

    } else {
      this.usersService.create(this.nuevoUsuario as User).subscribe({
        next: () => {
          this.successMsg = 'Usuario creado';
          this.loadUsers();
          this.resetForm();
        },
        error: () => this.errorMsg = 'Error al crear'
      });
    }
  }

  seleccionarParaEditar(user: User) {
    this.nuevoUsuario = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      plan: user.plan,
      password: ''
    };
    this.editando.set(true);
    this.editandoChange.emit(true);
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Eliminar usuario?')) {
      this.usersService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: err => console.error('Error eliminando:', err)
      });
    }
  }

  limpiarFormulario() {
    this.resetForm();
    this.editando.set(false);
    this.editandoChange.emit(false);
  }

  private resetForm() {
    this.nuevoUsuario = {};
    this.dirty = false;
    this.dirtyChange.emit(false);
    this.errorMsg = '';
    this.successMsg = '';
  }
}
