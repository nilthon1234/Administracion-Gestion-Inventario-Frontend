
export interface InfoSale {
    id?:              number;
    discount?:        number;
    increase?:        number;
    codToday:        string;
    nroTicket:       number;
    soldDate?:        Date;
    idDetails?:       number;
    payType:         string;
    ticketType?:      string;
    antiguoCodToday?: string;
    especificacion?:  string;
    priceAntiguo?:    number;
    state?:           string;
    dateUpdate?:      string;
}
