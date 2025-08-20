import { Component } from '@angular/core';
import { NavBarsVentasComponent } from "../../../../../shared/components/navbars/nav-bars-ventas/nav-bars-ventas.component";
import { SaleDataService } from '../../../../service/sale-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';

@Component({
  selector: 'app-filter-ventas',
  imports: [NavBarsVentasComponent,CopiarTextoDirective, CommonModule, FormsModule, PayTypeTranslatePipe, SizeFormatPipe],
  templateUrl: './filter-ventas.component.html',
  styleUrl: './filter-ventas.component.css'
})
export class FilterVentasComponent {

  dni: string = '';
  ticket: string = '';
  tickets: any[] = [];
  searchType: 'dni' | 'ticket' = 'dni';

  showResults: boolean = false;
  totalResults: number = 0;
  errorMessage: string = '';

  constructor(private ticketService: SaleDataService) { }

  searchTickets() {
    this.errorMessage = '';
    this.tickets = [];
    this.showResults = true;

    let dniToSearch: string | undefined = undefined;
    let ticketToSearch: string | undefined = undefined;

    if (this.searchType === 'dni') {
      const cleaned = this.dni.trim();
      if (!cleaned) {
        this.errorMessage = 'Debe ingresar un DNI para buscar.';
        return;
      }
      dniToSearch = cleaned;
    } else {
      const cleaned = this.ticket.trim();
      if (!cleaned) {
        this.errorMessage = 'Debe ingresar un número de ticket para buscar.';
        return;
      }
      ticketToSearch = cleaned;
    }

    this.ticketService.searchTicketsByDniOrTicket(dniToSearch, ticketToSearch)
      .subscribe({
        next: (data) => {
          this.tickets = data;
          this.totalResults = data.length;
          if (data.length === 0) {
            if (this.searchType === 'dni') {
              this.errorMessage = `No se encontraron tickets para el DNI: ${this.dni.trim()}`;
            } else {
              this.errorMessage = `No se encontraron tickets para el número de ticket: ${this.ticket.trim()}`;
            }
          }
        },
        error: (err) => {
          // Mensaje amigable, sin detalles técnicos
          if (this.searchType === 'dni') {
            this.errorMessage = `DNI no  encontrando  o mal escrito para: ${this.dni.trim()}. Intente nuevamente.`;
          } else {
            this.errorMessage = `Ticket no  encontrado  o mal escrito para: ${this.ticket.trim()}. Intente nuevamente.`;
          }
        }
      });
  }

  closeResults() {
    this.showResults = false;
    this.errorMessage = '';
  }

}
