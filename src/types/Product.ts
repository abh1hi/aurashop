export interface ProductOption {
    name: string; // e.g., "Size", "Color"
    values: string[]; // e.g., ["S", "M", "L"], ["Red", "Blue"]
}

export interface ProductVariant {
    id: string;
    name: string; // e.g., "Size: S / Color: Red"
    options: { [key: string]: string }; // { "Size": "S", "Color": "Red" }
    price: number;
    stock: number;
    sku: string;
}
