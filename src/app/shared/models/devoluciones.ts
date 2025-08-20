export interface Devoluciones {
    id:                    number;
    ticketType:            string;
    codToday:              string;
    monto:                 number;
    idProducto:            number;
    idTicket:              number;
    payType:               string;
    soldDate:              Date;
    idClient?:               string;
    idSeparacion?:          number;
    registrationDevolucio: Date;
}
