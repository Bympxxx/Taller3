import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  dirty: boolean;
  editando: any;
}

export const canDeactivateGuard: CanDeactivateFn<any> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  const isDirty = component?.dirty === true;
  const editando = component?.editando?.() === true;

  console.log('canDeactivate llamado', { isDirty, editando, component });

  if (isDirty || editando) {
    return confirm('¿Tienes cambios sin guardar. ¿Salir de todas formas?');
  }
  return true;
};