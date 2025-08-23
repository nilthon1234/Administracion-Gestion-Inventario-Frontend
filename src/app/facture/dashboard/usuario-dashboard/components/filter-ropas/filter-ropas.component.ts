import { Component, OnInit } from '@angular/core';
import { NavbarsSidebarVitrinaComponent } from "../../../../../shared/components/navbars/navbars-sidebar-vitrina/navbars-sidebar-vitrina.component";
import { SizeKey, SlipperDTO } from '../../../../../shared/models/slippertDTO';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';
import { CommonModule } from '@angular/common';
import { PaginatedResponse } from '../../../../../shared/models/PaginatedResponse';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../../../../../shared/pipes/highlight.pipe';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { environment } from '../../../../../../environments/environmen';

@Component({
  selector: 'app-filter-ropas',
  imports: [NavbarsSidebarVitrinaComponent, CommonModule, FormsModule,CopiarTextoDirective],
  templateUrl: './filter-ropas.component.html',
  styleUrls: ['./filter-ropas.component.css']
})
export class FilterRopasComponent implements OnInit {
  imagenBaseUrl = environment.apiUrl;

  slippers: SlipperDTO[] = [];
  paginatedResponse: PaginatedResponse<SlipperDTO> | null = null;
  currentPage: number = 0;
  pageSize: number = 100;
  codTodayFilter: string = '';
  companyFilter: string = '';
  sizeFilter: string = '';

  sizeOptions: string[] = ['XS', 'S', 'M', 'L', 'XL'];

  constructor(private slipperService: FilterSlipperService) { }

  ngOnInit(): void {
    this.fetchSlippers(this.currentPage, this.pageSize);
  }
  readonly generoMap: Record<string, string> = {
    hombre: 'MAN',
    mujer: 'WOMEN',
    niño: 'CHILD',
    niña: 'LITTLEGIRL',
    bebe: 'BABY'
  };


  fetchSlippers(pageNumber: number, pageSize: number): void {
    this.slipperService.listarPorPantalonPoleraPolo(
      pageNumber,
      pageSize,
      this.codTodayFilter,
      this.companyFilter,
      this.sizeFilter
    ).subscribe(
      response => {
        this.paginatedResponse = response;
        this.slippers = response.content;
      },
      error => {
        console.error('Error fetching slippers:', error);
      }
    );
  }
  onCompanyInput(): void {
    // Si hay texto en el filtro de compañía, limpiamos el de código
    if (this.companyFilter) {
      this.codTodayFilter = '';
    }
    this.onSearch();
  }
  onCodTodayInput(): void {
    // Si hay texto en el filtro de código, limpiamos el de compañía
    if (this.codTodayFilter) {
      this.companyFilter = '';
    }
    this.onSearch();
  }
  onSizeFilterChange(): void {
  this.onSearch();
}

  clearFilters(): void {
    this.codTodayFilter = '';
    this.companyFilter = '';
    this.sizeFilter = '';
    this.onSearch();
  }
  clearFiltersBT(): void {
    this.codTodayFilter = '';
    this.companyFilter = '';
    this.sizeFilter = '';
    this.currentPage = 0;
    this.fetchSlippers(this.currentPage, this.pageSize);
  }

  onPageChange(pageNumber: number, event: Event): void {
    event.preventDefault();
    this.currentPage = pageNumber;
    this.fetchSlippers(this.currentPage, this.pageSize);
  }

  onSearch(): void {
    this.currentPage = 0;
    this.fetchSlippers(this.currentPage, this.pageSize);
  }

  generatePageArray(totalPages: number): number[] {
    return new Array(totalPages).fill(0).map((_, index) => index);
  }
  //visualizar los szes 
  selectedSlipper?: SlipperDTO | null = null;
  sizeKeys: SizeKey[] = ['s', 'm', 'l', 'xl', 'xs'];


