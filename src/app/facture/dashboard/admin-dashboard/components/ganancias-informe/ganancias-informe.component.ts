import { Component, OnInit } from '@angular/core';
import { NavbarRendimientoComponent } from "../../../../../shared/components/navbars/navbar-rendimiento/navbar-rendimiento.component";
import { ProfitabilityStats, SaleRendimientoService, Ticket } from '../../../../service/sale-rendimiento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
import { BotonSesionTiempoComponent } from "../../../../../shared/components/button/boton-sesion-tiempo/boton-sesion-tiempo.component";
import { PdfService } from '../../../../service/pdfRentabilidad.service';

@Component({
    selector: 'app-ganancias-informe',
    imports: [NavbarRendimientoComponent, CommonModule, FormsModule, CustomDateFormatPipe, CopiarTextoDirective, SizeFormatPipe, BotonSesionTiempoComponent],
    templateUrl: './ganancias-informe.component.html',
    styleUrl: './ganancias-informe.component.css'
})
export class GananciasInformeComponent implements OnInit {

    selectedDate: string = '';
    tickets: Ticket[] = [];
    loading = false;

    dailyStats: ProfitabilityStats = {
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        profitMargin: 0,
        ticketCount: 0
    };

    weeklyStats: ProfitabilityStats = {
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        profitMargin: 0,
        ticketCount: 0
    };

    monthlyStats: ProfitabilityStats = {
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        profitMargin: 0,
        ticketCount: 0
    };

    constructor(
        private salesService: SaleRendimientoService,
        private pdfService: PdfService
    ) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        this.selectedDate = `${year}-${month}-${day}`;

    }

    ngOnInit() {
        this.loadTickets();
    }

    loadTickets() {
        this.loading = true;
        this.tickets = []; // Limpiar tickets antes de cargar nuevos
        this.salesService.getTickets(this.selectedDate).subscribe({
            next: (response) => {
                this.tickets = response.ticket || [];
                this.calculateStats();
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading tickets:', error);
                this.loading = false;
            }
        });
    }

    calculateStats() {
        // Pasa selectedDate a los métodos del servicio
        this.dailyStats = this.salesService.calculateDailyStats(this.tickets, this.selectedDate);
        this.weeklyStats = this.salesService.calculateWeeklyStats(this.tickets, this.selectedDate);
        this.monthlyStats = this.salesService.calculateMonthlyStats(this.tickets, this.selectedDate);
    }

    toggleDetails(ticket: Ticket) {
        ticket.showDetails = !ticket.showDetails;
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    generatePdfReport() {
        if (this.tickets.length === 0) {
            alert('No hay datos para generar el reporte');
            return;
        }

        try {
            this.pdfService.generateProfitabilityReport(
                this.tickets,
                this.dailyStats,
                this.weeklyStats,
                this.monthlyStats,
                this.selectedDate
            );
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error al generar el PDF. Por favor, intente nuevamente.');
        }
    }

}
