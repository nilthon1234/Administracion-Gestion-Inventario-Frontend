import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environmen';

export interface TicketResponse {
    ticket: Ticket[];
}

export interface Ticket {
    nro_ticket: string;
    sellerName: string | null;
    clientName: string | null;
    client_last_name: string | null;
    registrationTicket: string;
    dni: string;
    totalPagar: number | null;
    state: string | null;
    contador?: string;
    storeName: string | null;
    storeRuc: string | null;
    detail: TicketDetail[];
    showDetails?: boolean;
    calculatedTotal?: number;
    profitability?: number;
}

export interface TicketDetail {
    id: number;
    amount: number;
    codToday: string;
    company: string;
    genero?: string;
    type: string;
    size: string;
    price: number;
    precioFabrica: number;
    sub_total: number;
    state: string | null;
    payType: string;
    producto: string;
    totalPagar: number;
    especificacion: string;
    discount: number | null;
    increase: number | null;
}

export interface ProfitabilityStats {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    profitMargin: number;
    ticketCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class SaleRendimientoService {
    private baseUrl = `${environment.apiUrl}/sale`;

    constructor(private http: HttpClient) {}

    getTickets(fecha: string): Observable<TicketResponse> {
        // Asumimos que el backend devuelve tickets de todo el mes
        return this.http.get<TicketResponse>(`${this.baseUrl}/ticket?fecha=${fecha}`).pipe(
            map(response => {
                // Calcular totales y rentabilidad para cada ticket
                response.ticket = response.ticket.map(ticket => {
                    const calculatedTotal = this.calculateTicketTotal(ticket.detail);
                    const profitability = this.calculateTicketProfitability(ticket.detail);
                    return {
                        ...ticket,
                        calculatedTotal,
                        profitability,
                        showDetails: false
                    };
                });
                return response;
            })
        );
    }

    private calculateTicketTotal(details: TicketDetail[]): number {
        return details.reduce((total, detail) => total + (detail.sub_total || 0), 0);
    }

    private calculateTicketProfitability(details: TicketDetail[]): number {
        const totalRevenue = this.calculateTicketTotal(details);
        const totalCost = details.reduce((total, detail) => total + (detail.precioFabrica * detail.amount), 0);
        return totalRevenue - totalCost;
    }

    calculateDailyStats(tickets: Ticket[], selectedDate: string): ProfitabilityStats {
        const dailyTickets = tickets.filter(ticket => {
            const ticketDate = new Date(ticket.registrationTicket);
            const ticketDateOnly = new Date(ticketDate.getFullYear(), ticketDate.getMonth(), ticketDate.getDate());
            const selectedDateOnly = new Date(selectedDate + 'T00:00:00');
    
            return ticketDateOnly.getTime() === selectedDateOnly.getTime();
        });
    
        return this.calculateStats(dailyTickets);
    }

    calculateWeeklyStats(tickets: Ticket[], selectedDate: string): ProfitabilityStats {
        // Determinar el inicio y fin de la semana que contiene selectedDate
        const selected = new Date(selectedDate);
        const startOfWeek = new Date(selected);
        startOfWeek.setDate(selected.getDate() - selected.getDay()); // Lunes
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

        const weeklyTickets = tickets.filter(ticket => {
            const ticketDate = new Date(ticket.registrationTicket);
            return ticketDate >= startOfWeek && ticketDate <= endOfWeek;
        });

        return this.calculateStats(weeklyTickets);
    }

    calculateMonthlyStats(tickets: Ticket[], selectedDate: string): ProfitabilityStats {
        // Determinar el inicio y fin del mes que contiene selectedDate
        const selected = new Date(selectedDate);
        const startOfMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
        const endOfMonth = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);

        const monthlyTickets = tickets.filter(ticket => {
            const ticketDate = new Date(ticket.registrationTicket);
            return ticketDate >= startOfMonth && ticketDate <= endOfMonth;
        });

        return this.calculateStats(monthlyTickets);
    }

    private calculateStats(tickets: Ticket[]): ProfitabilityStats {
        const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.calculatedTotal || 0), 0);
        const totalCost = tickets.reduce(
            (sum, ticket) =>
                sum +
                ticket.detail.reduce((detailSum, detail) => detailSum + (detail.precioFabrica * detail.amount), 0),
            0
        );
        const totalProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        return {
            totalRevenue,
            totalCost,
            totalProfit,
            profitMargin,
            ticketCount: tickets.length
        };
    }
}