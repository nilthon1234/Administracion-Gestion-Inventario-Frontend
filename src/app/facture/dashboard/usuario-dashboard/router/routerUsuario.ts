import {  Routes } from "@angular/router";
import { UsuarioConfigAppsComponent } from "../components/usuario-config-apps/usuario-config-apps.component";
import { FilterSlipperComponent } from "../components/filter-slipper/filter-slipper.component";
import { FilterSandalComponent } from "../components/filter-sandal/filter-sandal.component";
import { MainVentaComponent } from "../components/main-venta/main-venta.component";
import { UpdateVentaComponent } from "../components/update-venta/update-venta.component";
import { RegisterVentaSeparadaComponent } from "../components/register-venta-separada/register-venta-separada.component";
import { MainClientSeparationAmortizationComponent } from "../components/main-client-separation-amortization/main-client-separation-amortization.component";
import { RegisterSeparationComponent } from "../components/register-separation/register-separation.component";
import { RegisterAmortizationComponent } from "../components/register-amortization/register-amortization.component";
import { FilterVitrinaSlipperComponent } from "../components/filter-vitrina-slipper/filter-vitrina-slipper.component";
import { FilterVitrinaBComponent } from "../components/filter-vitrina-b/filter-vitrina-b.component";
import { ValidacionLicenciaComponent } from "../../../../auth/component/validacion-licencia/validacion-licencia.component";
import { FilterGorraCanguroMediasComponent } from "../components/filter-gorra-canguro-medias/filter-gorra-canguro-medias.component";
import { PersonalizacionQrComponent } from "../components/personalizacion-qr/personalizacion-qr.component";
import { MainInfoSalesComponent } from "../components/main-info-sales/main-info-sales.component";
import { InformePagosActualizadosComponent } from "../components/informe-pagos-actualizados/informe-pagos-actualizados.component";
import { InformeVentasPagosComponent } from "../components/informe-ventas-pagos/informe-ventas-pagos.component";
import { DevolucionesComponent } from "../components/devoluciones/devoluciones.component";
import { MainStockComponent } from "../components/main-stock/main-stock.component";
import { StockVitrinaComponent } from "../components/stock-vitrina/stock-vitrina.component";
import { StockVitrinaBComponent } from "../components/stock-vitrina-b/stock-vitrina-b.component";
import { ObservacionesVitrinaComponent } from "../components/observaciones-vitrina/observaciones-vitrina.component";
import { ObservacionesVitrinaBComponent } from "../components/observaciones-vitrina-b/observaciones-vitrina-b.component";
import { MantenimientoVitrinasComponent } from "../components/mantenimiento-vitrinas/mantenimiento-vitrinas.component";
import { MantenimientoMarcasComponent } from "../components/mantenimiento-marcas/mantenimiento-marcas.component";
import { MainVentaScannerComponent } from "../components/main-venta-scanner/main-venta-scanner.component";
import { FilterVentasComponent } from "../components/filter-ventas/filter-ventas.component";
import { ProductosVendidosComponent } from "../components/productos-vendidos/productos-vendidos.component";
import { Mantenimiento2MainComponent } from "../components/mantenimiento2-main/mantenimiento2-main.component";
import { FilterRopasComponent } from "../components/filter-ropas/filter-ropas.component";
import { RegisterVenta2Component } from "../components/register-venta2/register-venta2.component";
import { MantenimientoProductoComponent } from "../components/mantenimiento-producto/mantenimiento-producto.component";
import { MainGastosComponent } from "../components/main-gastos/main-gastos.component";

export const routerUsuario : Routes = [
    {
        path: '',
        component: UsuarioConfigAppsComponent,
        children: [
            {path: '', redirectTo: 'filter-slipper', pathMatch: 'full'},
            {path: 'filter-slipper',title:'Almacen', component: FilterSlipperComponent, },
            {path: 'filter-sandal', title:'Almacen Sandalia', component: FilterSandalComponent, },
            {path: 'filter-ropas', title:'Almacen ropas', component: FilterRopasComponent, },

            

            {path: 'main-venta',title:'Ventas', component: MainVentaComponent, },
            {path: 'filter-venta',title:'Ventas', component: FilterVentasComponent, },
            {path: 'productos-ventas',title:'Productos mas vendidos', component: ProductosVendidosComponent, },
            {path: 'main-scanner',title:'Ventas Por Scanner', component: MainVentaScannerComponent, },
            {path: 'update-venta',title:'Actualizar Venta', component: UpdateVentaComponent,},
            {path: 'register-venta',title:'Venta Manual', component: RegisterVenta2Component, },
            { path: 'register-venta-separada',title:'Registro Venta Por Separacion', component: RegisterVentaSeparadaComponent },
            
            {path: 'main-client-separation-amortization',title:'Inicio Separacion', component: MainClientSeparationAmortizationComponent},
            {path: 'register-separation',title:'Registro Separacion', component: RegisterSeparationComponent},
            {path: 'register-amortization',title:'Registro Amortizacion', component: RegisterAmortizationComponent},
            
            {path: 'filter-vitrina',title:'Mi Vitrina', component: FilterVitrinaSlipperComponent },
            {path: 'filter-vitrina-b',title:' Vitrina 2', component: FilterVitrinaBComponent },
            {path: 'validacion-licencia', component: ValidacionLicenciaComponent},
            {path: 'filter-go-ca-me',title:'Almacen Gorra Canguro Medias', component: FilterGorraCanguroMediasComponent},
            
            {path: 'personalizar-qr', component: PersonalizacionQrComponent},

                //Pagos
            {path: 'main-pagos', component: MainInfoSalesComponent},
            {path: 'informe-pagos-actualizados', component: InformePagosActualizadosComponent},
            {path: 'main-informe-ventas-pagos', component: InformeVentasPagosComponent},
            {path: 'devoluciones', component: DevolucionesComponent},

            //Stock
            {path: 'main-stock',title:'Stock Vacion Almacen', component: MainStockComponent},
            {path: 'stock-vitrina',title:'Stock Vacios Mi Vitrina', component: StockVitrinaComponent},
            {path: 'stock-vitrina-b',title:'Stock Vacios Vitrina 2', component: StockVitrinaBComponent},
            
            //Observaciones

            {path: 'list-vitrina-visual',title:'Por Mostrador Mi Vitrina', component: ObservacionesVitrinaComponent},
            {path: 'list-vitrinaB-visual',title:'Por Mostrador Vitrina 2', component: ObservacionesVitrinaBComponent},
            {path: 'main-mantenimiento',title:'Generador Codigos', component: Mantenimiento2MainComponent },
            {path: 'main-vitrinas',title:'Productos a Eliminar Vitrinas',component:MantenimientoVitrinasComponent},
            {path: 'main-marcas',title:'Marcas',component:MantenimientoMarcasComponent},
            {path: 'main-pro-gen',title:'Productos-genero',component:MantenimientoProductoComponent},
            
            {path: 'main-gastos', title:'Gastos', component:MainGastosComponent}

        ]
    }

]