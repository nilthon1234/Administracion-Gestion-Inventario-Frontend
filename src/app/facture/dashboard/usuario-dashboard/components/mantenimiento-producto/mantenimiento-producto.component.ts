import { Component, OnInit } from '@angular/core';
import { TipoItem } from '../../../../../shared/models/TipoItem';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../../../service/producto.service';
import { CommonModule } from '@angular/common';
import { NavBarsMantenimientosComponent } from '../../../../../shared/components/navbars/nav-bars-mantenimientos/nav-bars-mantenimientos.component';
import { firstValueFrom } from 'rxjs';
import { EntityGenero } from '../../../../../shared/models/entityGenero';

@Component({
  selector: 'app-mantenimiento-producto',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavBarsMantenimientosComponent],
  templateUrl: './mantenimiento-producto.component.html',
  styleUrl: './mantenimiento-producto.component.css'
})
export class MantenimientoProductoComponent implements OnInit {

  tabs = ['calzados', 'ropa', 'unico'] as const;
  activeTab: typeof this.tabs[number] = 'calzados';

  items: TipoItem[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private svc: ProductoService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(1)]],
      symbol: ['', [Validators.minLength(1), Validators.maxLength(2)]]
    });
  }

  ngOnInit() {
    this.load();
    this.loadGeneros();
    this.loadGenerosExistentes();
  }

  load() {
    this.svc.list(this.activeTab).subscribe({
      next: res => this.items = res,
      error: () => this.toastr.error('Error al cargar')
    });
  }

  switchTab(tab: typeof this.tabs[number]) {
    this.activeTab = tab;
    this.form.reset();
    this.load();
  }

  submit(): void {
    const { type, symbol } = this.form.value;

    /* 1. Validación específica por pestaña */
    if (!type || type.trim() === '') {
      this.toastr.warning('El campo "Nombre del Producto" es obligatorio');
      return;
    }

    /* 2. Para Ropa y Unico también validar símbolo */
    if (this.activeTab !== 'calzados' && (!symbol || symbol.trim() === '')) {
      this.toastr.warning('El campo "Símbolo" es obligatorio');
      return;
    }

    /* 3. Llamada al servicio */
    this.svc.create(this.activeTab, type.trim(), symbol?.trim() || undefined).subscribe({
      next: () => {
        this.toastr.success('Guardado');
        this.form.reset();
        this.load();
      },
      error: err => this.toastr.error(err?.error || 'Error al guardar')
    });
  }

  symbolRequired(): boolean {
    return this.activeTab !== 'calzados';
  }
  async eliminar(item: TipoItem) {
    if (!confirm(`¿Seguro de eliminar “${item.type}” ?`)) return;

    try {
      await firstValueFrom(
        this.svc.delete(this.activeTab, item.id)
      );
      this.toastr.success('Eliminado');
      this.load();                // recarga la lista actualizada
    } catch (err: any) {
      this.toastr.error(err?.error || 'No se pudo eliminar');
    }
  }

  //Genero
  generosEstaticos = ['Hombre', 'Mujer', 'Niño', 'Niña', 'Bebe'];
  generosExistentes: Set<string> = new Set();
  generos: EntityGenero[] = [];
  generoSeleccionado: EntityGenero | null = null;

  loadGeneros() {
    this.svc.listarGeneros().subscribe({
      next: res => this.generos = res,
      error: () => this.toastr.error('Error al cargar géneros')
    });
  }
  
  crearGenero(nombre: string) {
    if (this.generosExistentes.has(nombre)) {
      this.toastr.warning(`El género "${nombre}" ya existe`);
      return;
    }
  
    this.svc.createGenero(nombre).subscribe({
      next: () => {
        this.toastr.success(`Género "${nombre}" creado`);
        this.generosExistentes.add(nombre); // actualizar localmente
      },
      error: err => this.toastr.error(err?.error || 'Error al crear género')
    });
  }
  
  loadGenerosExistentes() {
    this.svc.listarGeneros().subscribe({
      next: res => {
        this.generosExistentes = new Set(res.map(g => g.nombre));
      },
      error: () => this.toastr.error('Error al cargar géneros existentes')
    });
  }

}
