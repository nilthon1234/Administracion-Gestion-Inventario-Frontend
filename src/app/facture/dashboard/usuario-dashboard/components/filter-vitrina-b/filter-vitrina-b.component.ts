import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../../service/data.service';
import { VitrinaBService } from '../../../../service/vitrina-b.service';
import { GeneroItem, TallaItem, TallasPorGenero, Vitrina, VitrinaRequest } from '../../../../../shared/models/vitrina';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SizeComponent } from "../size/size.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { NavbarsVitrinasBComponent } from "../../../../../shared/components/navbars/navbars-vitrinas-b/navbars-vitrinas-b.component";
import { VitrinaAService } from '../../../../service/vitrina-a.service';
import { SlipperService } from '../../../../service/slipper.service';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
export interface TiposResponse {
  conTalla: string[];
  sinTalla: string[];
}


@Component({
  selector: 'app-filter-vitrina-b',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SizeComponent, MatPaginatorModule, 
    CopiarTextoDirective, NavbarsVitrinasBComponent,SizeFormatPipe],
  templateUrl: './filter-vitrina-b.component.html',
  styleUrl: './filter-vitrina-b.component.css'
})
export class FilterVitrinaBComponent implements OnInit {
  formFiltro: FormGroup;
  marcas: any[] = [];
  resultados: Vitrina[] = [];

  busquedaRealizada: boolean = false;

  //Para la paginacion
  currentPage: number = 0;
  pageSize: number = 50;
  totalElements: number = 0;
  totalPages: number = 0;

  // Variables del modal
  showModal = false;
  generos: GeneroItem[] = [];
  tallasData!: TallasPorGenero;
  tallasFiltradas: TallaItem[] = [];

  tiposConTalla: string[] = [];
  tiposSinTalla: string[] = [];
  todosLosTipos: string[] = [];

  tallasRopa: string[] = ['xs', 's', 'm', 'l', 'xl'];
  form = {
    codToday: '',
    company: '',
    type: '',
    producto: '',
    cantidad: '',
    genero: '',
    tallasSeleccionadas: [] as string[]
  };

  constructor(
    private vitrinaService: VitrinaBService,
    private dataService: DataService,
    private toastr: ToastrService,
    private slipperService: SlipperService,
    private filterSlipperService: FilterSlipperService,
    private fb: FormBuilder,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) {
    this.formFiltro = this.fb.group({
      brand: [''],
      codToday: [''],
      company: [''],
    });
  }

  ngOnInit(): void {
    this.cargarMarcas();
    this.cargarGeneros();
    this.cargarTallas();
    this.cargarTipos();
  }

  cargarTipos(): void {
    this.slipperService.generoTipos().subscribe({
      next: (response: TiposResponse) => {
        this.tiposConTalla = response.conTalla || [];
        this.tiposSinTalla = response.sinTalla || [];
        this.todosLosTipos = [...this.tiposConTalla, ...this.tiposSinTalla];
      },
      error: (error) => {
        console.error('Error al cargar tipos:', error);
      }
    });
  }
  cargarMarcas(): void {
    this.dataService.getMarca().subscribe({
      next: (marcas) => {
        this.marcas = marcas;
      },
      error: (err) => {
        console.log('Error al cargar marcas', err);
      }
    });
  }

  cargarGeneros(): void {
    this.dataService.getGenero().subscribe({
      next: (data) => {
        this.generos = data;
      },
      error: (err) => {
        console.log('Error al cargar géneros', err);
      }
    });
  }

  cargarTallas(): void {
    this.dataService.getTallas().subscribe({
      next: (data) => {
        this.tallasData = data;
      },
      error: (err) => {
        console.log('Error al cargar tallas', err);
      }
    });
  }

