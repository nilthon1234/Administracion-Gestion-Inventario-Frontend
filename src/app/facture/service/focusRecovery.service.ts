import { HostListener, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FocusRecoveryService {
  private lastInput: HTMLInputElement | null = null;

  constructor() {
    document.addEventListener('focusin', (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement) {
        this.lastInput = e.target;
      }
    });
  }

  // Llamar cada vez que se detecta que el teclado está "muerto"
  forceFocus() {
    this.lastInput?.focus();
  }
}