// Respuesta exitosa
export  interface SuccessResponse {
  "Saldo Ganancia Por descarte": number;
  reaccion: string;
  suma_amortizaciones: number;
  total_antes: number;
}

// Respuesta de error (403 o 400)
export  interface ErrorResponse {
  mensaje_adicional: string;
  reaccion: string;
  mensaje_regla_negocio: string;
  falta_para_eliminar_separacion: number;
  suma_amortizaciones: number;
  total_antes: number;
}
