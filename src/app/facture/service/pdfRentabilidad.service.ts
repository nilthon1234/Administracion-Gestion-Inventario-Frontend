import { Injectable } from '@angular/core';
import { ProfitabilityStats, Ticket } from './sale-rendimiento.service';

import { jsPDF } from 'jspdf';


@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor() { }

    generateProfitabilityReport(
        tickets: Ticket[],
        dailyStats: ProfitabilityStats,
        weeklyStats: ProfitabilityStats,
        monthlyStats: ProfitabilityStats,
        selectedDate: string
    ): void {

        // CAMBIAR ESTA LÍNEA:
        // const doc = new jsPDF();
        // POR ESTA:
        const doc = new jsPDF();


        // ... resto del código igual
        let yPosition = 20;

        const addText = (text: string, x: number, y: number, fontSize = 12, style = 'normal') => {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', style);
            doc.text(text, x, y);
        };

        const addLine = (y: number) => {
            doc.setDrawColor(102, 126, 234);
            doc.setLineWidth(0.5);
            doc.line(20, y, 190, y);
        };

        // Header del documento
        doc.setFillColor(102, 126, 234);
        doc.rect(0, 0, 210, 30, 'F');

        doc.setTextColor(255, 255, 255);
        addText('INFORME DE RENTABILIDAD', 20, 20, 18, 'bold');
        addText(`Fecha: ${this.formatDate(selectedDate)}`, 140, 20, 12);

        doc.setTextColor(0, 0, 0);
        yPosition = 50;

        addText('RESUMEN EJECUTIVO', 20, yPosition, 16, 'bold');
        yPosition += 15;
        addLine(yPosition);
        yPosition += 10;

        const statsData = [
            { title: 'RENTABILIDAD DIARIA', stats: dailyStats, color: [250, 112, 154] },
            { title: 'RENTABILIDAD SEMANAL', stats: weeklyStats, color: [168, 237, 234] },
            { title: 'RENTABILIDAD MENSUAL', stats: monthlyStats, color: [210, 153, 194] }
        ];

        statsData.forEach((statGroup, index) => {
            const xPos = 20 + (index * 60);

            doc.setFillColor(statGroup.color[0], statGroup.color[1], statGroup.color[2]);
            doc.rect(xPos, yPosition, 55, 40, 'F');

            doc.setTextColor(255, 255, 255);
            addText(statGroup.title, xPos + 2, yPosition + 8, 8, 'bold');
            addText(`S/ ${statGroup.stats.totalProfit.toFixed(2)}`, xPos + 2, yPosition + 16, 12, 'bold');
            addText(`Margen: ${statGroup.stats.profitMargin.toFixed(1)}%`, xPos + 2, yPosition + 24, 8);
            addText(`Tickets: ${statGroup.stats.ticketCount}`, xPos + 2, yPosition + 32, 8);
        });

        doc.setTextColor(0, 0, 0);
        yPosition += 60;

        addText('DETALLE DE MÉTRICAS', 20, yPosition, 14, 'bold');
        yPosition += 10;
        addLine(yPosition);
        yPosition += 15;

        const metricsHeaders = ['Período', 'Ingresos', 'Costos', 'Ganancia', 'Margen %', 'Tickets'];
        const metricsData = [
            ['Diario', dailyStats.totalRevenue, dailyStats.totalCost, dailyStats.totalProfit, dailyStats.profitMargin, dailyStats.ticketCount],
            ['Semanal', weeklyStats.totalRevenue, weeklyStats.totalCost, weeklyStats.totalProfit, weeklyStats.profitMargin, weeklyStats.ticketCount],
            ['Mensual', monthlyStats.totalRevenue, monthlyStats.totalCost, monthlyStats.totalProfit, monthlyStats.profitMargin, monthlyStats.ticketCount]
        ];

        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPosition, 170, 8, 'F');

        let xPos = 25;
        metricsHeaders.forEach(header => {
            addText(header, xPos, yPosition + 5, 9, 'bold');
            xPos += 28;
        });
        yPosition += 12;

        metricsData.forEach((row, index) => {
            if (index % 2 === 0) {
                doc.setFillColor(248, 249, 250);
                doc.rect(20, yPosition, 170, 8, 'F');
            }

            xPos = 25;
            row.forEach((cell, cellIndex) => {
                let cellText = '';
                if (cellIndex === 0) {
                    cellText = cell.toString();
                } else if (cellIndex >= 1 && cellIndex <= 3) {
                    cellText = `S/ ${(cell as number).toFixed(2)}`;
                } else if (cellIndex === 4) {
                    cellText = `${(cell as number).toFixed(1)}%`;
                } else {
                    cellText = cell.toString();
                }
                addText(cellText, xPos, yPosition + 5, 8);
                xPos += 28;
            });
            yPosition += 10;
        });

        yPosition += 20;

        if (tickets.length > 0) {
            addText('DETALLE DE TICKETS', 20, yPosition, 14, 'bold');
            yPosition += 10;
            addLine(yPosition);
            yPosition += 15;

            tickets.forEach((ticket) => {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 30;
                }

                doc.setFillColor(102, 126, 234);
                doc.rect(20, yPosition - 5, 170, 12, 'F');

                doc.setTextColor(255, 255, 255);
                addText(`Ticket #${ticket.nro_ticket}`, 25, yPosition + 2, 10, 'bold');
                addText(`DNI: ${ticket.dni}`, 80, yPosition + 2, 9);
                addText(`Total: S/ ${ticket.calculatedTotal?.toFixed(2)}`, 120, yPosition + 2, 9);
                addText(`Ganancia: S/ ${ticket.profitability?.toFixed(2)}`, 150, yPosition + 2, 9, 'bold');

                doc.setTextColor(0, 0, 0);
                yPosition += 20;

                ticket.detail.forEach(product => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 30;
                    }

                    addText(`• ${product.type} - ${product.codToday}`, 30, yPosition, 8);
                    addText(`Talla: ${product.size}`, 30, yPosition + 6, 7);
                    addText(`Cant: ${product.amount}`, 70, yPosition + 6, 7);
                    addText(`Precio: S/ ${product.price.toFixed(2)}`, 100, yPosition + 6, 7);
                    addText(`Costo: S/ ${product.precioFabrica.toFixed(2)}`, 140, yPosition + 6, 7);
                    addText(`Ganancia: S/ ${(product.price - product.precioFabrica).toFixed(2)}`, 170, yPosition + 6, 7, 'bold');

                    yPosition += 15;
                });

                yPosition += 5;
            });
        }

        const pageCount = doc.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            doc.setDrawColor(200, 200, 200);
            doc.line(20, 280, 190, 280);

            addText(`Página ${i} de ${pageCount}`, 20, 290, 8);
            addText(`Generado el ${new Date().toLocaleDateString('es-PE')} a las ${new Date().toLocaleTimeString('es-PE')}`, 100, 290, 8);
        }

        const pdfOutput = doc.output('datauristring');
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(`
                <html>
                    <head>
                        <title>Informe de Rentabilidad - ${this.formatDate(selectedDate)}</title>
                    </head>
                    <body style="margin: 0; padding: 0;">
                        <embed width="100%" height="100%" src="${pdfOutput}" type="application/pdf">
                    </body>
                </html>
            `);
        }
    }

    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}