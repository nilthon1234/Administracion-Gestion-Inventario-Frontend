export interface VentasPagos {
    id:                     number;
    ticket:                 number;
    payType:                string;
    monto:                  number;
    total:                  number;
    ticketType:             string;
    state:                  string;
    registrationMetodoPago: Date;
}
