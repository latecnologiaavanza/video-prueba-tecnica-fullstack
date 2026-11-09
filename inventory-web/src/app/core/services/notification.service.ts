import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  success(message: string, title = 'Operación exitosa'): void {
    void Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2563eb'
    });
  }

  error(message: string, title = 'Ocurrió un error'): void {
    void Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc2626'
    });
  }

  confirm(message: string, title = '¿Deseas continuar?'): Promise<boolean> {
    return Swal.fire({
      icon: 'warning',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      reverseButtons: true
    }).then((result) => result.isConfirmed);
  }
}
