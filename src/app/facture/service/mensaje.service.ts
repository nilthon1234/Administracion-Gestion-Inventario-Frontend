import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatSizes } from '../../shared/utils/size-format.util';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private snackBar: MatSnackBar) {}

  private processMessage(message: string): string {
    // Aquí puedes agregar lógica para detectar y procesar tallas en el mensaje
    // Por ejemplo, buscar patrones de tallas y aplicar formatSizes
    // Esto es solo un ejemplo básico y necesitarás ajustarlo según tus necesidades
    const sizePattern = /(tallas|talla):?\s*([^\s,]+(?:,\s*[^\s,]+)*)/i;
    return message.replace(sizePattern, (match, p1, p2) => {
      const sizes = formatSizes(p2);
      return `${p1}: ${sizes.join(', ')}`;
    });
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000, // 5 segundos
    });
  }

  showError(message: string) {
    const processedMessage = this.processMessage(message);
    this.snackBar.open(processedMessage, 'OK', {
      duration: 5000,
    });
  }
}