  buscar(): void {
    this.busquedaRealizada = true; // Activamos el flag

    const { brand, codToday, company } = this.formFiltro.value;
    this.vitrinaService.buscarPorFiltros(
      brand,
      codToday,
      company,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (data) => {
        this.resultados = data.content || [];
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;

        // Después de 2 segundos, volvemos a false
        setTimeout(() => {
          this.busquedaRealizada = false;
          this.cdRef.detectChanges(); // Detectamos cambios para actualizar la vista
        }, 2000);
      },
      error: (err) => {
        this.resultados = [];

        // También desactivamos después de 2 segundos en caso de error
        setTimeout(() => {
          this.busquedaRealizada = false;
          this.cdRef.detectChanges();
        }, 2000);

        console.error('Error al buscar:', err);
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

  abrirModal() {
    this.cerrarModal();

    this.resetearModal();
  }
  tipoBusqueda = '';
  valorBusqueda = '';
  buscandoProducto = false;
  productoEncontrado: any = null;
  errorBusqueda = false;
  mensajeError = '';

  // Variables para registro
  cantidadUnico = 1;
  tallasSeleccionadas: string[] = [];
  resetearModal() {
    this.tipoBusqueda = '';
    this.valorBusqueda = '';
    this.buscandoProducto = false;
    this.productoEncontrado = null;
    this.errorBusqueda = false;
    this.mensajeError = '';
    this.cantidadUnico = 1;
    this.tallasSeleccionadas = [];
  }
  abrirModal2() {
    this.showModal = true;
    this.resetearModal();
  }

  cerrarModal() {
    this.showModal = false;
    this.resetForm();
    this.cdRef.detectChanges();
  }

  onTypeChange() {
    this.form.genero = '';
    this.form.cantidad = '';
    this.form.tallasSeleccionadas = [];
    this.tallasFiltradas = [];
  }

  onGeneroChange() {
    const generoMap: { [key: string]: string } = {
      'Hombre': 'hombre',
      'Mujer': 'mujer',
      'Niño': 'niño',
      'Niña': 'niña',
      'Bebe': 'bebe'
    };

    const key = generoMap[this.form.genero];

    if (this.tallasData && key) {
      // Si el tipo de producto es PANTALÓN, POLO o POLERA, muestra las tallas de ropa
      if (this.form.type === 'PANTALON' || this.form.type === 'POLO' || this.form.type === 'POLERA') {
        this.tallasFiltradas = this.tallasRopa.map(talla => ({ id: talla, talla }));
      } else {
        // De lo contrario, usa las tallas de calzado
        this.tallasFiltradas = this.tallasData[key] || [];
      }
    }
  }



  seleccionarTalla(talla: string) {
    this.tallasTemporales.push(talla); // Usa el array temporal
  }


  resetForm() {
    this.form = {
      codToday: '',
      company: '',
      type: '',
      producto: '',
      cantidad: '',
      genero: '',
      tallasSeleccionadas: []
    };
    this.tallasTemporales = [];
    this.tallasFiltradas = [];
  }

  onSubmit() {
    this.form.tallasSeleccionadas = [...this.tallasTemporales];
    // Validaciones básicas
    if (!this.form.type) {
      alert('Por favor selecciona un tipo de producto');
      return;
    }

    if (!this.form.codToday) {
      alert('Por favor completa los campos Código');
      return;
    }

    let tallasFinal: string[] = [];

    // Verifica si el tipo de producto requiere tallas
    if (this.tiposConTalla.includes(this.form.type) || ['PANTALON', 'POLO', 'POLERA', 'ZAPATILLAS', 'SANDALIAS', 'BOTINES'].includes(this.form.type)) {
      if (!this.form.genero) {
        alert('Por favor selecciona un género');
        return;
      }

      if (this.form.tallasSeleccionadas.length === 0) {
        alert('Por favor selecciona al menos una talla');
        return;
      }

      tallasFinal = [...this.form.tallasSeleccionadas];
    } else if (this.tiposSinTalla.includes(this.form.type)) {
      if (!this.form.cantidad || parseInt(this.form.cantidad) <= 0) {
        alert('Por favor ingresa una cantidad válida');
        return;
      }

      tallasFinal = [this.form.cantidad];
    }

    const payload: VitrinaRequest = {
      codToday: this.form.codToday,
      company: this.form.company,
      type: this.form.type,
      tallas: tallasFinal
    };

    this.vitrinaService.registrarProducto(payload).subscribe({
      next: (response) => {
        alert('Producto registrado exitosamente');
        this.cerrarModal();
        this.buscar();
      },
      error: (error) => {
        alert('Error al registrar producto: Código de Empresa ya Existe o CodToday ya existe en Vitrina');
        console.error('Error:', error);
      }
    });
  }
  tallasTemporales: string[] = [];

  eliminarTalla(index: number) {
    this.tallasTemporales.splice(index, 1); // Elimina del array temporal
  }

  //actualizacion cantidad o tallas

  editarFilaIndex: number | null = null;
  modoEdicion: 'talla' | 'cantidad' | null = null;
  valorTemporal: any = null;

  // filter-vitrina-slipper.component.ts
  editarTalla(item: any, index: number): void {
    this.currentItemForSizeUpdate = {
      ...item,
      // Manejo seguro del campo size
      size: this.parseSizes(item.size)
    };
    this.showSizeModal = true;
  }

  // Nuevo método para parsear las tallas
  private parseSizes(sizeInput: any): string[] {
    if (!sizeInput) return [];
    if (Array.isArray(sizeInput)) return sizeInput.map(s => s.toString().trim());
    if (typeof sizeInput === 'string') return sizeInput.split(',').map(s => s.trim());
    return [sizeInput.toString().trim()];
  }

  editarCantidad(item: any, index: number) {
    this.itemSeleccionado = item;
    this.mostrarModal = true;
  }

  actualizarCampo(item: any) {
    const body: any = {
      codToday: item.codToday,
      company: item.company,
      type: item.type
    };

    if (this.modoEdicion === 'cantidad') {
      body.amount = this.valorTemporal;
    } else if (this.modoEdicion === 'talla') {
      if (typeof this.valorTemporal === 'string') {
        body.tallas = this.valorTemporal.split(',').map((v: string) => v.trim());
      } else {
        body.tallas = this.valorTemporal;
      }
    }

    this.vitrinaService.updateVitrina(body).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Actualización exitosa');
        this.editarFilaIndex = null;
        this.modoEdicion = null;
        this.buscar()
      },
      error: (error) => {
        // Aquí capturamos el mensaje de error del backend
        const mensajeError = error.error?.error || 'Error al actualizar';

        // Mostramos el mensaje personalizado
        this.toastr.error(mensajeError);

        console.error('Error al actualizar:', error);
      }
    });
  }
  //para mostarr el componente Size
  mostrarModalSize = false;
  productoSeleccionado: any = null;
  abrirModalSize(item: any) {
    this.productoSeleccionado = { ...item }; // Copiar datos para edición
    this.mostrarModalSize = true;
  }

