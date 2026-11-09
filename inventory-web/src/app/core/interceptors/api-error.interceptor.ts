import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ApiError } from '../../features/products/models/api-error.model';
import { NotificationService } from '../services/notification.service';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = error.error as ApiError | null;
      const backendMessage = apiError?.message;

      if (error.status === 400 && apiError?.fieldErrors) {
        return throwError(() => error);
      }

      let message: string | undefined;

      switch (error.status) {
        case 0:
          message = 'No se pudo conectar con el servidor.';
          break;
        case 400:
          message = backendMessage || 'La solicitud no es válida.';
          break;
        case 404:
          message = backendMessage || 'El recurso solicitado no existe.';
          break;
        case 409:
          message = backendMessage || 'La operación genera un conflicto.';
          break;
        case 429:
          message = 'Has realizado demasiadas solicitudes. Inténtalo nuevamente.';
          break;
        default:
          if (error.status >= 500) {
            message = 'Ocurrió un error interno en el servidor.';
          }
      }

      if (message) {
        notificationService.error(message);
      }

      return throwError(() => error);
    })
  );
};
