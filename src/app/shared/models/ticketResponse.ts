export interface TicketResponse {
    ticket: Ticket[];
}
export interface Ticket {
    nro_ticket: number;
    sellerName: string;
    clientName: string;
    client_last_name: string;
    registrationTicket: string | null;
    dni: number;
    contador?: string;
    detail: TicketDetail[];
    showDetails?: boolean;
}
export interface TicketDetail {
    id: number;
    amount: number;
    codToday: string;
    company: string;
    type: string;
    size: string;
    price: number;
    sub_total: number;
    payType: string;
    totalPagar: number;
    genero?: string;
    producto: string;

    discount: string;
    increase: string;
    especificacion: string;
}