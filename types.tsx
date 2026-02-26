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
    id: number;
    name: string;
    description: string;
    basePrice: number;
    salePrice?: number;
    totalSold: number;
    category: Category;
    images: string[];
    slug: string;
    active: boolean;
    gender: string;
    material?: string;
    soleType?: string;
    origin?: string;
}

export interface ProductVariant {
    id: number;
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
    roles: Role[];
}
