import { Component, OnInit, } from '@angular/core';
import { BotonSesionTiempoComponent } from "../../../../../shared/components/button/boton-sesion-tiempo/boton-sesion-tiempo.component";
import { GananciaAnual } from '../../../../../shared/models/gananciasAnuales';
import { SaleDataService } from '../../../../service/sale-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { Resumenes } from '../../../../../shared/models/resumenes';
import { SlipperService } from '../../../../service/slipper.service';
import { ToastrService } from 'ngx-toastr';
import { DominioService } from '../../../../service/dominio.service';
import { TicketConfigService } from '../../../../service/ticket-config.service';
import { SalesService } from '../../../../service/sales.service';
import { blob } from 'stream/consumers';
import { error } from 'console';

@Component({
  selector: 'app-payment-dashboard',
  imports: [BotonSesionTiempoComponent, CommonModule, FormsModule, PayTypeTranslatePipe],
  standalone: true,
  templateUrl: './payment-dashboard.component.html',
  styleUrl: './payment-dashboard.component.css'
})
export class PaymentDashboardComponent implements OnInit {
  gananciaAnual: GananciaAnual = {
    meses: [],
    totalAnual: 0
  };

  anio: number = new Date().getFullYear();
  yearsList: number[] = [];
  yAxisTicks: number[] = [];

  // Colores para cada mes
  private monthColors: string[] = [
    '#e74c3c', '#e67e22', '#f39c12', '#f1c40f', '#2ecc71', '#1abc9c',
    '#3498db', '#9b59b6', '#e91e63', '#ff5722', '#795548', '#607d8b'
  ];

  constructor(private gananciasService: SaleDataService,
    private dominioService: DominioService,
    private saleService: SalesService,
    private configService: TicketConfigService,
    private toastr: ToastrService,
    private resumenService: SlipperService) {
    const today = new Date();
    this.fecha = this.getFechaLocal();
  }

  ngOnInit(): void {
    this.cargarDominio();
    this.cargarDatos();
    this.generarListaDeAnios();
    this.loadData();
    this.getResumen();
  }

