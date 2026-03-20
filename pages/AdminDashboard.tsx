// import React, { useState, useEffect } from 'react';
// import Sidebar from '../Admin/components/Sidebar'; //
// import ProductList from '../Admin/components/ProductList'; //
// import CategoryManager from '../Admin/components/CategoryManager'; //
// import BrandManager from '../Admin/components/BrandManager'; //
// import OrderManager from '../Admin/components/OrderManager'; //
// import UserManager from '../Admin/components/UserManager'; //
// import { ProductService } from '../services/ProductService';
// import { Product } from '../Admin/typesAdmin';

// const AdminDashboard: React.FC = () => {
//     const [activeTab, setActiveTab] = useState('products');
//     const [products, setProducts] = useState<Product[]>([]);

//     useEffect(() => {
//         if (activeTab === 'products') {
//             ProductService.getAll().then(data => setProducts(data));
//         }
//     }, [activeTab]);
//     // Hàm render nội dung dựa trên tab đang chọn
//     const renderContent = () => {
//         switch (activeTab) {
//             case 'products':
//                 return <ProductList products={[]} onEdit={() => { }} onDelete={() => { }} onAdd={() => { }} />;
//             case 'categories':
//                 return <CategoryManager categories={[]} onSave={() => { }} onDelete={() => { }} />;
//             case 'brands':
//                 return <BrandManager brands={[]} onSave={() => { }} onDelete={() => { }} />;
//             case 'orders':
//                 return <OrderManager orders={[]} onStatusChange={() => { }} />;
//             case 'users':
//                 return <UserManager users={[]} onToggleStatus={() => { }} />;
//             default:
//                 return <div className="p-10 font-bold italic">CHÀO MỪNG QUAY LẠI, ADMIN!</div>;
//         }
//     };

//     return (
//         <div className="min-h-screen bg-slate-50 flex">
//             {/* Sidebar cố định bên trái */}
//             <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//             {/* Nội dung quản trị bên phải */}
//             <main className="flex-1 ml-64 p-8">
//                 <div className="max-w-[1200px] mx-auto">
//                     {renderContent()}
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default AdminDashboard;








// import React, { useState, useEffect, useCallback } from 'react';
// import Sidebar from '../Admin/components/Sidebar';
// import ProductList from '../Admin/components/ProductList';
// import ProductForm from '../Admin/components/ProductForm';
// import CategoryManager from '../Admin/components/CategoryManager';
// import BrandManager from '../Admin/components/BrandManager';
// import OrderManager from '../Admin/components/OrderManager';
// import UserManager from '../Admin/components/UserManager';

// import { productApi, categoryApi, brandApi , orderApi } from '../api/adminApi';
// import axiosClient from '../api/axiosClient';
// import { Product, Category, Brand, Order, User } from '../Admin/typesAdmin';
// import { useToast } from '../context/ToastContext';

// const AdminDashboard: React.FC = () => {
//     const { showToast } = useToast();

//     const [activeTab, setActiveTab] = useState('products');
//     const [isLoading, setIsLoading] = useState(false);

//     // ==============================
//     // STATE DATA
//     // ==============================
//     const [products, setProducts] = useState<Product[]>([]);
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [brands, setBrands] = useState<Brand[]>([]);
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [users, setUsers] = useState<User[]>([]);

//     // ==============================
//     // MODAL PRODUCT
//     // ==============================
//     const [isProductFormOpen, setIsProductFormOpen] = useState(false);
//     const [editingProduct, setEditingProduct] = useState<Product | undefined>();

//     // ==============================
//     // LOAD CATEGORY + BRAND
//     // ==============================
//     const loadCommonData = useCallback(async () => {
//         try {
//             const [cData, bData] = await Promise.all([
//                 categoryApi.getAll(),
//                 brandApi.getAll()
//             ]);

//             setCategories(cData || []);
//             setBrands(bData || []);
//         } catch (error) {
//             console.error(error);
//             showToast("Lỗi tải danh mục / thương hiệu", "error");
//         }
//     }, [showToast]);

//     // ==============================
//     // LOAD DATA THEO TAB
//     // ==============================
//     const fetchDataByTab = useCallback(async () => {
//         setIsLoading(true);

//         try {
//             switch (activeTab) {
//                 case 'products': {
//                     const data = await productApi.getAll();

