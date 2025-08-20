import { Component, OnInit, signal } from '@angular/core';
import { NavbarsSidebarVitrinaComponent } from "../../../../../shared/components/navbars/navbars-sidebar-vitrina/navbars-sidebar-vitrina.component";
import { Slipper } from '../../../../../shared/models/slippert';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../service/data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeparationService } from '../../../../service/separation.service';
import { Separation } from '../../../../../shared/models/separation';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';

@Component({
  selector: 'app-filter-sandal',
  standalone: true,
  imports: [NavbarsSidebarVitrinaComponent, CommonModule, FormsModule, MatPaginatorModule, CopiarTextoDirective],
  templateUrl: './filter-sandal.component.html',
  styleUrl: './filter-sandal.component.css'
})
export class FilterSandalComponent implements OnInit {
  marcas: any[] = [];
  tallasJson: any = {};
  tallasFiltradas: any[] = [];
  grupos: string[] = ['bebe', 'niño', 'niña', 'mujer', 'hombre'];
  grupoSeleccionado: string | null = null;
  tipos: string[] = [];

  //Para la paginacion
  currentPage: number = 0;
  pageSize: number = 100;
  totalElements: number = 0;
  totalPages: number = 0;

  filtros = {
    brand: null as string | null,
    codToday: '',
    company: '',
    size: null as string | null
  };

  sandal: Slipper[] = [];
  selectedCod = signal<string | null>(null);

  constructor(
    private dataService: DataService,
    private filterSlipper: FilterSlipperService,
    private separationService: SeparationService,
  ) { }

  ngOnInit(): void {
    this.cargarFiltros();
    this.buscar(); // inicial
    this.separationService.getAllSeparations().subscribe(data => {
      this.separation = data;
    });
  }

  cargarFiltros() {
    this.dataService.getMarca().subscribe(data => this.marcas = data);
    this.dataService.getTalla().subscribe(data => this.tallasJson = data);
  }

  actualizarTallas() {
    if (this.grupoSeleccionado && this.tallasJson[this.grupoSeleccionado]) {
      this.tallasFiltradas = this.tallasJson[this.grupoSeleccionado];
    } else {
      this.tallasFiltradas = [];
    }
  }

  // En tu componente
  // En tu componente
  buscar() {
    this.filterSlipper.buscarZapatillasPage(
      this.grupoSeleccionado || 'sandalias',
      this.filtros.brand || undefined,
      'null',
      this.filtros.size || undefined,
      this.currentPage,
      this.pageSize
    ).subscribe((response: any) => {
      // Filtra solo las sandalias ANTES de asignar a this.sandal
      const sandalias = response.content.filter((item: any) => item.type === 'SANDALIA');

      // Asigna los datos filtrados
      this.sandal = sandalias;

      // Actualiza la paginación
      this.totalElements = response.totalElements;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);

      // Aplicar filtros adicionales
      this.sandal = this.sandal.filter(item => {
        const codMatch = !this.filtros.codToday || item.codToday.includes(this.filtros.codToday);
        const companyMatch = !this.filtros.company || item.company.includes(this.filtros.company);
        const sizeMatch = !this.filtros.size || this.hasStockInSize(item, this.filtros.size);
        return codMatch && companyMatch && sizeMatch;
      });
    });
  }

  // Método para manejar cambios de página
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscar();
  }


  resetPagination(): void {
    this.currentPage = 0;
    this.pageSize = 100;
  }

  hasStockInSize(item: Slipper, size: string): boolean {
    // Convertir la talla a los posibles formatos de clave
    const possibleKeys = this.getPossibleSizeKeys(size);

    // Verificar si alguna de las claves posibles existe y tiene stock
    for (const key of possibleKeys) {
      if (key in item.sizes && item.sizes[key] > 0) {
        console.log(`Encontrado stock para ${item.codToday} en talla ${key}: ${item.sizes[key]}`); // Para depuración
        return true;
      }
    }

    return false;
  }

  getPossibleSizeKeys(size: string): string[] {
    // Eliminar el .0 si existe
    const cleanSize = size.endsWith('.0') ? size.substring(0, size.length - 2) : size;

    // Crear varias posibilidades para la clave
    return [
      `eu${cleanSize}`, // formato sin punto: eu20
      `eu${cleanSize.replace('.', '_')}`, // formato con punto reemplazado: eu20_5
      `usa${cleanSize}`, // Por si acaso usa formato usa
      `usa${cleanSize.replace('.', '_')}` // usa con punto reemplazado
    ];
  }

  mapTallaToKey(talla: string): string {
    // Simplificar tallas que terminan en .0 (como "20.0" -> "20")
    if (talla.endsWith('.0')) {
      return `eu${talla.substring(0, talla.length - 2)}`;
    }

    // Para el resto de tallas con punto decimal
    return `eu${talla.replace('.', '_')}`;
  }

  toggleSizes(cod: string) {
    const item = this.sandal.find(s => s.codToday === cod);
    if (!item || item.amount === 0) return; // No hacer nada si stock 0 o item no existe
    this.selectedCod.update(current => current === cod ? null : cod);
  }


  getAvailableSizes(sizes?: Record<string, number>): string[] {
    if (!sizes) return [];
    return Object.keys(sizes).filter(k => sizes[k] > 0);
  }


  //listado interno -> separaciones
  separation: Separation[] = [];

  resaltado(codToday: string, sizeName: string): boolean {
    const normalize = (name: string) => name.trim().toLowerCase().replace(/^usa|^eu/, '');
    return this.separation.some(sep =>
      sep.codToday === codToday &&
      sep.size.split(',').map(s => normalize(s)).includes(normalize(sizeName)) &&
      (sep.idClient.separationType === 'NUEVO' || sep.idClient.separationType == 'AMORTIZANDOCE')
    );
  }


  //a ver si sale 

  getSeparationCount(codToday: string, sizeName: string): number {
    const normalize = (name: string) => name.trim().toLowerCase().replace(/^usa|^eu/, '');

    return this.separation.filter(sep =>
      sep.codToday === codToday &&
      sep.size.split(',').map(s => normalize(s)).includes(normalize(sizeName)) &&
      (sep.idClient.separationType === 'NUEVO' || sep.idClient.separationType === 'AMORTIZANDOCE')
    ).length;
  }

  shouldHighlight(codToday: string, sizeName: string): boolean {
    return this.getSeparationCount(codToday, sizeName) > 0;
  }
  //agrandar imagen
  // Agregar a FilterSandalComponent
  selectedImageUrl: string | null = null;

  openImageModal(url: string) {
    this.selectedImageUrl = url;
  }

  closeImageModal() {
    this.selectedImageUrl = null;
  }
  //Para los sizes modo  flotante 

  // Retorna el item sandal seleccionado o null
  getSelectedItem(): Slipper | null {
    const cod = this.selectedCod();
    if (!cod) return null;
    return this.sandal.find(item => item.codToday === cod) || null;
  }

  closeSizes() {
    this.selectedCod.set(null);
  }


}