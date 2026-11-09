import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, catchError, debounceTime, distinctUntilChanged, finalize, merge, of, startWith, switchMap } from 'rxjs';

import { NotificationService } from '../../../../core/services/notification.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Product } from '../../models/product.model';
import { ProductApiService } from '../../services/product-api.service';

@Component({
  selector: 'app-prodct-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './prodct-list.component.html',
  styleUrl: './prodct-list.component.css'
})
export class ProductListComponent implements OnInit {
  private readonly productApiService = inject(ProductApiService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly displayedColumns = ['name', 'description', 'quantity', 'price', 'actions'];
  readonly refresh$ = new Subject<void>();

  products: Product[] = [];
  loading = false;
  deletingId: number | null = null;

  ngOnInit(): void {
    const searchChanges$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    );

    merge(searchChanges$, this.refresh$)
      .pipe(
        startWith(this.searchControl.value),
        switchMap((value) => this.loadProducts(typeof value === 'string' ? value : this.searchControl.value)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((products) => (this.products = products));
  }

  openCreate(): void {
    this.dialog
      .open(ProductFormComponent, {
        width: '600px',
        maxWidth: '95vw',
        autoFocus: 'first-tabbable',
        data: {}
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((saved) => {
        if (saved) {
          this.refresh$.next();
        }
      });
  }

  openEdit(product: Product): void {
    this.dialog
      .open(ProductFormComponent, {
        width: '600px',
        maxWidth: '95vw',
        autoFocus: 'first-tabbable',
        data: { product }
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((saved) => {
        if (saved) {
          this.refresh$.next();
        }
      });
  }

  async confirmDelete(product: Product): Promise<void> {
    const confirmed = await this.notificationService.confirm(
      `¿Seguro que deseas eliminar “${product.name}”? Esta acción no se puede deshacer.`,
      'Eliminar producto'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId = product.id;

    this.productApiService
      .delete(product.id)
      .pipe(
        finalize(() => (this.deletingId = null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.notificationService.success('El producto fue eliminado correctamente.');
          this.refresh$.next();
        }
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  private loadProducts(name: string) {
    this.loading = true;

    return this.productApiService.getAll(name).pipe(
      catchError(() => of([])),
      finalize(() => (this.loading = false))
    );
  }
}
