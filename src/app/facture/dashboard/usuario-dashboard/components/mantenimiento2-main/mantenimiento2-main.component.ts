import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { Slipper } from '../../../../../shared/models/slippert';
import { Marcas, ProductoRegisterService } from '../../../../service/producto-register.service';
import { PaginatedResponse } from '../../../../../shared/models/PaginatedResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SlipperService } from '../../../../service/slipper.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { QrCodeService } from '../../../../service/qr-code.service';
import { NavBarsMantenimientosComponent } from "../../../../../shared/components/navbars/nav-bars-mantenimientos/nav-bars-mantenimientos.component";
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { DataService } from '../../../../service/data.service';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
import { ProductoService } from '../../../../service/producto.service';

@Component({
  selector: 'app-mantenimiento2-main',
  imports: [CommonModule, FormsModule, MatPaginatorModule,
    CopiarTextoDirective, RouterLink, NavBarsMantenimientosComponent, CustomDateFormatPipe, SizeFormatPipe],
  templateUrl: './mantenimiento2-main.component.html',
  styleUrl: './mantenimiento2-main.component.css'
})
export class Mantenimiento2MainComponent implements OnInit {


  selecteGenero = signal('');
  selecteMarca = signal('');
  selecteEmpresa = signal('');
  selectePrecio = signal(100);
  selectePrecioFabrica = signal(100);
  selecteColor = signal('');
  selecteTipo = signal('');
  selectedFile = signal<File | null>(null);
  isLoading = signal(false);
  mensaje = signal('');

  // Signals para la lista
  slippers = signal<Slipper[]>([]);
  totalElements = 0;
  currentPage = 0;
  pageSize = 25;
  fechaSeleccionada = '';

  // Data para los selects
  selectedGenero: string = '';
  generos = [
    { nombre: 'Hombre', value: 'man' },
    { nombre: 'Mujer', value: 'women' },
    { nombre: 'Niño', value: 'child' },
    { nombre: 'Niña', value: 'littleGirl' },
    { nombre: 'Bebe', value: 'baby' }
  ];

  marcas = signal<Marcas[]>([]);
  tipos = signal<string[]>([]);

  generoMap: Record<string, string> = {
    'Hombre': 'man',
    'Mujer': 'women',
    'Niño': 'child',
    'Niña': 'littleGirl',
    'Bebe': 'baby'
  };

  constructor(private productService: ProductoRegisterService,
    private slipperService: SlipperService,
    private toastr: ToastrService,
    private qrCodeService: QrCodeService,
    private serviceData: DataService,
    private productoService: ProductoService,
  ) {
    // Inicializar fecha con hoy
    this.fechaSeleccionada = this.getLocalDateString();
  }

