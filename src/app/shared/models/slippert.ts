export interface Slipper {
    id:       number;
    brand:    string;
    codToday: string;
    amount:   number;
    image:    string;
    company:  string;
    type: string;
    registrationDate: string;
    urlImg:   string;
    sizes:    { [key: string]: number };
    genero: string;
    price: string;
    producto: string;

    nuevaCantidad?: number;
    editandoCantidad?: boolean;
}