  openSizeModal(slipper: SlipperDTO): void {
    this.selectedSlipper = JSON.parse(JSON.stringify(slipper));
    this.sizeKeys = Object.keys(slipper.sizes) as SizeKey[];
    this.updatePayload = { s: 0, m: 0, l: 0, xl: 0, xs: 0 };
    this.selectedAction = null;
    this.totalToUpdate = 0;
  }
  selectAction(action: 'aumentar' | 'descontar'): void {
    this.selectedAction = action;
  }

  adjustSize(sizeKey: SizeKey, increment: number): void {
    if (!this.selectedSlipper) return;

    const currentStock = this.selectedSlipper.sizes[sizeKey] || 0;
    const currentValue = this.updatePayload[sizeKey] || 0;

    if (this.selectedAction === 'descontar') {
      // Evitar descontar más que el stock disponible
      if (currentValue + increment > currentStock) {
        // Opcional: puedes mostrar una alerta visual al usuario
        alert(`No puedes descontar más de lo que hay disponible (${currentStock}) para talla ${sizeKey}`);
        return;
      }

      if (currentValue + increment < 0) {
        this.updatePayload[sizeKey] = 0;
      } else {
        this.updatePayload[sizeKey] += increment;
      }

    } else if (this.selectedAction === 'aumentar') {
      // Aumentar sin límite
      this.updatePayload[sizeKey] += increment;
      if (this.updatePayload[sizeKey] < 0) {
        this.updatePayload[sizeKey] = 0;
      }
    }

    // Recalcular total
    this.totalToUpdate = Object.values(this.updatePayload).reduce((a, b) => a + b, 0);
  }

  closeSizeModal(): void {
    this.selectedSlipper = null;
    this.sizeKeys = [];
  }

  increaseSize(sizeKey: SizeKey): void {
    if (this.selectedSlipper) {
      this.selectedSlipper.sizes[sizeKey]++;
    }
  }

  decreaseSize(sizeKey: SizeKey): void {
    if (this.selectedSlipper && this.selectedSlipper.sizes[sizeKey] > 0) {
      this.selectedSlipper.sizes[sizeKey]--;
    }
  }
  selectedAction: 'aumentar' | 'descontar' | null = null;
  updatePayload: Record<SizeKey, number> = { s: 0, m: 0, l: 0, xl: 0, xs: 0 };
  totalToUpdate: number = 0;


  confirmUpdate(): void {
    if (!this.selectedSlipper || !this.selectedAction) return;
    const isInvalidDescuento = this.selectedAction === 'descontar' &&
      this.sizeKeys.some(sizeKey => {
        const currentStock = this.selectedSlipper!.sizes[sizeKey];
        const toDiscount = this.updatePayload[sizeKey];
        return toDiscount > currentStock;
      });

    if (isInvalidDescuento) {
      alert('No puedes descontar más de lo disponible.');
      return;
    }

    const generoEsp = this.selectedSlipper.genero.toLowerCase(); // Ej: 'hombre'
    const genero = this.generoMap[generoEsp]; // Ej: 'MAN'
    const brand = this.selectedSlipper.brand;
    const codToday = this.selectedSlipper.codToday;

    if (!genero) {
      alert('Error: género no válido para URL');
      return;
    }

    const request$ = this.selectedAction === 'aumentar'
      ? this.slipperService.updateSize(genero, brand, codToday, this.updatePayload)
      : this.slipperService.discountSize(genero, brand, codToday, this.updatePayload);

    request$.subscribe(() => {
      alert(`Tallas ${this.selectedAction === 'aumentar' ? 'aumentadas' : 'descontadas'} con éxito`);
      this.closeSizeModal();
      this.fetchSlippers(this.currentPage, this.pageSize);
    });
  }

  //para agrandar la imgen 

  // Agrega estas propiedades a tu componente
  selectedImage: string | null = null;

  // Método para abrir el modal de imagen
  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  // Método para cerrar el modal de imagen
  closeImageModal() {
    this.selectedImage = null;
  }
}
