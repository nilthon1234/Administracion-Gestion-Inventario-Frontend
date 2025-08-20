import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { NavbarsSidebarVitrinaComponent } from "../../../../../shared/components/navbars/navbars-sidebar-vitrina/navbars-sidebar-vitrina.component";
import { Slipper } from '../../../../../shared/models/slippert';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';
import { DataService } from '../../../../service/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SlipperService } from '../../../../service/slipper.service';
import { Router } from '@angular/router';
import { ActualizarCantidadComponent } from "../actualizar-cantidad/actualizar-cantidad.component";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';

@Component({
  selector: 'app-filter-gorra-canguro-medias',
  standalone: true,
  imports: [NavbarsSidebarVitrinaComponent, FormsModule, CommonModule, MatPaginatorModule, CopiarTextoDirective],
  templateUrl: './filter-gorra-canguro-medias.component.html',
  styleUrl: './filter-gorra-canguro-medias.component.css'
})
export class FilterGorraCanguroMediasComponent implements OnInit {

  isBrowser: boolean = false;
  marcas: any[] = [];
  filtros = {
    brand: null as string | null,
    codToday: '',
    company: ''
  };

  //Para la paginacion
  currentPage: number = 0;
  pageSize: number = 100;
  totalElements: number = 0;
  totalPages: number = 0;

  productosOriginal: Slipper[] = [];
  productosFiltrados: Slipper[] = [];
  actualizacionEnProceso: boolean = false;
  mensajeActualizacion: string = '';
  productoEditando: string | null = null;//para mantener sl scroll en el porcuto guardado 

  ngOnInit(): void {
    this.dataService.getMarca().subscribe(data => this.marcas = data);
    this.cargarProductos();
  }

  cargarProductos(): void {
    let scrollPosition = 0;
    if (this.isBrowser) {
      const element = document.querySelector('.productos');
      scrollPosition = element?.scrollTop || 0;
    }

    const productoEditado = this.productoEditando;

    this.filterSlipperService.listAllProduct(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          // Manejo de la respuesta paginada
          if (response.content) {
            this.productosOriginal = response.content.map((p: any) => ({
              ...p,
              nuevaCantidad: p.amount,
              editandoCantidad: false
            }));
            this.totalElements = response.totalElements;
            this.totalPages = response.totalPages;
          } else {
            // Fallback si la respuesta no tiene estructura paginada
            this.productosOriginal = response.map((p: any) => ({
              ...p,
              nuevaCantidad: p.amount,
              editandoCantidad: false
            }));
            this.totalElements = this.productosOriginal.length;
            this.totalPages = Math.ceil(this.totalElements / this.pageSize);
          }

          this.aplicarFiltros();

          // Restaurar posición del scroll (solo si estamos en el navegador)
          if (this.isBrowser && productoEditado) {
            setTimeout(() => {
              const elemento = document.querySelector(`[data-codigo="${productoEditado}"]`);
              elemento?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
              this.productoEditando = null;
            }, 0);
          } else {
            this.productoEditando = null;
          }
        },
        error: (err) => {
          console.error('Error al cargar productos', err);
          this.productosOriginal = [];
          this.productosFiltrados = [];
          this.totalElements = 0;
          this.totalPages = 0;
        }
      });
  }


  filtrarProductos(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.productosFiltrados = this.productosOriginal.filter(producto => {
      const brandMatch = !this.filtros.brand || producto.brand === this.filtros.brand;
      const codMatch = !this.filtros.codToday || producto.codToday.includes(this.filtros.codToday);
      const companyMatch = !this.filtros.company || producto.company.includes(this.filtros.company);

      return brandMatch && codMatch && companyMatch;
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      brand: null,
      codToday: '',
      company: ''
    };
    this.productosFiltrados = [...this.productosOriginal];
  }

  // Métodos para manejar cambios de página
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarProductos();
  }

  resetPagination(): void {
    this.currentPage = 0;
    this.pageSize = 100;
  }

  constructor(private filterSlipperService: FilterSlipperService,
    private slipperService: SlipperService,
    private dataService: DataService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getEnumGenero(genero: string): string {
    const mapa: { [key: string]: string } = {
      'Hombre': 'MAN',
      'Mujer': 'WOMEN',
      'Niño': 'CHILD',
      'Niña': 'LITTLEGIRL',
      'Bebe': 'BABY'
    };
    return mapa[genero] || '';
  }

  actualizarCantidad(p: Slipper, nuevaCantidad: number) {
    const generoEnum = this.getEnumGenero(p.genero);

    const payload = {
      entity: generoEnum,
      brand: p.brand,
      codToday: p.codToday,
      amount: nuevaCantidad
    };

    this.slipperService.actualizarProducto(payload).subscribe({
      next: () => {
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al actualizar cantidad:', err);
      }
    });
  }


  abrirEspecificarModel(genero: string | undefined) {
    const dialogRef = this.dialog.open(ActualizarCantidadComponent, {
      width: '500px',
      height: '450px',
      panelClass: 'custom-modalbox', // Aplicamos clase personalizada
      backdropClass: 'custom-backdrop', // para el fondo oscuro
      data: { nroTicket: genero }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.cargarProductos();
      }
    });
  }

  abrirModelCantidad(p: Slipper) {
    this.productoEditando = p.codToday;//para mantener en la posicion
    const dialogRef = this.dialog.open(ActualizarCantidadComponent, {
      width: '400px',
      data: {
        brand: p.brand,
        codToday: p.codToday,
        cantidadActual: p.amount,
        genero: p.genero
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.operacion === 'aumentar') {
          this.aumentarCantidad(p, result.cantidad);
        } else {
          this.disminuirCantidad(p, result.cantidad);
        }
      }
    });
  }
  aumentarCantidad(p: Slipper, cantidad: number) {
    const generoEnum = this.getEnumGenero(p.genero);

    const payload = {
      entity: generoEnum,
      brand: p.brand,
      codToday: p.codToday,
      amount: cantidad
    };

    this.slipperService.actualizarProducto(payload).subscribe({
      next: () => {

        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al aumentar cantidad:', err);
      }
    });
  }

  disminuirCantidad(p: Slipper, cantidad: number) {
    const generoEnum = this.getEnumGenero(p.genero);

    const payload = {
      entity: generoEnum,
      brand: p.brand,
      codToday: p.codToday,
      amount: cantidad
    };

    this.slipperService.disminuirProducto(payload).subscribe({
      next: () => {
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al disminuir cantidad:', err);
      }
    });
  }

  //agrandar Imagen
  selectedImagenUrl: string | null = null;
  openImageModal(url: string) {
    this.selectedImagenUrl = url;
  }
  closeImageModal() {
    this.selectedImagenUrl = null;
  }

}