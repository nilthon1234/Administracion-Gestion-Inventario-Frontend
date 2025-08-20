import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductoService } from './producto.service';

@Injectable({ providedIn: 'root' })
export class InitService {
  constructor(private productoService: ProductoService) {}

  // 🚀 Este método se usará en main.ts
  loadInitialData(): Promise<any> {
    return firstValueFrom(this.productoService.listarGeneros());
  }
}