  //actualizar talla showSizeModal = false;
  showSizeModal = false;
  currentItemForSizeUpdate: any;

  handleSizeUpdate(updatedSizes: string[]): void {
    const payload = {
      type: this.currentItemForSizeUpdate.type,
      codToday: this.currentItemForSizeUpdate.codToday,
      company: this.currentItemForSizeUpdate.company,
      tallas: updatedSizes
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Prueba primero con PUT
    this.http.put('http://localhost/vitrina-b/updateVitrina', payload, { headers })
      .pipe(
        // Si falla con PUT, intenta con POST
        catchError(error => {
          if (error.status === 405) {
            return this.http.post('http://localhost/vitrina-b/updateVitrina', payload, { headers });
          }
          throw error;
        })
      )
      .subscribe({
        next: (response) => {
          // Actualizar UI
          const index = this.resultados.findIndex(
            item => item.codToday === this.currentItemForSizeUpdate.codToday
          );
          if (index !== -1) {
            this.resultados[index].size = updatedSizes.join(', ');
          }
          this.showSizeModal = false;
          this.buscar();

          // Mostrar mensaje de éxito
          alert('Tallas actualizadas correctamente');
        },
        error: (error) => {
          // Mostrar mensaje de error detallado
          let errorMessage = 'Talla Selecionada no disponibles';
          if (error.status === 405) {
            errorMessage = 'Método no permitido. Contacte al administrador.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          alert(errorMessage);
        }
      });
  }

  handleSizeCancel(): void {
    this.showSizeModal = false;
  }

  actualizarCampos(item: any): void {
    if (this.modoEdicion === 'cantidad') {
      const payload = {
        type: item.type,
        codToday: item.codToday,
        company: item.company,
        amount: this.valorTemporal
      };

      this.http.post('http://localhost:80/vitrina-b/updateVitrina', payload).subscribe({
        next: (response) => {
          item.amount = this.valorTemporal;
          this.editarFilaIndex = null;
          this.modoEdicion = null;
        },
        error: (error) => {
          console.error('Error al actualizar cantidad:', error);
        }
      });
    }
  }

  //tallas de ropa 
  showClothingSizeModal = false;
  currentClothingItem: any = null;
  clothingSizes = ['xs', 's', 'm', 'l', 'xl'];
  clothingSizeCounts: { [key: string]: number } = {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0
  };

  editarRopa(item: any) {
    this.currentClothingItem = item;
    // Resetear contadores
    this.clothingSizeCounts = {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0
    };
    this.showClothingSizeModal = true;
  }


  guardarTallasRopa() {
    const tallas: string[] = [];
    for (const talla of this.clothingSizes) {
      const count = this.clothingSizeCounts[talla] || 0;
      for (let i = 0; i < count; i++) {
        tallas.push(talla);
      }
    }

    const body = {
      type: this.currentClothingItem.type,
      codToday: this.currentClothingItem.codToday,
      company: this.currentClothingItem.company,
      tallas
    };

    this.vitrinaService.updateVitrina(body).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Tallas actualizadas');
        this.showClothingSizeModal = false;
        this.buscar();
      },
      error: (error) => {
        this.toastr.error(error.error?.error || 'Error al actualizar');
      }
    });
  }
  cancelarTallasRopa() {
    this.showClothingSizeModal = false;
    this.currentClothingItem = null;
  }
  //agrandar Imagen
  selectedImagenUrl: string | null = null;
  openImageModal(url: string) {
    this.selectedImagenUrl = url;
  }
  closeImageModal() {
    this.selectedImagenUrl = null;
  }

  // Nueva búsqueda
  nuevaBusqueda() {
    this.resetearModal();
  }

  buscarProducto() {
    if (!this.tipoBusqueda || !this.valorBusqueda.trim()) {
      alert('Por favor completa los campos de búsqueda');
      return;
    }

    this.buscandoProducto = true;
    this.errorBusqueda = false;
    this.productoEncontrado = null;

    const codToday = this.tipoBusqueda === 'codToday' ? this.valorBusqueda.trim() : undefined;
    const company = this.tipoBusqueda === 'company' ? this.valorBusqueda.trim() : undefined;

    this.filterSlipperService.buscarPorCodTodayOCompany(codToday, company)
      .subscribe({
        next: (resultados) => {
          this.buscandoProducto = false;

          // Manejar tanto array como objeto único
          let producto = null;

          // Usar 'any' para evitar errores de TypeScript
          const respuesta = resultados as any;

          if (Array.isArray(respuesta)) {
            // Si es un array, tomar el primer elemento
            if (respuesta.length > 0) {
              producto = respuesta[0];
            }
          } else if (respuesta && typeof respuesta === 'object' && respuesta.id) {
            // Si es un objeto único con id, es un producto válido
            producto = respuesta;
          }

          if (producto) {
            this.productoEncontrado = producto;
            this.errorBusqueda = false;
          } else {
            this.errorBusqueda = true;
            this.mensajeError = 'No se encontró ningún producto con ese código.';
          }
        },
        error: (error) => {
          this.buscandoProducto = false;
          this.errorBusqueda = true;
          this.mensajeError = 'Error al buscar el producto. Inténtalo de nuevo.';
        }
      });
  }
  // Validar si puede realizar búsqueda
  puedeRealizarBusqueda(): boolean {
    return !!(this.tipoBusqueda && this.valorBusqueda && this.valorBusqueda.trim());
  }
  // Verificar si se puede registrar
  puedeRegistrar(): boolean {
    if (!this.productoEncontrado) {
      return false;
    }

    // Para productos únicos, necesita cantidad válida
    if (this.productoEncontrado.producto === 'UNICO') {
      return this.cantidadUnico > 0;
    }

    // Para productos con tallas, necesita al menos una talla seleccionada
    return this.tallasSeleccionadas.length > 0;
  }

  seleccionarSize(size: { name: string, cantidad: number }) {
    if (size.cantidad <= 0) {
      return; // No permitir seleccionar tallas sin stock
    }

    // Agregar la talla al historial
    this.tallasSeleccionadas.push(size.name);
  }

  // Eliminar talla seleccionada del historial
  eliminarTallaSeleccionada(index: number) {
    if (index >= 0 && index < this.tallasSeleccionadas.length) {
      this.tallasSeleccionadas.splice(index, 1);
    }
  }

  registrarProducto() {
    if (!this.puedeRegistrar()) {
      this.mostrarMensaje('Por favor completa los campos requeridos', 'error');
      return;
    }

    let tallasFinal: string[] = [];

    if (this.esProductoUnico()) {
      tallasFinal = [this.cantidadUnico.toString()];
    } else {
      tallasFinal = [...this.tallasSeleccionadas];
    }

    const payload: VitrinaRequest = {
      codToday: this.productoEncontrado.codToday,
      company: this.productoEncontrado.company,
      type: this.productoEncontrado.type,
      tallas: tallasFinal
    };

    this.vitrinaService.registrarProducto(payload).subscribe({
      next: (response: string) => {
        // El servidor devuelve el mensaje de éxito como texto plano
        alert(response || 'Producto registrado exitosamente en Vitrina');
        this.cerrarModal();
        this.buscar(); // Actualizar la lista
      },
      error: (error: any) => {
        // Manejo de errores HTTP
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          this.mostrarMensaje('Error de conexión: ' + error.error.message, 'error');
        } else {
          // El servidor devuelve el mensaje de error como texto plano
          const serverError = error.error;
          const defaultMessage = 'Error al registrar producto';

          // Puedes personalizar mensajes según lo que devuelva el servidor
          let errorMessage = defaultMessage;

          if (typeof serverError === 'string') {
            errorMessage = serverError.includes('already exists')
              ? 'El producto ya está registrado en la vitrina'
              : serverError;
          } else if (error.status === 409) {
            errorMessage = 'El producto ya existe en la vitrina (Conflicto)';
          } else if (error.status === 400) {
            errorMessage = 'Datos inválidos enviados al servidor';
          }

          this.mostrarMensaje(errorMessage, 'error');
        }
        console.error('Error al registrar:', error);
      }
    });
  }
  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info') {
    // Implementa tu propio sistema de notificaciones
    // Ejemplo simple con alertas:
    if (tipo === 'success') {
      alert('✅ ' + mensaje);
    } else {
      alert('❌ ' + mensaje);
    }

    // O usando un servicio de notificaciones:
    // this.notificationService.show(mensaje, tipo);
  }


  // Verificar si tiene sizes disponibles
  tieneSizesDisponibles(): boolean {
    if (!this.productoEncontrado || !this.productoEncontrado.sizes) {
      return false;
    }

    return this.getSizesDisponibles().length > 0;
  }

  // Obtener sizes disponibles (con stock > 0)
  getSizesDisponibles(): Array<{ name: string, cantidad: number }> {
    if (!this.productoEncontrado || !this.productoEncontrado.sizes) {
      return [];
    }

    const sizes = [];
    const sizesObj = this.productoEncontrado.sizes;

    for (const [sizeName, cantidad] of Object.entries(sizesObj)) {
      if (typeof cantidad === 'number' && cantidad > 0) {
        sizes.push({
          name: sizeName,
          cantidad: cantidad
        });
      }
    }

    return sizes.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Formatear nombre de talla para mostrar
  formatSizeName(sizeName: string): string {
    // Remover prefijos como 'usa' y reemplazar guiones bajos con puntos
    return sizeName
      .replace(/^usa/, '')
      .replace(/^eu/, '')
      .replace(/_/g, '.')
      .toUpperCase();
  }
  getTipoProducto(): string {
    if (!this.productoEncontrado) return 'N/A';
    return this.productoEncontrado.producto === null ? 'null' :
      this.productoEncontrado.producto === undefined ? 'undefined' :
        this.productoEncontrado.producto;
  }
  // Verificar si es un producto único
  esProductoUnico(): boolean {
    if (!this.productoEncontrado) return false;

    // Puede ser exactamente 'UNICO' o null/undefined (algunos productos únicos vienen como null)
    return this.productoEncontrado.producto === 'UNICO' ||
      this.productoEncontrado.producto === null ||
      this.productoEncontrado.producto === undefined;
  }

  //eliminar Size
  eliminarSize(id: number, size: string, filaIndex: number) {
    this.vitrinaService.eliminarSize(id, size).subscribe(() => {
      this.editarFilaIndex = -1;
      this.valorTemporal = '';
      // Recarga la lista después de eliminar el size
      this.buscar();
    });
  }

  // Para descontar
  modoEdicionUnico: 'cantidad' | 'descontar' | null = null;
  mostrarModal = false;
  cantidadModal = 0;
  itemSeleccionado: any = null;

  confirmarAccion(accion: 'aumentar' | 'descontar') {
    if (!this.cantidadModal || this.cantidadModal <= 0) {
      alert('Por favor ingrese una cantidad válida.');
      return;
    }

    if (accion === 'aumentar') {
      // Usamos actualizarCampo para aumentar
      this.valorTemporal = this.itemSeleccionado.amount + this.cantidadModal;
      this.modoEdicion = 'cantidad';
      this.actualizarCampo(this.itemSeleccionado);
    } else {
      // Descontamos usando el nuevo endpoint
      this.vitrinaService.descontarCantidad(this.itemSeleccionado.codToday, this.cantidadModal).subscribe({
        next: () => {
          this.itemSeleccionado.amount -= this.cantidadModal;
          this.toastr.success('Cantidad descontada exitosamente');
          this.buscar(); // Refresca la lista
          this.cerrarModal();
        },
        error: (err) => {
          const mensaje = err.error?.error || 'Error al descontar';
          this.toastr.error(mensaje);
        }
      });
    }
  }

  cerrarModal2() {
    this.mostrarModal = false;
    this.cantidadModal = 0;
    this.itemSeleccionado = null;
  }
  //actus descontar y aumnetar
  items: any[] = [];
  idSeleccionado!: number;
  cantidad: number = 1;
  abrirModal3(id: number): void {
    this.idSeleccionado = id;
    this.mostrarModal = true;
  }
  
  cerrarModal3(): void {
    this.mostrarModal = false;
  }
  aumentarCantidad(id: number): void {
    if(this.cantidad <= 0){
      this.toastr.warning('Por Favor ingresa una cantidad valida.')
      return;
    }
    this.vitrinaService.aumentarAmount(id, this.cantidad).subscribe({
      next: (mensaje) => {
        this.toastr.success(mensaje);
        this.cerrarModal3();
        this.buscar();
        // Actualiza la lista de items si es necesario
      },
      error: (err) => {
        const mensaje = typeof err.error === 'string' ? err.error : 'Error al aumentar la cantidad';
        this.toastr.error(mensaje);
      }
    });
  }

  // Método para descontar la cantidad
  descontarCantidad(id: number): void {
    if(this.cantidad <= 0){
      this.toastr.warning('Por Favor ingresa una cantidad valida.')
      return;
    }
    this.vitrinaService.descontarAmount(id, this.cantidad).subscribe({
      next: (mensaje) => {
        this.toastr.success(mensaje);
        this.cerrarModal3();
        this.buscar();
        // Actualiza la lista de items si es necesario
      },
      error: (err) => {
        const mensaje = typeof err.error === 'string' ? err.error : 'Error al aumentar la cantidad';
        this.toastr.error(mensaje);
      }
    });
  }


}
