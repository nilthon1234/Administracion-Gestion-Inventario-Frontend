import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { DataService } from '../../../../service/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';
import { Slipper } from '../../../../../shared/models/slippert';
import { ToastrService } from 'ngx-toastr';
import { SlipperService } from '../../../../service/slipper.service';
import { SeparationService } from '../../../../service/separation.service';
import { Separation } from '../../../../../shared/models/separation';
import { NavbarsSidebarVitrinaComponent } from "../../../../../shared/components/navbars/navbars-sidebar-vitrina/navbars-sidebar-vitrina.component";
import { OrdenSizesPipe } from '../../../../../shared/pipes/orden-sizes.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';

@Component({
  selector: 'app-filter-slipper',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarsSidebarVitrinaComponent,
    OrdenSizesPipe, MatPaginatorModule, SizeFormatPipe, CopiarTextoDirective, CustomDateFormatPipe],
  templateUrl: './filter-slipper.component.html',
  styleUrl: './filter-slipper.component.css'
})
export class FilterSlipperComponent implements OnInit {

  //SEPARATION
  separation: Separation[] = [];
  generos: any[] = [];
  marcas: any[] = [];
  tallas: any[] = [];
  showSeparationModal = false;
  selectedSeparationDetails: any[] = [];
  modalPosition = { top: 0, left: 0 };

  tallasDisponibles: any[] = [];
  generoSeleccionado: string = '';

  filtrosGenero = {
    genero: '',
    color: '',
    marca: '',
    tipo: '',
    talla: ''
  };

  filtrosFecha = {
    fecha: '',
    marca: '',
    talla: ''
  };
  marcaSeleccionado: string = '';
  tallaSeleccionado: string = '';
  tipoSeleccionado: string = '';
  //response
  slippers: Slipper[] = [];
  tipos: string[] = [];

  //Para la paginacion
  currentPage: number = 0;
  pageSize: number = 100;
  totalElements: number = 0;
  totalPages: number = 0;
  tallaFechaSeleccionado: string = '';


  //para controlar que detalles estan abiertas
  openDetailId: number | null = null;

  //buscar fecha
  fechaSelecionada: string = '';
  generoFechaSeleccionado: string = '';
  fechaMaxima: string = new Date().toISOString().split('T')[0];
  ultimaBusqueda: 'genero' | 'codToday' | 'fecha' = 'genero';

  //buscar codToday o company
  codTodaySeleccionado: string = '';
  companySelecionado: string = '';

  constructor(private dataService: DataService,
    private filterSlipperService: FilterSlipperService,
    private separationService: SeparationService,
    private toastrService: ToastrService,
    private slipperService: SlipperService
  ) {
    this.cargarDatos();
    this.cargarTipos();
  }
  ngOnInit(): void {
    this.separationService.getAllSeparations().subscribe(data => {
      this.separation = data;
    });
  }
  cargarTipos(): void {
    this.slipperService.generoTipo().subscribe({
      next: (tipos: string[]) => {
        this.tipos = tipos;

      },
      error: (err) => {

      }
    });
  }

  // In your component class
  getSeparationCount(codToday: string, sizeName: string): number {
    const normalize = (name: string) => name.trim().toLowerCase().replace(/^usa|^eu/, '');

    return this.separation.filter(sep =>
      sep.codToday === codToday &&
      sep.size.split(',').map(s => normalize(s)).includes(normalize(sizeName)) &&
      (sep.idClient.separationType === 'NUEVO' || sep.idClient.separationType === 'AMORTIZANDOCE')
    ).length;
  }

  getSeparationDetails(codToday: string, sizeName: string): any[] {
    const normalize = (name: string) => name.trim().toLowerCase().replace(/^usa|^eu/, '');
    return this.separation.filter(sep =>
      sep.codToday === codToday &&
      sep.size.split(',').map(s => normalize(s)).includes(normalize(sizeName)) &&
      (sep.idClient.separationType === 'NUEVO' || sep.idClient.separationType === 'AMORTIZANDOCE')
    ).map(sep => ({
      separationId: sep.idClient.id,
      clientDni: sep.idClient.dni,
      clientName: sep.idClient.name,
      clientLastName: sep.idClient.lastName,
      amount: sep.amount,
      price: sep.price,
      separationType: sep.idClient.separationType
    }));
  }
  // Nuevo método para mostrar el modal con detalles
  showSeparationDetails(codToday: string, sizeName: string, event: MouseEvent): void {
    event.stopPropagation(); // Evita que se propague el click

    const details = this.getSeparationDetails(codToday, sizeName);

    if (details.length > 0) {
      this.selectedSeparationDetails = details;
      this.showSeparationModal = true;
    }
  }