//                     // ✅ normalize đúng schema
//                     const safeData: Product[] = (data || []).map((p: Product) => ({
//                         ...p,
//                         basePrice: p.basePrice ?? 0,
//                         salePrice: p.salePrice ?? null,
//                         totalSold: p.totalSold ?? 0,
//                         images: p.images ?? [],
//                         active: p.active ?? true
//                     }));

//                     setProducts(safeData);
//                     break;
//                 }

//                 case 'orders': {
//                     const data = await axiosClient.get('/orders').then(r => r.data);
//                     setOrders(data || []);
//                     break;
//                 }

//                 case 'users': {
//                     const data = await axiosClient.get('/users').then(r => r.data);
//                     setUsers(data || []);
//                     break;
//                 }
//             }
//         } catch (error) {
//             console.error(error);
//             showToast("Lỗi tải dữ liệu", "error");
//         } finally {
//             setIsLoading(false);
//         }
//     }, [activeTab, showToast]);

//     // ==============================
//     // EFFECT
//     // ==============================
//     useEffect(() => {
//         loadCommonData();
//     }, [loadCommonData]);

//     useEffect(() => {
//         fetchDataByTab();
//     }, [fetchDataByTab]);

//     // ==============================
//     // PRODUCT ACTIONS
//     // ==============================
//     const handleAddProduct = () => {
//         setEditingProduct(undefined);
//         setIsProductFormOpen(true);
//     };

//     const handleEditProduct = (product: Product) => {
//         setEditingProduct(product);
//         setIsProductFormOpen(true);
//     };

//     const handleDeleteProductSuccess = (id: number) => {
//         setProducts(prev => prev.filter(p => p.id !== id));
//         showToast("Đã xóa sản phẩm", "info");
//     };

//     const handleSaveProductSuccess = () => {
//         setIsProductFormOpen(false);
//         fetchDataByTab();
//         showToast("Lưu sản phẩm thành công", "success");
//     };



//     // Thêm các hàm xử lý cho Category
//     const handleSaveCategory = async (formData: FormData) => {
//         setIsLoading(true);
//         try {
//             // Kiểm tra xem là update hay create dựa vào id trong FormData (nếu cần)
//             // Hoặc đơn giản hơn là xử lý trực tiếp qua axiosClient vì CategoryManager đã đóng gói FormData
//             const categoryId = JSON.parse((formData.get('category') as Blob).text ? await (formData.get('category') as Blob).text() : "{}").id;

//             if (categoryId) {
//                 await axiosClient.put(`/category/${categoryId}`, formData);
//                 showToast("Cập nhật danh mục thành công", "success");
//             } else {
//                 await axiosClient.post('/category', formData);
//                 showToast("Thêm danh mục thành công", "success");
//             }
//             loadCommonData(); // Tải lại danh sách sau khi lưu
//         } catch (error) {
//             showToast("Lỗi khi lưu danh mục", "error");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleDeleteCategory = async (id: number) => {
//         if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
//         setIsLoading(true);
//         try {
//             await categoryApi.delete(id);
//             showToast("Xóa danh mục thành công", "info");
//             loadCommonData();
//         } catch (error) {
//             showToast("Lỗi khi xóa danh mục", "error");
//         } finally {
//             setIsLoading(false);
//         }
//     };






//     // Thêm hàm xử lý thay đổi trạng thái đơn hàng
// const handleUpdateOrderStatus = async (id: number, status: OrderStatus) => {
//         setIsLoading(true);
//         try {
//             // Sử dụng orderApi.update để đồng bộ logic
//             await orderApi.update(id, { status });
//             showToast(`Đã chuyển đơn hàng #${id} sang ${status}`, "success");

//             // Cập nhật state cục bộ để UI thay đổi ngay lập tức
//             setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
//         } catch (error) {
//             showToast("Lỗi khi cập nhật trạng thái đơn hàng", "error");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // ==============================
//     // RENDER CONTENT
//     // ==============================
//     const renderContent = () => {
//         switch (activeTab) {
//             case 'products':
//                 return (
//                     <ProductList
//                         products={products}
//                         onEdit={handleEditProduct}
//                         onDelete={handleDeleteProductSuccess}
//                         onAdd={handleAddProduct}
//                     />
//                 );

//             case 'categories':
//                 return (
//                     <CategoryManager
//                         categories={categories}
//                         onSave={handleSaveCategory} // Truyền hàm xử lý thực tế thay vì loadCommonData
//                         onDelete={handleDeleteCategory} // Truyền hàm xử lý thực tế
//                     />
//                 );

