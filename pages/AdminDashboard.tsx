import React, { useState, useEffect } from 'react';
import Sidebar from '../Admin/components/Sidebar'; //
import ProductList from '../Admin/components/ProductList'; //
import CategoryManager from '../Admin/components/CategoryManager'; //
import BrandManager from '../Admin/components/BrandManager'; //
import OrderManager from '../Admin/components/OrderManager'; //
import UserManager from '../Admin/components/UserManager'; //
import { ProductService } from '../services/ProductService';
import { Product } from '../Admin/typesAdmin';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (activeTab === 'products') {
            ProductService.getAll().then(data => setProducts(data));
        }
    }, [activeTab]);
    // Hàm render nội dung dựa trên tab đang chọn
    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductList products={[]} onEdit={() => { }} onDelete={() => { }} onAdd={() => { }} />;
            case 'categories':
                return <CategoryManager categories={[]} onSave={() => { }} onDelete={() => { }} />;
            case 'brands':
                return <BrandManager brands={[]} onSave={() => { }} onDelete={() => { }} />;
            case 'orders':
                return <OrderManager orders={[]} onStatusChange={() => { }} />;
            case 'users':
                return <UserManager users={[]} onToggleStatus={() => { }} />;
            default:
                return <div className="p-10 font-bold italic">CHÀO MỪNG QUAY LẠI, ADMIN!</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar cố định bên trái */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Nội dung quản trị bên phải */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-[1200px] mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;