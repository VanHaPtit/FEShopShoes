
export enum Gender {
    MEN = 'MEN',
    WOMEN = 'WOMEN',
    UNISEX = 'UNISEX'
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPING = 'SHIPPING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    REFUNDED = 'REFUNDED'
}

export interface Brand {
    id?: number;
    name: string;
}

export interface Category {
    id?: number;
    name: string;
    image: string;
}

export interface Role {
    id?: number;
    name: string;
}

export interface User {
    id?: number;
    email: string;
    username: string;
    fullName: string;
    phone: string;
    imageAvt?: string;
    enabled: boolean;
    roles: Role[];
    createdAt: string;
}

export interface ProductVariant {
    id?: number;
    size: number;
    color: string;
    stock: number;
    price: number;
    product?: Product;
}

export interface Product {
    id?: number;
    name: string;
    description: string;
    basePrice: number;
    salePrice?: number;
    totalSold: number;
    category: Category | null;
    brand: Brand | null;
    images: string[];
    slug: string;
    active: boolean;
    gender: string;
    material: string;
    soleType: string;
    origin: string;
    variants: ProductVariant[];
}

export interface OrderItem {
    id?: number;
    variant: ProductVariant;
    quantity: number;
    priceAtPurchase: number;
}

export interface Order {
    id?: number;
    orderNumber: string;
    user: User;
    items: OrderItem[];
    totalPrice: number;
    status: OrderStatus;
    receiverName: string;
    receiverPhone: string;
    shippingAddress: string;
}

export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    lowStockItems: number;
}