//             case 'brands':
//                 return (
//                     <BrandManager
//                         brands={brands}
//                         onSave={loadCommonData}
//                         onDelete={loadCommonData}
//                     />
//                 );

//             case 'orders':
//                 return (
//                     <OrderManager
//                         orders={orders}
//                         onStatusChange={async (id, status) => {
//                             try {
//                                 await axiosClient.put(`/orders/${id}`, { status });
//                                 fetchDataByTab();
//                                 showToast("Cập nhật đơn hàng thành công", "success");
//                             } catch {
//                                 showToast("Lỗi cập nhật đơn hàng", "error");
//                             }
//                         }}
//                     />
//                 );

//             case 'users':
//                 return (
//                     <UserManager
//                         users={users}
//                         onToggleStatus={async (id) => {
//                             try {
//                                 await axiosClient.put(`/users/${id}/toggle-status`);
//                                 fetchDataByTab();
//                                 showToast("Cập nhật user thành công", "success");
//                             } catch {
//                                 showToast("Lỗi cập nhật user", "error");
//                             }
//                         }}
//                     />
//                 );

//             default:
//                 return (
//                     <div className="p-10 text-slate-400 italic font-bold">
//                         CHÀO MỪNG ADMIN 👋
//                     </div>
//                 );
//         }
//     };

//     // ==============================
//     // UI
//     // ==============================
//     return (
//         <div className="min-h-screen bg-slate-50 flex">
//             <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//             <main className="flex-1 ml-64 p-8 relative">
//                 {isLoading && (
//                     <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
//                         <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full"></div>
//                     </div>
//                 )}

//                 <div className="max-w-[1200px] mx-auto">
//                     {renderContent()}
//                 </div>
//             </main>

//             {isProductFormOpen && (
//                 <ProductForm
//                     product={editingProduct}
//                     categories={categories}
//                     brands={brands}
//                     onSave={handleSaveProductSuccess}
//                     onClose={() => setIsProductFormOpen(false)}
//                 />
//             )}
//         </div>
//     );
// };

// export default AdminDashboard;


import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../Admin/components/Sidebar';
import ProductList from '../Admin/components/ProductList';
import ProductForm from '../Admin/components/ProductForm';
import CategoryManager from '../Admin/components/CategoryManager';
import BrandManager from '../Admin/components/BrandManager';
import OrderManager from '../Admin/components/OrderManager';
import UserManager from '../Admin/components/UserManager';

// Import các API và Type đã định nghĩa
import { productApi, categoryApi, brandApi, orderApi } from '../api/adminApi';
import axiosClient from '../api/axiosClient';
import { Product, Category, Brand, Order, User, OrderStatus } from '../Admin/typesAdmin';
import { useToast } from '../context/ToastContext';

