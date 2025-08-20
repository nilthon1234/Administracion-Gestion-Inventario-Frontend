import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { LicenciaService } from '../../service/licencia.service';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStoraService } from '../../service/local-stora.service';

@Component({
  selector: 'app-validacion-licencia',
  imports: [CommonModule, FormsModule],
  templateUrl: './validacion-licencia.component.html',
  styleUrl: './validacion-licencia.component.css'
})
export class ValidacionLicenciaComponent implements OnInit {

  licencia = '';
  mensaje = '';
  isLoading = false;

  constructor(
    private licenciaService: LicenciaService,
    private router: Router,
    private localStoraService: LocalStoraService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.localStoraService.getToken();

      if (token && !this.isTokenExpired(token)) {
        this.verificarTokenExistente(token);
      }
    }
  }

  private verificarTokenExistente(token: string) {
    this.isLoading = true;
    this.licenciaService.getFingerprint().then(fp => {
      this.licenciaService.verificarToken(token, fp).subscribe({
        next: () => {
          this.router.navigate(['/filter-slipper']);
        },
        error: () => {
          this.localStoraService.removeToken();
          this.isLoading = false;
        }
      });
    });
  }

  validar() {
    this.isLoading = true;
    this.licenciaService.getFingerprint().then(fp => {
      this.licenciaService.validarLicencia(this.licencia, fp).subscribe({
        next: (data) => {
          if (data?.token) {
            this.localStoraService.setToken(data.token);
            this.router.navigate(['/filter-slipper']);
          } else {
            this.mensaje = 'Licencia inválida';
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.mensaje = err.error?.message || 'Error al validar la licencia';
          this.isLoading = false;
        }
      });
    }).catch(err => {
      this.mensaje = 'Error al identificar el dispositivo';
      this.isLoading = false;
    });
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  }
}