  // Método para cerrar el modal
  closeSeparationModal(): void {
    this.showSeparationModal = false;
    this.selectedSeparationDetails = [];
  }

  // Método para cerrar el modal al hacer click fuera
  onModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeSeparationModal();
    }
  }

  shouldHighlight(codToday: string, sizeName: string): boolean {
    return this.getSeparationCount(codToday, sizeName) > 0;
  }

  cargarDatos() {
    this.dataService.getGenero().subscribe(data => { this.generos = data });
    this.dataService.getMarca().subscribe(data => { this.marcas = data; });
    this.dataService.getTalla().subscribe(data => { this.tallas = data; });
  }

  onGeneroChange(event: any) {
    const genero = event.target.value; // NO hacer toLowerCase() aquí
    this.generoSeleccionado = genero;   // Mantener el valor original

    // Reiniciar talla seleccionada cuando cambia el género
    this.tallaSeleccionado = '';

    // Cargar las tallas correspondientes al género seleccionado
    // Usar toLowerCase() solo para la búsqueda en el array
    const generoLower = genero.toLowerCase();
    if (generoLower && this.tallas[generoLower]) {
      this.tallasDisponibles = this.tallas[generoLower];
    } else {
      this.tallasDisponibles = [];
    }
  }
  onGeneroFechaChange(event: any) {
    const genero = event.target.value; // NO hacer toLowerCase() aquí
    this.generoFechaSeleccionado = genero; // Mantener el valor original

    // Reiniciar talla seleccionada cuando cambia el género
    this.tallaFechaSeleccionado = '';

    // Cargar las tallas correspondientes al género seleccionado
    // Usar toLowerCase() solo para la búsqueda en el array
    const generoLower = genero.toLowerCase();
    if (generoLower && this.tallas[generoLower]) {
      this.tallasDisponibles = this.tallas[generoLower];
    } else {
      this.tallasDisponibles = [];
    }
  }

  buscar() {
    this.ultimaBusqueda = 'genero';
    this.fechaSelecionada = '';
    this.codTodaySeleccionado = '';
    this.companySelecionado = '';
    this.marcaSeleccionado = '';

    const generoMap: any = {
      hombre: 'MAN',
      mujer: 'WOMEN',
      niño: 'CHILD',
      niña: 'LITTLEGIRL',
      bebe: 'BABY',
    }

    const genero = generoMap[this.generoSeleccionado?.toLowerCase()];
    // CAMBIO: Usar filtrosGenero.marca en lugar de marcaSeleccionado
    const color = this.filtrosGenero.color || undefined;
    const marca = this.filtrosGenero.marca || undefined;
    const tipo = this.tipoSeleccionado || undefined;
    const talla = this.tallaSeleccionado || undefined;

    // Validación
    if (!genero) {
      this.toastrService.warning('Por favor seleccione un género', 'Advertencia');
      return;
    }

    this.openDetailId = null;
    this.slippers = [];

    this.filterSlipperService.buscarZapatillasPage(
      genero,
      color,
      marca,
      tipo,
      talla,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (data) => {
        this.slippers = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        if (data.content.length === 0) {
          this.toastrService.warning('No se encontraron resultados con los filtros seleccionados.', 'Aviso');
        }
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
        this.toastrService.error('Error al realizar la búsqueda.', 'Error');
      }
    });
  }
  //Para los botones de paginacion

  // Métodos para manejar cambios de página
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscar();
  }

  resetPagination(): void {
    this.currentPage = 0;
    this.pageSize = 100;
  }

  buscarPorFecha() {
    this.ultimaBusqueda = 'fecha';
    this.generoSeleccionado = '';
    this.filtrosGenero.color = '';
    this.filtrosGenero.marca = ''; // Limpiar correctamente
    this.tipoSeleccionado = '';
    this.tallaSeleccionado = '';
    this.codTodaySeleccionado = '';
    this.companySelecionado = '';

    const generoMap: any = {
      hombre: 'MAN',
      mujer: 'WOMEN',
      niño: 'CHILD',
      niña: 'LITTLEGIRL',
      bebe: 'BABY'
    }

    const genero = generoMap[this.generoFechaSeleccionado.toLowerCase()];
    const marca = this.marcaSeleccionado || undefined; // Usar la variable correcta
    const talla = this.tallaFechaSeleccionado || undefined;

    if (!genero || !this.fechaSelecionada) {
      this.toastrService.info('Por favor seleccione género y fecha.', 'Información');
      return;
    }

    this.openDetailId = null;
    this.slippers = [];

    this.filterSlipperService.buscarZapatillasPorFecha(
      genero,
      this.fechaSelecionada,
      marca,
      talla,
      this.currentPage,
      this.pageSize).subscribe({
        next: (data) => {
          this.slippers = data.content;
          this.totalElements = data.totalElements;
          this.totalPages = data.totalPages;
          if (data.content.length === 0) { // Usar data.content.length
            this.toastrService.warning('No se encontraron resultados para la fecha seleccionada.', 'Aviso');
          }
        },
        error: (err) => {
          this.toastrService.error('Error al buscar por fecha.', 'Error');
        }
      });
  }

  // buscarPorCodToday0Company() {

  //   const generoMap: any = {
  //     hombre: 'MAN',
  //     mujer: 'WOMEN',
  //     niño: 'CHILD',
  //     niña: 'LITTLEGIRL',
  //     bebe: 'BABY'
  //   };

  //   const genero = generoMap[this.generoSeleccionado.toLowerCase()];
  //   const marca = this.marcaSeleccionado;

  //   if (!genero || !marca) {
  //     this.toastrService.info('Por favor seleccione género y marca.', 'Información');
  //     return;
  //   }
  //   this.openDetailId = null;

  //   this.filterSlipperService.buscarPorCodTodayOCompany(
  //     genero,
  //     marca,
  //     this.codTodaySeleccionado || undefined,
  //     this.companySelecionado || undefined
  //   ).subscribe(data => {

  //     if (Array.isArray(data)) {
  //       if (data.length > 0) {
  //         this.slippers = data;
  //         this.toastrService.success('Resultados exitosos');
  //       } else {
  //         this.slippers = [];
  //         this.toastrService.warning('No se encontraron resultados');
  //       }
  //     } else {
  //       if (data) {
  //         this.slippers = [data];
  //         this.toastrService.success('Resultados exitosos');
  //       } else {
  //         this.slippers = [];
  //         this.toastrService.warning('No se encontraron resultados');
  //       }
  //     }

  //     console.log('resultado por codToday o company:', this.slippers);
  //   });

  // }
  mapGeneroToKey(genero: string): string {
    const generoMap: any = {
      hombre: 'MAN',
      mujer: 'WOMEN',
      niño: 'CHILD',
      niña: 'LITTLEGIRL',
      bebe: 'BABY'
    };
    return generoMap[genero.toLowerCase()] || 'UNKNOWN';
  }

  buscarPorCodToday0Company() {
    this.ultimaBusqueda = 'codToday';
    this.generoSeleccionado = '';
    this.filtrosGenero.color = '';
    this.filtrosGenero.marca = '';
    this.marcaSeleccionado = '';
    this.tipoSeleccionado = '';
    this.tallaSeleccionado = '';
    this.fechaSelecionada = '';
    if (!this.codTodaySeleccionado && !this.companySelecionado) {
      this.toastrService.info('Por favor ingrese CodToday o Company.', 'Información');
      return;
    }
    this.slippers = [];

    this.filterSlipperService.buscarPorCodTodayOCompany(
      this.codTodaySeleccionado || undefined,
      this.companySelecionado || undefined
    ).subscribe(data => {
      if (Array.isArray(data)) {
        if (data.length > 0) {
          this.slippers = data;
          this.toastrService.success('Resultados exitosos');
        } else {
          this.slippers = [];
          this.toastrService.warning('No se encontraron resultados');
        }
      } else {
        if (data) {
          this.slippers = [data];
          this.toastrService.success('Resultados exitosos');
        } else {
          this.slippers = [];
          this.toastrService.warning('No se encontraron resultados');
        }
      }
    });
  }




  toggleDetails(slipper: Slipper) {
    if (this.openDetailId === slipper.id) {
      this.openDetailId = null;//cerrar si esta abierto

    } else {
      this.openDetailId = slipper.id;// abrir detalles si esta la zapatilla
    }
  }
  isDetailOpen(slipper: Slipper): boolean {
    return this.openDetailId === slipper.id
  }
  getSlipperSizes(slipper: Slipper): { name: string, amount: number }[] {
    const sizes: { name: string, amount: number }[] = [];
    if (slipper.sizes) {
      for (const [key, value] of Object.entries(slipper.sizes)) {
        sizes.push({
          name: key,
          amount: value
        });
      }
    }
    return sizes.sort((a, b) => {
      const numA = parseFloat(a.name.replace('eu', '').replace('_', ''));
      const numB = parseFloat(b.name.replace('eu', '').replace('_', ''));
      return numA - numB;
    });
  }
  // Formatear el nombre de la talla para mejor presentación
  formatSizeName(sizeName: string): string {
    // Convertir "eu10_5" a "EU 10.5"
    return sizeName.replace('eu', 'EU ').replace('_', '.');
  }


  //Acrualizacion  Size
  sizeAdjustments: { [slipperId: number]: { [sizeName: string]: number } } = {};
  updatedRows: Set<string> = new Set();

  adjustSize(slipper: any, sizeName: string, delta: number, event: MouseEvent): void {
    event.preventDefault(); // Esto evita cualquier comportamiento por defecto
    event.stopPropagation(); // Esto evita la propagación del evento

    const id = slipper.id;
    if (!this.sizeAdjustments[id]) this.sizeAdjustments[id] = {};
    const current = this.sizeAdjustments[id][sizeName] || 0;
    this.sizeAdjustments[id][sizeName] = current + delta;

    if (this.sizeAdjustments[id][sizeName] === 0) {
      delete this.sizeAdjustments[id][sizeName];
    }
  }
  // Historila del size - o + 
  totalAdjustment: number = 0;

  prepareAdjustments(slipper: any, isAdd: boolean): void {
    const adjustments = this.sizeAdjustments[slipper.id];
    if (!adjustments) return;

    this.currentSlipper = slipper;
    this.isAddOperation = isAdd;
    this.pendingAdjustments = adjustments;

    // Calcular el total
    let total = 0;

    // Preparar el resumen para mostrar en el modal
    this.pendingAdjustmentsSummary = Object.entries(adjustments).map(([size, amount]) => {
      const absAmount = Math.abs(amount as number);
      total += absAmount;
      return {
        size,
        amount: amount as number,
        absAmount, // Guardamos el valor absoluto para mostrarlo
        action: amount > 0 ? 'Agregar' : 'Descontar'
      };
    });

    // Guardamos el total para mostrarlo en el modal
    this.totalAdjustment = total;

    this.showConfirmationModal = true;
  }

  confirmAdjustments(): void {
    this.showConfirmationModal = false;
    const genero = this.mapGeneroToKey(this.currentSlipper.genero); // desde el objeto

    try {
      this.slipperService.submitAdjustments(this.currentSlipper, genero, this.pendingAdjustments, this.isAddOperation)
        .subscribe({
          next: () => {
            this.updatedRows.add(this.currentSlipper.codToday);
            setTimeout(() => this.updatedRows.delete(this.currentSlipper.codToday), 5000);
            this.toastrService.success(`Stock ${this.isAddOperation ? 'actualizado' : 'descontado'} correctamente.`);
            delete this.sizeAdjustments[this.currentSlipper.id];

            // ✅ Refrescar según tipo de búsqueda
            switch (this.ultimaBusqueda) {
              case 'codToday':
                this.buscarPorCodToday0Company();
                break;
              case 'fecha':
                this.buscarPorFecha();
                break;
              case 'genero':
              default:
                this.buscar();
            }
          },
          error: err => {
            console.error('Error al enviar la actualización: ', err);
            this.toastrService.error('Error al actualizar stock');
          }
        });
    } catch (e) {
      console.warn((e as Error).message);
    }
  }



  getAbsoluteValue(num: number): number {
    return Math.abs(num);
  }

  cancelAdjustments(): void {
    this.showConfirmationModal = false;
    // Opcional: puedes limpiar los ajustes pendientes si lo deseas
    // delete this.sizeAdjustments[this.currentSlipper.id];
  }

  hasPositiveAdjustments(slipperId: number): boolean {
    return this.sizeAdjustments[slipperId] &&
      Object.values(this.sizeAdjustments[slipperId]).some(val => val > 0);
  }
  hasNegativeAdjustments(slipperId: number): boolean {
    return this.sizeAdjustments[slipperId] &&
      Object.values(this.sizeAdjustments[slipperId]).some(val => val < 0);
  }

  //Imagen config
  selectedImagenUrl: string | null = null;
  openImageModal(url: string) {
    this.selectedImagenUrl = url;
  }
  closeImageModal() {
    this.selectedImagenUrl = null;
  }


  //propiedades para actualizar  + o - size

  showConfirmationModal: boolean = false;
  pendingAdjustments: any;
  pendingAdjustmentsSummary: any[] = [];
  isAddOperation: boolean = true;
  currentSlipper: any;

  shouldShowSize(slipper: any, sizeName: string): boolean {
    // Tallas de ropa a excluir
    const excludedSizes = ['xs', 's', 'm', 'l', 'xl'];

    // Si el producto es ZAPATILLA o SANDALIA, excluye esas tallas
    if (slipper.producto === 'CALZADO') {
      return !excludedSizes.includes(sizeName.toLowerCase());
    }

    // En otro caso (ropa u otro tipo), muestra todas las tallas
    return true;
  }

  //actualizar precio
  modalPrecioVisible = signal(false);
  slipperSelecionado = signal<Slipper | null>(null);
  nuevoPrecio: string = '0'

  abrirModalPrecio(slippert: Slipper) {
    this.slipperSelecionado.set(slippert);
    this.nuevoPrecio = slippert.price;
    this.modalPrecioVisible.set(true);
  }

  cerrarModalPrecio() {
    this.modalPrecioVisible.set(false);
    this.slipperSelecionado.set(null);
  }

  confirmarActualizarPrecio() {
    const slipper = this.slipperSelecionado();
    if (!slipper) return;
    this.slipperService.updatePrice(slipper.codToday, this.nuevoPrecio).subscribe({
      next: (res) => {
        this.toastrService.success(`precio actualizado a S/${this.nuevoPrecio} soles`);
        slipper.price = this.nuevoPrecio;
        this.cerrarModalPrecio();
      },
      error: () => {
        this.toastrService.error('Error al actualizar el precio')
      }
    });
  }

  //eliminar Producto
  deleteSlipper(codToday: string) {
    if (confirm(`¿Seguro que quiere eliminar el codigo ${codToday}`)) {
      this.slipperService.eliminarSlipper(codToday).subscribe({
        next: res => {
          this.toastrService.success('Zapatilla eliminada correctamente', 'Eliminado');
          // Refrescar según el último filtro aplicado
          switch (this.ultimaBusqueda) {
            case 'codToday':
              this.buscarPorCodToday0Company();
              break;
            case 'fecha':
              this.buscarPorFecha();
              break;
            case 'genero':
            default:
              this.buscar();
              break;
          }
        },
        error: err => {
          const mensajeError = err?.error || 'Ocurrio un error eliminado';
          this.toastrService.error(mensajeError, 'Error');
        }
      });
    }
  }
  selectdSlipper: Slipper | null = null;
  @ViewChild('fileInput') fileInpunt!: ElementRef<HTMLInputElement>;
  seleccionarImagenParaActualizar(slipper: Slipper) {
    this.selectdSlipper = slipper;
    this.fileInpunt.nativeElement.click();
  }
  ActualizarImagen(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length && this.selectdSlipper) {
      const file = input.files[0];
      const generoKey = this.slipperService.getGeneroKey(this.selectdSlipper.genero);
      this.slipperService.updateImagen(
        generoKey,
        this.selectdSlipper.brand,
        this.selectdSlipper.codToday,
        file
      ).subscribe({
        next: (res) => {
          this.toastrService.success('Imagen Actualizado');
          // Refrescar según el último filtro aplicado
          switch (this.ultimaBusqueda) {
            case 'codToday':
              this.buscarPorCodToday0Company();
              break;
            case 'fecha':
              this.buscarPorFecha();
              break;
            case 'genero':
            default:
              this.buscar();
              break;
          }
        },
        error: (err) => {
          this.toastrService.error('Error al actualizar la imagen');
          console.error(err);
        }
      });
    }
  }


}
