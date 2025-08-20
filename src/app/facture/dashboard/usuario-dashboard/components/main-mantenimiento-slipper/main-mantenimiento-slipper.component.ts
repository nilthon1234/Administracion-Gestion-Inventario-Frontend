import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';
import { Slipper } from '../../../../../shared/models/slippert';
import Module from 'module';
import { FormsModule } from '@angular/forms';
import { SlipperService } from '../../../../service/slipper.service';
import { DataService } from '../../../../service/data.service';
import { sign } from 'crypto';
import { NotificationService } from '../../../../service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { QrCodeService } from '../../../../service/qr-code.service';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { NavBarsMantenimientosComponent } from "../../../../../shared/components/navbars/nav-bars-mantenimientos/nav-bars-mantenimientos.component";

@Component({
  selector: 'app-main-mantenimiento-slipper',
  imports: [CommonModule, FormsModule, RouterLink, MatPaginatorModule, CopiarTextoDirective, NavBarsMantenimientosComponent],
  providers: [DatePipe],
  templateUrl: './main-mantenimiento-slipper.component.html',
  styleUrl: './main-mantenimiento-slipper.component.css'
})
export class MainMantenimientoSlipperComponent implements OnInit {

  slippers = signal<Slipper[]>([]);
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  fechaActual: string;
  fechaSelecionada: string;

  isLoading = signal(false);

  nuevosCodigos = signal<string[]>([]);
  generoGenerado: string = '';

  constructor(
    private qrCodeService: QrCodeService,
    private filterSlipperService: FilterSlipperService,
    private toastr: ToastrService,
    private slipperService: SlipperService,
    private dataService: DataService,
    private datePipe: DatePipe,
    private notifiService: NotificationService // Inyecta el servicio
  ) {
    this.fechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.fechaSelecionada = this.fechaActual;
    this.dataService.getGenero().subscribe(g => this.genero.set(g));
    this.dataService.getMarca().subscribe(m => this.marca.set(m));
    this.slipperService.generoTipo().subscribe(t => this.tipos.set(t));
  }

  ngOnInit(): void {
    this.cargarSlipperPorFecha();
  }

  getGeneroLegible(cod: string): string {
    const entry = Object.entries(this.generoMap).find(([k, v]) => v === cod);
    return entry ? entry[0] : cod;
  }


  cargarSlipperPorFecha() {
    this.isLoading.set(true);
    this.filterSlipperService.listAllSlipper(this.fechaSelecionada, this.currentPage, this.pageSize).subscribe(pageData => {
      this.slippers.set(pageData.content);
      this.totalElements = pageData.totalElements;
      this.totalPages = pageData.totalPages;
      this.isLoading.set(false);

      // Si hay códigos nuevos, verifica si están en los datos cargados y envía notificación
      if (this.nuevosCodigos().length > 0) {
        const ultimoCodigo = this.nuevosCodigos()[this.nuevosCodigos().length - 1];
        const nuevoSlipper = this.slippers().find(s => s.codToday === ultimoCodigo);

        if (nuevoSlipper) {
          setTimeout(() => {
            this.notifiService.notifyNewCode({
              code: ultimoCodigo,
              targetElementId: `slipper-${nuevoSlipper.codToday}`
            });
          }, 500); // Pequeño retraso para asegurar que el DOM se ha actualizado
        }
      }
    });
  }


  //Para los botones de paginacion

  // Métodos para manejar cambios de página
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarSlipperPorFecha();
  }

  resetPagination(): void {
    this.currentPage = 0;
    this.pageSize = 100;
  }


  //formato para generarCodToday

  genero = signal<any[]>([]);
  marca = signal<any[]>([]);
  tipos = signal<string[]>([]);

  selecteGenero = signal('');
  selecteMarca = signal('');
  selecteEmpresa = signal('');
  selectePrecio = signal(100);
  selecteTipo = signal('');
  selecteFile = signal<File | null>(null);

  mesnaje = signal('');
  generoMap: Record<string, string> = {
    Hombre: 'man',
    Mujer: 'women',
    Niño: 'child',
    Niña: 'littleGirl',
    Bebe: 'baby'
  };

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selecteFile.set(input.files[0]);
    }
  }

  generateCodToday() {
  const generoBack = this.generoMap[this.selecteGenero()];
  const file = this.selecteFile();
  const genero = this.selecteGenero(); // o como estés obteniendo el género
  this.generoGenerado = genero;

  if (!generoBack || !this.selecteMarca() || !this.selecteEmpresa() || !this.selectePrecio() || !this.selecteTipo() || !file) {
    this.mesnaje.set('Todos los campos son obligatorios');
    setTimeout(() => {
      this.mesnaje.set('');
    }, 3000);
    return;
  }
  this.isLoading.set(true);

  this.slipperService.createCodToday(
    generoBack,
    this.selecteMarca(),
    this.selecteEmpresa(),
    this.selectePrecio(),
    this.selecteTipo(),
    file
  ).subscribe({
    next: (res: string) => {
      this.mesnaje.set('Código creado con éxito');
      setTimeout(() => {
        this.mesnaje.set('');
      }, 3000);

      // Extraemos el código cod_today del texto usando regex
      const regex = /cod_today:\s*([A-Za-z0-9.\-_]+)/;
      const match = res.match(regex);
      const nuevoCodigo = match ? match[1] : '';

      if (nuevoCodigo) {
        this.nuevosCodigos.set([...this.nuevosCodigos(), nuevoCodigo]);
        
        // Limpiar el formulario
        this.selecteEmpresa.set('');
        this.selecteGenero.set('');
        this.selecteMarca.set('');
        this.selectePrecio.set(100);
        this.selecteTipo.set('');
        this.selecteFile.set(null);
        
        // Resetear file input visualmente
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        
        // IMPORTANTE: Resetear paginación para ir a la primera página
        this.currentPage = 0;
        
        // Cargar los datos actualizados
        this.cargarSlipperPorFecha();
      }
      
      this.isLoading.set(false);
    },
    error: (err) => {
      this.isLoading.set(false);

      // Intenta leer un mensaje más claro
      const rawError = err?.error;
      let mensaje = 'Error desconocido al generar el código';

      if (typeof rawError === 'string') {
        // Intenta detectar un mensaje común desde el backend
        if (rawError.includes('Company already exists')) {
          mensaje = 'La empresa ya existe en este género.';
        } else {
          mensaje = rawError; // por si es texto plano
        }
      } else if (rawError?.message) {
        mensaje = rawError.message;
      }

      this.toastr.error(mensaje, 'Error');
      setTimeout(() => {
        this.mesnaje.set('');
      }, 3000);
    }
  });
}
  //eliminar Slipper
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

  //Actualizar Imagen
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

  //QR Generate
  generateQR() {
    this.qrCodeService.generateQrCodes(this.slippers()).subscribe(response => {
      this.downloadFile(response);
    }, error => {
      console.error('Error generating QR codes', error);
    });
  }

  private downloadFile(data: Blob) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

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
}