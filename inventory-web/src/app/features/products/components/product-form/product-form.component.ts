import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

import { NotificationService } from '../../../../core/services/notification.service';
import { ApiError } from '../../models/api-error.model';
import { Product } from '../../models/product.model';
import { ProductRequest } from '../../models/product-request.model';
import { ProductApiService } from '../../services/product-api.service';

export interface ProductFormDialogData {
  product?: Product;
}

export const nonBlankValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  String(control.value ?? '').trim() ? null : { nonBlank: true };

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly productApiService = inject(ProductApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<ProductFormComponent>);
  readonly data = inject<ProductFormDialogData>(MAT_DIALOG_DATA);

  readonly form = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required, nonBlankValidator, Validators.maxLength(100)]),
    description: this.formBuilder.control('', [Validators.maxLength(500)]),
    quantity: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
    price: this.formBuilder.control(0, [
      Validators.required,
      Validators.min(0.01),
      Validators.pattern(/^\d{1,10}(\.\d{1,2})?$/)
    ])
  });

  saving = false;

  constructor() {
    if (this.data.product) {
      this.form.patchValue({
        name: this.data.product.name,
        description: this.data.product.description ?? '',
        quantity: this.data.product.quantity,
        price: this.data.product.price
      });
    }
  }

  get isEditing(): boolean {
    return Boolean(this.data.product);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const request: ProductRequest = {
      name: formValue.name.trim(),
      description: formValue.description.trim() || null,
      quantity: formValue.quantity,
      price: formValue.price
    };
    const request$ = this.isEditing
      ? this.productApiService.update(this.data.product!.id, request)
      : this.productApiService.create(request);

    this.saving = true;

    request$
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.notificationService.success(
            this.isEditing
              ? 'El producto fue actualizado correctamente.'
              : 'El producto fue creado correctamente.'
          );
        },
        error: (error: HttpErrorResponse) => this.applyServerErrors(error)
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  serverError(controlName: string): string | null {
    const serverError = this.form.get(controlName)?.errors?.['server'];

    return typeof serverError === 'string' ? serverError : null;
  }

  private applyServerErrors(error: HttpErrorResponse): void {
    if (error.status !== 400) {
      return;
    }

    const fieldErrors = (error.error as ApiError | null)?.fieldErrors;

    if (!fieldErrors) {
      return;
    }

    Object.entries(fieldErrors).forEach(([field, message]) => {
      const control = this.form.get(field);

      if (control) {
        control.setErrors({ ...control.errors, server: message });
        control.markAsTouched();
      }
    });
  }
}
