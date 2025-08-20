import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../auth/service/auth.service';
import { BotonAtrasComponent } from "../../../../../shared/components/button/boton-atras/boton-atras.component";

@Component({
  selector: 'app-login-admin',
  imports: [FormsModule, CommonModule, BotonAtrasComponent],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {
  
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Simular delay de autenticación
    setTimeout(() => {
      if (this.authService.login(this.username, this.password)) {
        this.router.navigate(['/diagrama']);
      } else {
        this.errorMessage = 'Credenciales incorrectas';
      }
      this.isLoading = false;
      // Limpiar campos por seguridad
      this.username = '';
      this.password = '';
    }, 500);
  }

}
