export interface InformePagos {
    id:                     number;
    idInfoSale:             number;
    ticket:                 number;
    idDetails:              number;
    payType:                string;
    monto:                  number;
    total:                  number;
    ticketType:             string;
    accion:             string;
    state:                  string;
    registrationMetodoPago: Date;
}
