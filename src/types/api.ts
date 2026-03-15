export interface User {
    id: number;
    user_id: string;
    phone_number: string;
    active: boolean;
    confirmed: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// اضافه شدن فیلدهای image_url و is_active
export interface Category {
    id: number;
    name: string;
    slug: string;
    level: number;
    full_path: string;
    product_count: number;
    image_url: string | null; 
    is_active: boolean;
    children?: Category[];
}

export interface CategoriesResponse {
    categories: Category[];
    total_categories: number;
    message?: string;
}

// اضافه شدن فیلدهای attributes, specifications و rating_percentage
export interface Product {
    id: number;
    name: string;
    sku: string;
    description: string;
    final_price: number;
    stock: number;
    is_low_stock: boolean;
    images: string[];
    category: any;
    average_rating: number;
    total_ratings: number;
    rating_percentage?: number;
    attributes?: Record<string, string>;
    specifications?: Record<string, string>;
}

export interface PaginationMeta {
    page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
}

// ایجاد اینترفیس اختصاصی برای ریسپانس لیست محصولات
export interface ProductsResponse {
    products: Product[];
    pagination: PaginationMeta;
}

// سایر تایپ‌های شما ...
export interface Address {
    id: number;
    address: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    is_default: boolean;
}

export interface Favorite {
    id: number;
    product_id: number;
    created_at: string;
}

export interface Ticket {
    id: number;
    subject: string;
    content: string;
    status?: string;
    created_at?: string;
}

export interface ReplyTicketPayload {
    ticket_id: number;
    content: string;
}
