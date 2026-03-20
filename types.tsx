export interface Role {
    id?: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Product {
    id?: number;
    name: string;
    description: string;
    basePrice: number;
    salePrice: number;
    totalSold: number;
    category: { id: number; name?: string } | null;
    brand: { id: number; name?: string } | null;
    images: string[]; // URL từ BE trả về
    imageFiles?: File[]; // Dùng để upload
    slug: string;
    active: boolean;
    gender: Gender;
    material: string;
    soleType: string;
    origin: string;
    variants: ProductVariant[];
}




export enum Gender {
    MEN = 'MEN',
    WOMEN = 'WOMEN',
    UNISEX = 'UNISEX'
}

export interface ProductVariant {
    id?: number;
    size: number;
    color: string;
    stock: number;
    price: number;
}

export interface CartItem {
    id: number;          // DB id
    product: Product;
    variant: ProductVariant;
    quantity: number;
    price: number;       // ✅
}

export interface User {
    id: number;
    email: string;
    fullName: string;
    roles: string[];
}