  ngOnInit() {
    this.loadInitialData();
    this.cargarSlipperPorFecha();
    this.serviceData.getGenero().subscribe(apiGeneros => {
      this.generos = apiGeneros.map(g => {
        const match = this.generos.find(gs => gs.nombre === g.nombre);
        return {
          nombre: g.nombre,
          value: match ? match.value : g.nombre // fallback si no hay match
        };
      });
    });

  }
  getLocalDateString() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // offset en milisegundos
    const localISOTime = new Date(now.getTime() - offset).toISOString();
    return localISOTime.split('T')[0];
  }
  tiposFiltrados(): string[] {
    const genero = this.selecteGenero();

    if (['Niño', 'Niña', 'Bebe'].includes(genero)) {
      return this.tipos().filter(t => !this.tiposRopa().includes(t));
    }
    return this.tipos();
  }


  private loadInitialData() {
    // Cargar marcas
    this.productService.getMarcas().subscribe({
      next: (data) => this.marcas.set(data),
      error: (error) => console.error('Error cargando marcas:', error)
    });

    this.productoService.listRopa().subscribe({
      next: (ropa) => this.tiposRopa.set(ropa),
      error: (err) => console.error('Error cargando ropa:', err)
    });

    // Cargar tipos (de todos los productos)
    this.productoService.list('calzados').subscribe({
      next: (calzados) => {
        const listaCalzados = calzados.map(c => c.type);
        this.tipos.update(prev => [...prev, ...listaCalzados]);
      }
    });

    this.productoService.list('ropa').subscribe({
      next: (ropa) => {
        const listaRopa = ropa.map(r => r.type);
        this.tipos.update(prev => [...prev, ...listaRopa]);
        this.tiposRopa.set(listaRopa); // guardamos tipos de ropa dinámicamente
      }
    });

    this.productoService.list('unico').subscribe({
      next: (unicos) => {
        const listaUnicos = unicos.map(u => u.type);
        this.tipos.update(prev => [...prev, ...listaUnicos]);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

  generateCodToday() {
    if (!this.validateForm()) {
      this.showTemporaryMessage('Por favor, complete todos los campos obligatorios');
      return;
    }

    this.isLoading.set(true);
    this.mensaje.set('Generando código...');

    const tableName = this.generoMap[this.selecteGenero()];
    const file = this.selectedFile();

    if (!file) {
      this.showTemporaryMessage('Debe seleccionar una imagen');
      this.isLoading.set(false);
      return;
    }

    this.productService.createCodToday(
      tableName,
      this.selecteMarca(),
      this.selecteEmpresa(),
      this.selectePrecioFabrica(),
      this.selectePrecio(),
      this.selecteTipo(),
      this.selecteColor(),
      file
    ).subscribe({
      next: (response) => {
        this.showTemporaryMessage('Código generado exitosamente');
        this.resetForm();
        this.cargarSlipperPorFecha(); // Recargar la lista
        this.isLoading.set(false);
      },
      error: (error) => {
        this.showTemporaryMessage('Error al generar código: ' + error.error);
        this.isLoading.set(false);
      }
    });
  }

  private showTemporaryMessage(message: string) {
    this.mensaje.set(message);
    setTimeout(() => {
      this.mensaje.set('');
    }, 4000); // 4000 milisegundos = 4 segundos
  }


  private validateForm(): boolean {
    return !!(
      this.selecteGenero() &&
      this.selecteMarca() &&
      this.selecteEmpresa() &&
      this.selectePrecioFabrica() > 0 &&
      this.selectePrecio() > 0 &&
      this.selecteTipo() &&
      this.selecteColor() &&
      this.selectedFile()
    );
  }

  private resetForm() {
    this.selecteEmpresa.set('');
    this.selectedFile.set(null);

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  cargarSlipperPorFecha() {
    if (!this.fechaSeleccionada) return;

    this.productService.getSlippersByDate(
      this.fechaSeleccionada,
      this.currentPage,
      this.pageSize,
    ).subscribe({
      next: (response: PaginatedResponse<Slipper>) => {
        this.slippers.set(response.content);
        this.totalElements = response.totalElements;
        this.calcularSumaTotalCantidad(); // Asegúrate de calcular la suma después de cargar los datos
      },
      error: (error) => {
        console.error('Error cargando slippers:', error);
        this.slippers.set([]);
        this.calcularSumaTotalCantidad(); // También calcula la suma en caso de error para asegurarte de que esté actualizada
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarSlipperPorFecha();
  }
  resetPagination(): void {
    this.currentPage = 0;
    this.pageSize = 10;
  }


  deleteSlipper(codToday: string) {
    if (confirm(`¿Seguro que quiere eliminar el codigo ${codToday}`)) {
      this.slipperService.eliminarSlipper(codToday).subscribe({
        next: res => {
          console.log(res);
          this.toastr.success('Zapatilla eliminada correctamente', 'Eliminado');
          this.cargarSlipperPorFecha();
        },
        error: err => {
          console.error(err);
          const mensajeError = err?.error || 'Ocurrio un error eliminado';
          this.toastr.error(mensajeError, 'Error')
        }
      });
    }
  }

  // Métodos adicionales que podrías necesitar
  generateQR() {
    if (this.sumaTotalCantidad > 800) {
      alert('El botón de Generar QR se ha deshabilitado porque el límite permitido de QR es máximo hasta 800 QR.');
    } else {
      this.qrCodeService.generateQrCodes(this.slippers()).subscribe({
        next: (response) => {
          this.downloadFile(response);
        },
        error: (error) => {
          console.error('Error generating QR codes', error);
        }
      });
    }
  }

  private downloadFile(data: Blob) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  //update imagen 
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
          this.toastr.success('Imagen Actualizado');
          this.cargarSlipperPorFecha();
        },
        error: (err) => {
          this.toastr.error('Error al actualizar la imagen');
          console.error(err);
        }
      });
    }
  }
  //actualizar precio

  modalPrecioVisible = signal(false);
  slipperSeleccionado = signal<Slipper | null>(null);
  nuevoPrecio: string = '0';
  abrirModalPrecio(slipper: Slipper) {
    this.slipperSeleccionado.set(slipper);
    this.nuevoPrecio = slipper.price;
    this.modalPrecioVisible.set(true);
  }

  cerrarModalPrecio() {
    this.modalPrecioVisible.set(false);
    this.slipperSeleccionado.set(null);
  }

  confirmarActualizarPrecio() {
    const slipper = this.slipperSeleccionado();
    if (!slipper) return;

    this.slipperService.updatePrice(slipper.codToday, this.nuevoPrecio).subscribe({
      next: (res) => {
        this.toastr.success('Precio actualizado');
        // Actualiza el dato localmente
        slipper.price = this.nuevoPrecio;
        this.cerrarModalPrecio();
      },
      error: () => {
        this.toastr.error('Error al actualizar el precio');
      }
    });
  }

  isFormValid(): boolean {
    return !!this.selecteGenero()
      && !!this.selecteMarca()
      && !!this.selecteEmpresa()
      && this.selectePrecioFabrica() !== null
      && this.selectePrecio() !== null
      && !!this.selecteTipo() && !!this.selectedFile();
  }
  //regla de Generar QR
  sumaTotalCantidad: number = 0;
  calcularSumaTotalCantidad() {
    this.sumaTotalCantidad = this.slippers().reduce((sum, slipper) => sum + slipper.amount, 0) * 2;
  }

  //Size fila
  sizeAdjustments: { [key: string]: number } = {};

  abrirModal(slipper: Slipper) {
    this.slipperSeleccionado.set(slipper);
    this.sizeAdjustments = {};
    Object.keys(slipper.sizes || {}).forEach(k => {
      this.sizeAdjustments[k] = 0;
    });
  }

  cerrarModal() {
    this.slipperSeleccionado.set(null);
  }

  obtenerKeysCalzado(sizes: { [key: string]: number }) {
    return Object.keys(sizes).filter(k => !['xs', 's', 'm', 'l', 'xl'].includes(k));
  }


  obtenerKeysRopa(sizes: { [key: string]: number }) {
    return ['xs', 's', 'm', 'l', 'xl'].filter(k => k in sizes);
  }

  incrementSize(sizeKey: string) {
    this.sizeAdjustments[sizeKey] = (this.sizeAdjustments[sizeKey] || 0) + 1;
  }
  decrementSize(sizeKey: string) {
    if (this.sizeAdjustments[sizeKey] > 0) {
      this.sizeAdjustments[sizeKey]--;
    }
  }
  guardarAumentos() {
    const slipper = this.slipperSeleccionado();
    if (!slipper) return;

    const genero = this.slipperService.getGeneroKey(slipper.genero);

    this.slipperService.submitAdjustments(
      slipper,
      genero,
      this.sizeAdjustments,
      true // isAdd = true para aumentar
    ).subscribe({
      next: () => {
        // Refrescar los datos del slipper actual en pantalla
        Object.keys(this.sizeAdjustments).forEach(k => {
          slipper.sizes[k] += this.sizeAdjustments[k];
        });

        this.toastr.success('Tallas actualizadas correctamente.');
        this.cerrarModal();
        this.cargarSlipperPorFecha();
      },
      error: (err) => {
        console.error('Error al actualizar tallas', err);
        this.toastr.error('Error al actualizar tallas');
      }
    });
  }
  getTotalAgregado(): number {
    return Object.values(this.sizeAdjustments).reduce((sum, val) => sum + (val || 0), 0);
  }
  //Para actualizar el aumento  de UNICOS
  cantidadUnico: number = 1;

  guardarAumentoUnico() {
    const slipper = this.slipperSeleccionado();
    if (!slipper || this.cantidadUnico <= 0) return;

    const genero = this.slipperService.getGeneroKey(slipper.genero);

    const payload = {
      entity: genero,
      brand: slipper.brand,
      codToday: slipper.codToday,
      amount: this.cantidadUnico
    };

    this.slipperService.actualizarProducto(payload).subscribe({
      next: () => {
        slipper.amount = (slipper.amount || 0) + this.cantidadUnico;
        this.toastr.success('Cantidad aumentada correctamente.');
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al aumentar cantidad:', err);
        this.toastr.error('Error al aumentar cantidad');
      }
    });
  }

  //Tipos personalizados y  dinamicos

  tiposRopa = signal<string[]>([]);

  //resumen de ganancias de producto
  cantidadSimulada = 1;
  mostrarResumen = false;
  gananciaUnidad = 0;
  margen = 0;
  rentabilidadTotal = 0;

  mostrarResumenRentabilidad() {
    const precioFabrica = this.selectePrecioFabrica();
    const precioVenta = this.selectePrecio();
    const cantidad = this.cantidadSimulada;

    this.gananciaUnidad = +(precioVenta - precioFabrica).toFixed(2);
    this.margen = precioVenta > 0
  ? +((this.gananciaUnidad / precioVenta) * 100).toFixed(2)
  : 0;
    this.rentabilidadTotal = +(this.gananciaUnidad * cantidad).toFixed(2);
    this.mostrarResumen = true;
  }

  cerrarResumen() {
    this.mostrarResumen = false;
  }
}
