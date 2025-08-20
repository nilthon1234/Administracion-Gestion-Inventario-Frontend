import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCopiarTexto]',
  standalone: true
})
export class CopiarTextoDirective {

  @Input('appCopiarTexto') texto: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click')
  onClick(): void {
    const textoSinEspacios = this.texto.replace(/\s+/g, '');
    navigator.clipboard.writeText(textoSinEspacios).then(() => {
      this.mostrarMensajeCopiado();
    });
  }

  private mostrarMensajeCopiado() {
    const mensaje = this.renderer.createElement('div');
    this.renderer.setStyle(mensaje, 'position', 'absolute');
    this.renderer.setStyle(mensaje, 'backgroundColor', '#e0ffe0');
    this.renderer.setStyle(mensaje, 'color', '#28a745');
    this.renderer.setStyle(mensaje, 'padding', '2px 6px');
    this.renderer.setStyle(mensaje, 'fontSize', '11px');
    this.renderer.setStyle(mensaje, 'borderRadius', '4px');
    this.renderer.setStyle(mensaje, 'top', '-18px');
    this.renderer.setStyle(mensaje, 'left', '50%');
    this.renderer.setStyle(mensaje, 'transform', 'translateX(-50%)');
    this.renderer.setStyle(mensaje, 'zIndex', '10');
    this.renderer.setProperty(mensaje, 'innerText', 'Copiado');

    const contenedor = this.el.nativeElement;
    this.renderer.setStyle(contenedor, 'position', 'relative');
    this.renderer.appendChild(contenedor, mensaje);

    setTimeout(() => {
      this.renderer.removeChild(contenedor, mensaje);
    }, 2000);
  }

}