const AdminDashboard: React.FC = () => {
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState('products');
    const [isLoading, setIsLoading] = useState(false);

    // ==============================
    // STATE DATA
    // ==============================
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // ==============================
    // MODAL PRODUCT
    // ==============================
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();

    // ==============================
    // LOAD CATEGORY + BRAND (Dữ liệu dùng chung)
    // ==============================
    const loadCommonData = useCallback(async () => {
        try {
            const [cData, bData] = await Promise.all([
                categoryApi.getAll(),
                brandApi.getAll()
            ]);
            setCategories(cData || []);
            setBrands(bData || []);
        } catch (error) {
            console.error(error);
            showToast("Lỗi tải danh mục / thương hiệu", "error");
        }
    }, [showToast]);

    // ==============================
    // LOAD DATA THEO TAB
    // ==============================
    const fetchDataByTab = useCallback(async () => {
        setIsLoading(true);
        try {
            switch (activeTab) {
                case 'products': {
                    const data = await productApi.getAll();
                    const safeData: Product[] = (data || []).map((p: Product) => ({
                        ...p,
                        basePrice: p.basePrice ?? 0,
                        salePrice: p.salePrice ?? null,
                        totalSold: p.totalSold ?? 0,
                        images: p.images ?? [],
                        active: p.active ?? true
                    }));
                    setProducts(safeData);
                    break;
                }
                case 'orders': {
                    // Sử dụng orderApi thay vì gọi trực tiếp axiosClient
                    const data = await orderApi.getAll();
                    setOrders(data || []);
                    break;
                }
                case 'users': {
                    const data = await axiosClient.get('/users').then(r => r.data);
                    setUsers(data || []);
                    break;
                }
            }
        } catch (error) {
            console.error(error);
            showToast("Lỗi tải dữ liệu", "error");
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, showToast]);

    // ==============================
    // EFFECTS
    // ==============================
    useEffect(() => {
        loadCommonData();
    }, [loadCommonData]);

    useEffect(() => {
        fetchDataByTab();
    }, [fetchDataByTab]);

    // ==============================
    // PRODUCT ACTIONS
    // ==============================
    const handleAddProduct = () => {
        setEditingProduct(undefined);
        setIsProductFormOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductFormOpen(true);
    };

    const handleDeleteProductSuccess = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast("Đã xóa sản phẩm", "info");
    };

    const handleSaveProductSuccess = () => {
        setIsProductFormOpen(false);
        fetchDataByTab();
        showToast("Lưu sản phẩm thành công", "success");
    };

    // ==============================
    // CATEGORY ACTIONS
    // ==============================
    const handleSaveCategory = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const categoryRaw = formData.get('category');
            const categoryData = categoryRaw instanceof Blob ? JSON.parse(await categoryRaw.text()) : {};
            const categoryId = categoryData.id;

            if (categoryId) {
                await axiosClient.put(`/category/${categoryId}`, formData);
                showToast("Cập nhật danh mục thành công", "success");
            } else {
                await axiosClient.post('/category', formData);
                showToast("Thêm danh mục thành công", "success");
            }
            loadCommonData();
        } catch (error) {
            showToast("Lỗi khi lưu danh mục", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
        setIsLoading(true);
        try {
            await categoryApi.delete(id);
            showToast("Xóa danh mục thành công", "info");
            loadCommonData();
        } catch (error) {
            showToast("Lỗi khi xóa danh mục", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // ==============================
    // BRAND ACTIONS
    // ==============================
    const handleSaveBrand = async (brand: Brand) => {
        setIsLoading(true);
        try {
            if (brand.id) {
                await brandApi.update(brand.id, brand);
                showToast("Cập nhật thương hiệu thành công", "success");
            } else {
                await brandApi.create(brand);
                showToast("Thêm thương hiệu thành công", "success");
            }
            loadCommonData();
        } catch (error) {
            showToast("Lỗi khi lưu thương hiệu", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteBrand = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) return;
        setIsLoading(true);
        try {
            await brandApi.delete(id);
            showToast("Xóa thương hiệu thành công", "info");
            loadCommonData();
        } catch (error) {
            showToast("Lỗi khi xóa thương hiệu", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // ==============================
    // ORDER ACTIONS
    // ==============================
    const handleUpdateOrderStatus = async (id: number, status: OrderStatus) => {
        setIsLoading(true);
        try {
            // Sử dụng orderApi.update để đồng bộ logic
            await orderApi.update(id, { status });
            showToast(`Đã chuyển đơn hàng #${id} sang ${status}`, "success");

            // Cập nhật state cục bộ để UI thay đổi ngay lập tức
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (error) {
            showToast("Lỗi khi cập nhật trạng thái đơn hàng", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // ==============================
    // RENDER CONTENT
    // ==============================
    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return (
                    <ProductList
                        products={products}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProductSuccess}
                        onAdd={handleAddProduct}
                    />
                );

            case 'categories':
                return (
                    <CategoryManager
                        categories={categories}
                        onSave={handleSaveCategory}
                        onDelete={handleDeleteCategory}
                    />
                );

            case 'brands':
                return (
                    <BrandManager
                        brands={brands}
                        onSave={handleSaveBrand}
                        onDelete={handleDeleteBrand}
                    />
                );

            case 'orders':
                return (
                    <OrderManager
                        orders={orders}
                        onStatusChange={handleUpdateOrderStatus}
                    />
                );

            case 'users':
                return (
                    <UserManager
                        users={users}
                        onToggleStatus={async (id) => {
                            try {
                                await axiosClient.put(`/users/${id}/toggle-status`);
                                fetchDataByTab();
                                showToast("Cập nhật trạng thái người dùng thành công", "success");
                            } catch {
                                showToast("Lỗi cập nhật người dùng", "error");
                            }
                        }}
                    />
                );

            default:
                return (
                    <div className="p-10 text-slate-400 italic font-bold">
                        CHÀO MỪNG ADMIN 👋
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 ml-64 p-8 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                        <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full"></div>
                    </div>
                )}

                <div className="max-w-[1200px] mx-auto">
                    {renderContent()}
                </div>
            </main>

            {isProductFormOpen && (
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    brands={brands}
                    onSave={handleSaveProductSuccess}
                    onClose={() => setIsProductFormOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;