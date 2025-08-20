import { Component, OnInit } from '@angular/core';
import { NavBarsVentasComponent } from "../../../../../shared/components/navbars/nav-bars-ventas/nav-bars-ventas.component";
import { ProductSalesByType } from '../../../../../shared/models/productosSalesByType';
import { SaleDataService } from '../../../../service/sale-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos-vendidos',
  imports: [NavBarsVentasComponent,CommonModule,FormsModule],
  templateUrl: './productos-vendidos.component.html',
  styleUrl: './productos-vendidos.component.css'
})
export class ProductosVendidosComponent implements OnInit {

  topSellingProducts: { [key: string]: any } = {};
  selectedLimit: number = 10; // valor inicial

  constructor(private detailTicketService: SaleDataService) {}

  ngOnInit(): void {
    this.loadTopSellingProducts();
  }

  loadTopSellingProducts(): void {
    this.detailTicketService.getTopSellingProductsByType(this.selectedLimit).subscribe(data => {
      this.topSellingProducts = data;
    });
  }

  onLimitChange(): void {
    this.loadTopSellingProducts();
  }

  toggleZoom(product: any): void {
    product.zoomed = !product.zoomed;
  }
}