  generarListaDeAnios() {
    const currentYear = new Date().getFullYear();
    this.yearsList = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  cargarDatos(): void {
    this.gananciasService.getGananciasAnuales(this.anio).subscribe({
      next: (data) => {
        this.gananciaAnual = data;
        this.generateYAxisTicks();
      },
      error: (err) => {
        console.error('Error al cargar las ganancias:', err);
      }
    });
  }

  // Método corregido para generar los ticks del eje Y
  generateYAxisTicks(): void {
    const maxValue = Math.max(...this.gananciaAnual.meses.map(m => m.totalMes));

    // Si no hay datos, usar un valor mínimo
    if (maxValue === 0) {
      this.yAxisTicks = [5000, 0];
      return;
    }
    const escalado = 5000;
    const finalMax = Math.ceil(maxValue / escalado) * escalado;


    // Generar los ticks de mayor a menor
    this.yAxisTicks = [];
    for (let i = finalMax; i >= 0; i -= 5000) {
      this.yAxisTicks.push(i);
    }
  }

  // Método corregido para calcular la altura de las barras
  getBarHeight(value: number): string {
    if (this.yAxisTicks.length === 0 || !value) return '0%';

    // Usar el valor máximo de los ticks (que es el primero en el array)
    const maxValue = this.yAxisTicks[0];

    // Calcular el porcentaje basado en el valor máximo
    const heightPercent = (value / maxValue) * 100;

    return `${heightPercent}%`;
  }




  getBarColor(index: number): string {
    return this.monthColors[index % this.monthColors.length];
  }

  getMonthAbbr(mes: string): string {
    const abbreviations: { [key: string]: string } = {
      'enero': 'Ene',
      'febrero': 'Feb',
      'marzo': 'Mar',
      'abril': 'Abr',
      'mayo': 'May',
      'junio': 'Jun',
      'julio': 'Jul',
      'agosto': 'Ago',
      'setiembre': 'Sep',
      'octubre': 'Oct',
      'noviembre': 'Nov',
      'diciembre': 'Dic'
    };
    return abbreviations[mes] || mes.substring(0, 3);
  }

  //Desarrolo de estadisticas de fecha de pagos
  data: any;
  fecha: string = this.getFechaLocal();
  getFechaLocal(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const day = hoy.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  loadData(): void {
    this.gananciasService.getData(this.fecha).subscribe(response => {
      this.data = response;
    });
  }


  onDateChange(event: any): void {
    this.fecha = event.target.value;
    this.loadData();
  }

  tiposDePago(obj: any): string[] {
    if (obj && typeof obj === 'object') {
      return Object.keys(obj);
    }
    return [];
  }

  getColorByIndex(index: number): string {
    const colors = [
      '#e74c3c', // rojo
      '#2ecc71', // verde
      '#3498db', // azul
      '#9b59b6', // morado
      '#f39c12', // naranja
      '#1abc9c', // celeste
      '#e91e63', // rosa
      '#34495e', // gris oscuro
      '#ff5722', // naranja fuerte
    ];
    return colors[index % colors.length];
  }
  // Resumen de Productos

  resumen: Resumenes | null = null;

  getResumen(): void {
    this.resumenService.getResumen().subscribe({
      next: (data) => this.resumen = data,
      error: (err) => console.error('Error al obtener resumen', err)
    });
  }

  //Update Dominio

  mostrarModal = false;
  dominioActual = '';
  nuevoDominio = '';
  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoDominio = '';
  }

  actualizar() {
    if (!this.nuevoDominio.trim()) {
      this.toastr.warning('Debe ingresar un dominio válido');
      return;
    }

    this.dominioService.actualizarDominio(this.nuevoDominio).subscribe({
      next: (msg) => {
        this.toastr.success('Dominio actualizado correctamente');
        this.cerrarModal();
      },
      error: () => this.toastr.error('Error al actualizar dominio'),
    });
  }

  cargarDominio(): void {
    this.dominioService.getDominio().subscribe({
      next: (url) => this.dominioActual = url,
      error: () => this.toastr.error('No se pudo cargar el dominio')
    });
  }

  copiarDominio(): void {
    navigator.clipboard.writeText(this.dominioActual)
      .then(() => this.toastr.success('URL copiada al portapapeles'))
      .catch(() => this.toastr.error('Error al copiar'));
  }
  //para actualizar ticketConfig
  modalVisible = false;
  valorTicket: number | null = null;
  feedbackMsg = '';

  mostrarModal2() {
    this.valorTicket = null;
    this.feedbackMsg = '';
    this.modalVisible = true;
  }

  ocultarModal() {
    this.modalVisible = false;
    this.feedbackMsg = '';
  }

  enviarActualizacion() {
    if (this.valorTicket === null || isNaN(this.valorTicket)) {
      this.feedbackMsg = 'Introduce un valor numérico válido.';
      return;
    }

    this.configService.updateTicketConfig(this.valorTicket).subscribe({
      next: response => {
        this.feedbackMsg = response;
        setTimeout(() => this.ocultarModal(), 1500);
      },
      error: err => {
        this.feedbackMsg = 'Error actualizando la configuración.';
        console.error(err);
      }
    });
  }

  // copy puerto
  copiarPuerto80() {
    const urlPuerto80 = 'http://localhost:80';
    navigator.clipboard.writeText(urlPuerto80)
      .then(() => this.toastr.success('Dominio → Puerto 80 copiado', '¡Listo!'))
      .catch(err => {
        this.toastr.error('No se pudo copiar la URL', 'Error');
      });
  }


  // pdf reporte al contador

  generarReportePDF(): void {
    const [year, month] = this.fecha.split('-').map(Number);

    this.saleService.downloadSalesReport(month, year).subscribe(blob => {
      const fileName = `venta_${month}_${year}.pdf`;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    }, error => {
      alert('Error al generar el reporte PDF.');
    });
  }
}
