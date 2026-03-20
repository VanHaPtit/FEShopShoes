// import React, { useState } from 'react';
// import {
//     Search, Filter, Plus, ExternalLink, Edit3, Trash2,
//     ChevronLeft, ChevronRight, TrendingUp, PackageCheck
// } from 'lucide-react';
// import { Product } from '../typesAdmin';
// import { productApi } from '../../api/adminApi';

// interface ProductListProps {
//     products: Product[];
//     onEdit: (product: Product) => void;
//     onDelete: (id: number) => void;
//     onAdd: () => void;
// }

// const ITEMS_PER_PAGE = 8;

// const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onAdd }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterCategory, setFilterCategory] = useState('All');
//     const [page, setPage] = useState(1);
//     const [deletingId, setDeletingId] = useState<number | null>(null);

//     const categories = Array.from(
//         new Set(products.map(p => p.category?.name).filter(Boolean))
//     ) as string[];

//     const filtered = products.filter(p => {
//         const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchCategory = filterCategory === 'All' || p.category?.name === filterCategory;
//         return matchSearch && matchCategory;
//     });

//     const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//     const safePage = Math.min(page, totalPages);
//     const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

//     const totalStock = (p: Product) =>
//         (p.variants ?? []).reduce((acc, v) => acc + v.stock, 0);
//     const isOos = (p: Product) =>
//         (p.variants ?? []).length > 0 && (p.variants ?? []).every(v => v.stock === 0);

//     const handleDelete = async (id: number) => {
//         if (!window.confirm('Xóa sản phẩm này?')) return;
//         setDeletingId(id);
//         try {
//             await productApi.delete(id);
//             onDelete(id);
//         } catch (err: any) {
//             alert(err?.response?.data?.message ?? 'Xóa thất bại. Vui lòng thử lại.');
//         } finally {
//             setDeletingId(null);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                     <h2 className="text-2xl font-bold text-slate-900">Products</h2>
//                     <p className="text-slate-500 text-sm">Manage your product catalog and inventory levels</p>
//                 </div>
//                 <button
//                     onClick={onAdd}
//                     className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 w-fit"
//                 >
//                     <Plus className="w-5 h-5" /> New Product
//                 </button>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <StatCard icon={<PackageCheck className="w-6 h-6" />} color="blue" label="Total Items" value={products.length} />
//                 <StatCard icon={<TrendingUp className="w-6 h-6" />} color="emerald" label="Top Sellers" value={products.filter(p => p.totalSold > 100).length} />
//                 <StatCard icon={<Trash2 className="w-6 h-6" />} color="amber" label="Out of Stock" value={products.filter(isOos).length} />
//             </div>

//             {/* Search & Filter */}
//             <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
//                 <div className="relative flex-1 w-full">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
//                     <input
//                         type="text"
//                         placeholder="Search products by name..."
//                         value={searchTerm}
//                         onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
//                         className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                     />
//                 </div>
//                 <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-full md:w-auto">
//                     <Filter className="w-4 h-4 text-slate-500" />
//                     <select
//                         value={filterCategory}
//                         onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
//                         className="bg-transparent text-sm font-medium text-slate-600 outline-none"
//                     >
//                         <option value="All">All Categories</option>
//                         {categories.map(c => <option key={c} value={c}>{c}</option>)}
//                     </select>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//                 <table className="w-full text-left">
//                     <thead className="bg-slate-50/80 border-b border-slate-100">
//                         <tr>
//                             {['Product', 'Status', 'Inventory', 'Price', 'Sales', ''].map((h, i) => (
//                                 <th key={i} className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === '' ? 'text-right' : ''}`}>
//                                     {h}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                         {paginated.length === 0 ? (
//                             <tr>
//                                 <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
//                                     Không tìm thấy sản phẩm nào.
//                                 </td>
//                             </tr>
//                         ) : paginated.map(product => {
//                             const stock = totalStock(product);
//                             const oos = isOos(product);
//                             return (
//                                 <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
//                                     {/* Product */}
//                                     <td className="px-6 py-5">
//                                         <div className="flex items-center gap-4">
//                                             <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
//                                                 {product.images?.[0]
//                                                     ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
//                                                     : <PackageCheck className="w-full h-full p-2.5 text-slate-300" />
//                                                 }
//                                             </div>
//                                             <div>
//                                                 <p className="font-semibold text-slate-900 leading-tight">{product.name}</p>
//                                                 <p className="text-xs text-slate-400 mt-0.5">
//                                                     {product.category?.name ?? 'Uncategorized'} · {product.brand?.name ?? 'No Brand'}
//                                                 </p>
//                                                 {product.slug && (
//                                                     <p className="text-[10px] text-slate-300 font-mono mt-0.5">/{product.slug}</p>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </td>
//                                     {/* Status */}
//                                     <td className="px-6 py-5">
//                                         {product.active
//                                             ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
//                                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active
//                                             </span>
//                                             : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">Hidden</span>
//                                         }
//                                     </td>
//                                     {/* Inventory */}
//                                     <td className="px-6 py-5">
//                                         {(product.variants ?? []).length === 0 ? (
//                                             <span className="text-xs text-slate-400 italic">No variants</span>
//                                         ) : (
//                                             <div className="space-y-1.5">
//                                                 <div className="flex items-center justify-between text-xs font-medium">
//                                                     <span className="text-slate-500">Stock</span>
//                                                     <span className={oos || stock < 10 ? 'text-red-600 font-bold' : 'text-slate-900'}>
//                                                         {stock} units
//                                                     </span>
//                                                 </div>
//                                                 <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                                                     <div
//                                                         className={`h-full rounded-full ${oos || stock < 10 ? 'bg-red-500' : 'bg-blue-500'}`}
//                                                         style={{ width: `${Math.min(100, stock)}%` }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </td>
//                                     {/* Price */}
//                                     <td className="px-6 py-5">
//                                         <span className="font-bold text-slate-900">
//                                             ${(product.salePrice ?? product.basePrice).toLocaleString()}
//                                         </span>
//                                         {product.salePrice != null && product.salePrice < product.basePrice && (
//                                             <span className="block text-xs text-slate-400 line-through">
//                                                 ${product.basePrice.toLocaleString()}
//                                             </span>
//                                         )}
//                                     </td>
//                                     {/* Sales */}
//                                     <td className="px-6 py-5 text-sm text-slate-600 font-medium">
//                                         {product.totalSold.toLocaleString()} sold
//                                     </td>
//                                     {/* Actions */}
//                                     <td className="px-6 py-5 text-right">
//                                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                             <button onClick={() => onEdit(product)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Sửa">
//                                                 <Edit3 className="w-5 h-5" />
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDelete(product.id!)}
//                                                 disabled={deletingId === product.id}
//                                                 className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
//                                                 title="Xóa"
//                                             >
//                                                 <Trash2 className="w-5 h-5" />
//                                             </button>
//                                             <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all" title="Xem">
//                                                 <ExternalLink className="w-5 h-5" />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>

//                 {/* Pagination */}
//                 <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
//                     <p className="text-sm text-slate-500">
//                         Showing{' '}
//                         <span className="font-medium text-slate-900">
//                             {filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}
//                         </span>–
//                         <span className="font-medium text-slate-900">
//                             {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}
//                         </span>{' '}
//                         of <span className="font-medium text-slate-900">{filtered.length}</span> results
//                     </p>
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => setPage(p => Math.max(1, p - 1))}
//                             disabled={safePage === 1}
//                             className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                         >
//                             <ChevronLeft className="w-5 h-5" />
//                         </button>
//                         <span className="text-sm font-medium text-slate-700 px-2">{safePage} / {totalPages}</span>
//                         <button
//                             onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                             disabled={safePage === totalPages}
//                             className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                         >
//                             <ChevronRight className="w-5 h-5" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const colorMap: Record<string, string> = {
//     blue: 'bg-blue-50 text-blue-600',
//     emerald: 'bg-emerald-50 text-emerald-600',
//     amber: 'bg-amber-50 text-amber-600',
// };
// const StatCard: React.FC<{ icon: React.ReactNode; color: string; label: string; value: number }> = ({ icon, color, label, value }) => (
//     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
//         <div className={`p-3 rounded-xl ${colorMap[color] ?? ''}`}>{icon}</div>
//         <div>
//             <p className="text-sm text-slate-500 font-medium">{label}</p>
//             <p className="text-2xl font-bold text-slate-900">{value}</p>
//         </div>
//     </div>
// );

// export default ProductList;









import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Filter, Plus, ExternalLink, Edit3, Trash2,
    ChevronLeft, ChevronRight, TrendingUp, PackageCheck,
    Download, Upload, AlertCircle, CheckCircle2, X,
    Gift, Calendar, DollarSign, Package, Check
} from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Product } from '../typesAdmin';
import { productApi } from '../../api/adminApi';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category { id: number; name: string; }

interface ComboProduct { id: number; name: string; images?: string[]; }

interface Combo {
    id?: number;
    name: string;
    comboPrice: number;
    startDate: string;
    endDate: string;
    products: ComboProduct[];
}

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 8;
const API = 'http://localhost:8080/api/v1';

const EXPORT_COLUMNS = [
    { header: 'ID', key: 'id' },
    { header: 'Tên sản phẩm', key: 'name' },
    { header: 'Slug', key: 'slug' },
    { header: 'Danh mục', key: 'category.name' },
    { header: 'Thương hiệu', key: 'brand.name' },
    { header: 'Giá gốc', key: 'basePrice' },
    { header: 'Giá sale', key: 'salePrice' },
    { header: 'Tổng đã bán', key: 'totalSold' },
    { header: 'Tồn kho', key: '_stock' },
    { header: 'Kích hoạt', key: 'active' },
];

const getNestedValue = (obj: any, path: string): any => {
    if (path === '_stock')
        return (obj.variants ?? []).reduce((s: number, v: any) => s + v.stock, 0);
    return path.split('.').reduce((acc, k) => acc?.[k], obj);
};

type ToastType = 'success' | 'error';
interface Toast { id: number; type: ToastType; msg: string; }

const BLANK_COMBO: Omit<Combo, 'id'> = { name: '', comboPrice: 0, startDate: '', endDate: '', products: [] };

// ─────────────────────────────────────────────────────────────────────────────
const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onAdd }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [page, setPage] = useState(1);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const importRef = useRef<HTMLInputElement>(null);

    // ── Categories từ API ────────────────────────────────────────────────
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        axios.get<Category[]>(`${API}/categories`, { withCredentials: true })
            .then(r => setCategories(r.data))
            .catch(() => {
                // Fallback: lấy từ danh sách products hiện có
                const names = Array.from(
                    new Set(products.map(p => p.category?.name).filter(Boolean))
                ) as string[];
                setCategories(names.map((n, i) => ({ id: i, name: n })));
            });
    }, []); // chỉ gọi 1 lần khi mount

    // ── Combo state ──────────────────────────────────────────────────────
    const [showComboPanel, setShowComboPanel] = useState(false);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [comboLoading, setComboLoading] = useState(false);
    const [comboForm, setComboForm] = useState<Omit<Combo, 'id'>>(BLANK_COMBO);
    const [editingComboId, setEditingComboId] = useState<number | null>(null);
    const [comboSearch, setComboSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [saving, setSaving] = useState(false);

    const loadCombos = async () => {
        setComboLoading(true);
        try {
            const r = await axios.get<Combo[]>(`${API}/combos`, { withCredentials: true });
            setCombos(r.data);
        } catch { pushToast('error', 'Không thể tải danh sách combo.'); }
        finally { setComboLoading(false); }
    };

    const openComboPanel = () => { setShowComboPanel(true); loadCombos(); };

    const startEditCombo = (c: Combo) => {
        setEditingComboId(c.id ?? null);
        setComboForm({
            name: c.name,
            comboPrice: c.comboPrice,
            startDate: c.startDate?.slice(0, 16) ?? '',
            endDate: c.endDate?.slice(0, 16) ?? '',
            products: c.products ?? [],
        });
    };

    const resetComboForm = () => { setEditingComboId(null); setComboForm(BLANK_COMBO); setProductSearch(''); };

    const toggleProduct = (p: Product) => {
        setComboForm(prev => {
            const exists = prev.products.some(x => x.id === p.id);
            return {
                ...prev,
                products: exists
                    ? prev.products.filter(x => x.id !== p.id)
                    : [...prev.products, { id: p.id!, name: p.name, images: p.images }],
            };
        });
    };

    const handleSaveCombo = async () => {
        if (!comboForm.name.trim()) { pushToast('error', 'Tên combo không được để trống.'); return; }
        if (comboForm.comboPrice <= 0) { pushToast('error', 'Giá combo phải lớn hơn 0.'); return; }
        if (comboForm.products.length < 2) { pushToast('error', 'Combo cần ít nhất 2 sản phẩm.'); return; }
        setSaving(true);
        try {
            const payload = {
                ...comboForm,
                startDate: comboForm.startDate ? comboForm.startDate + ':00' : null,
                endDate: comboForm.endDate ? comboForm.endDate + ':00' : null,
                products: comboForm.products.map(p => ({ id: p.id })),
            };
            if (editingComboId) {
                await axios.put(`${API}/combos/${editingComboId}`, payload, { withCredentials: true });
                pushToast('success', 'Đã cập nhật combo.');
            } else {
                await axios.post(`${API}/combos`, payload, { withCredentials: true });
                pushToast('success', 'Đã tạo combo mới!');
            }
            resetComboForm();
            loadCombos();
        } catch { pushToast('error', 'Lỗi khi lưu combo.'); }
        finally { setSaving(false); }
    };

    const handleDeleteCombo = async (id: number) => {
        if (!window.confirm('Xoá combo này?')) return;
        try {
            await axios.delete(`${API}/combos/${id}`, { withCredentials: true });
            pushToast('success', 'Đã xoá combo.');
            setCombos(prev => prev.filter(c => c.id !== id));
            if (editingComboId === id) resetComboForm();
        } catch { pushToast('error', 'Xoá combo thất bại.'); }
    };

    // ── Toast ─────────────────────────────────────────────────────────────
    const pushToast = (type: ToastType, msg: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, msg }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // ── Filter / Pagination ───────────────────────────────────────────────
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory === 'All' || p.category?.name === filterCategory)
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
    const totalStock = (p: Product) => (p.variants ?? []).reduce((a, v) => a + v.stock, 0);
    const isOos = (p: Product) => (p.variants ?? []).length > 0 && (p.variants ?? []).every(v => v.stock === 0);

    // ── Delete product ────────────────────────────────────────────────────
    const handleDelete = async (id: number) => {
        if (!window.confirm('Xóa sản phẩm này?')) return;
        setDeletingId(id);
        try { await productApi.delete(id); onDelete(id); }
        catch (err: any) { alert(err?.response?.data?.message ?? 'Xóa thất bại.'); }
        finally { setDeletingId(null); }
    };

    // ── Export Excel ──────────────────────────────────────────────────────
    const handleExport = () => {
        const rows = filtered.map(p =>
            Object.fromEntries(EXPORT_COLUMNS.map(col => [
                col.header,
                col.key === 'active' ? (getNestedValue(p, col.key) ? 'Có' : 'Không') : (getNestedValue(p, col.key) ?? '')
            ]))
        );
        const ws = XLSX.utils.json_to_sheet(rows);
        ws['!cols'] = EXPORT_COLUMNS.map(c => ({ wch: Math.max(c.header.length + 4, 16) }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Products');
        XLSX.writeFile(wb, `products_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
        pushToast('success', `Đã xuất ${rows.length} sản phẩm.`);
    };

    // ── Import Excel ──────────────────────────────────────────────────────
    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        e.target.value = '';
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const wb = XLSX.read(new Uint8Array(ev.target?.result as ArrayBuffer), { type: 'array' });
                const rows = XLSX.utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]], { defval: '' });
                if (!rows.length) { pushToast('error', 'File không có dữ liệu.'); return; }
                const missing = ['Tên sản phẩm', 'Giá gốc'].filter(h => !(h in rows[0]));
                if (missing.length) { pushToast('error', `Thiếu cột: ${missing.join(', ')}`); return; }
                const mapped = rows.map((r, i) => ({
                    _row: i + 2,
                    name: String(r['Tên sản phẩm'] ?? '').trim(),
                    basePrice: Number(r['Giá gốc']) || 0,
                    salePrice: r['Giá sale'] !== '' ? Number(r['Giá sale']) : undefined,
                    active: r['Kích hoạt'] === 'Có',
                    slug: String(r['Slug'] ?? '').trim() || undefined,
                    category: r['Danh mục'] ? { name: String(r['Danh mục']) } : undefined,
                    brand: r['Thương hiệu'] ? { name: String(r['Thương hiệu']) } : undefined,
                }));
                const bad = mapped.filter(r => !r.name || r.basePrice <= 0);
                if (bad.length) { pushToast('error', `${bad.length} dòng lỗi: ${bad.map(r => r._row).join(', ')}`); return; }
                // TODO: await productApi.bulkCreate(mapped)
                console.log('[Import]', mapped);
                pushToast('success', `Đọc thành công ${mapped.length} sản phẩm.`);
            } catch { pushToast('error', 'Không đọc được file .xlsx / .xls'); }
        };
        reader.readAsArrayBuffer(file);
    };

    const filteredForCombo = products.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    );

    // ─────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 relative">

            {/* ── Toast stack ─────────────────────────────────────────── */}
            <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium max-w-sm
                        ${t.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        {t.type === 'success'
                            ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                            : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-500" />}
                        <span className="flex-1">{t.msg}</span>
                        <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}>
                            <X className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                        </button>
                    </div>
                ))}
            </div>

            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Products</h2>
                    <p className="text-slate-500 text-sm">Manage your product catalog and inventory levels</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <input ref={importRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImportFile} />
                    <button onClick={() => importRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                        <Upload className="w-4 h-4 text-violet-500" /> Import Excel
                    </button>
                    <button onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                        <Download className="w-4 h-4 text-emerald-500" /> Export Excel
                    </button>
                    {/* Combo button */}
                    <button onClick={openComboPanel}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-lg shadow-amber-200">
                        <Gift className="w-4 h-4" /> Quản lý Combo
                    </button>
                    <button onClick={onAdd}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4" /> New Product
                    </button>
                </div>
            </div>

            {/* ── Stats ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<PackageCheck className="w-6 h-6" />} color="blue" label="Total Items" value={products.length} />
                <StatCard icon={<TrendingUp className="w-6 h-6" />} color="emerald" label="Top Sellers" value={products.filter(p => p.totalSold > 100).length} />
                <StatCard icon={<Trash2 className="w-6 h-6" />} color="amber" label="Out of Stock" value={products.filter(isOos).length} />
            </div>

            {/* ── Search & Filter ──────────────────────────────────────── */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Search products by name..." value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select value={filterCategory}
                        onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
                        className="bg-transparent text-sm font-medium text-slate-600 outline-none">
                        <option value="All">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                {(searchTerm || filterCategory !== 'All') && (
                    <p className="text-xs text-slate-400 whitespace-nowrap">{filtered.length} / {products.length} sản phẩm</p>
                )}
            </div>

            {/* ── Table ───────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-100">
                        <tr>
                            {['Product', 'Status', 'Inventory', 'Price', 'Sales', ''].map((h, i) => (
                                <th key={i} className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === '' ? 'text-right' : ''}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginated.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400">Không tìm thấy sản phẩm nào.</td></tr>
                        ) : paginated.map(product => {
                            const stock = totalStock(product);
                            const oos = isOos(product);
                            return (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                {product.images?.[0]
                                                    ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    : <PackageCheck className="w-full h-full p-2.5 text-slate-300" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 leading-tight">{product.name}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{product.category?.name ?? 'Uncategorized'} · {product.brand?.name ?? 'No Brand'}</p>
                                                {product.slug && <p className="text-[10px] text-slate-300 font-mono mt-0.5">/{product.slug}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {product.active
                                            ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active</span>
                                            : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">Hidden</span>}
                                    </td>
                                    <td className="px-6 py-5">
                                        {(product.variants ?? []).length === 0
                                            ? <span className="text-xs text-slate-400 italic">No variants</span>
                                            : <div className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs font-medium">
                                                    <span className="text-slate-500">Stock</span>
                                                    <span className={oos || stock < 10 ? 'text-red-600 font-bold' : 'text-slate-900'}>{stock} units</span>
                                                </div>
                                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${oos || stock < 10 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${Math.min(100, stock)}%` }} />
                                                </div>
                                            </div>}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-bold text-slate-900">${(product.salePrice ?? product.basePrice).toLocaleString()}</span>
                                        {product.salePrice != null && product.salePrice < product.basePrice && (
                                            <span className="block text-xs text-slate-400 line-through">${product.basePrice.toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-600 font-medium">{product.totalSold.toLocaleString()} sold</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onEdit(product)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(product.id!)} disabled={deletingId === product.id}
                                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"><Trash2 className="w-5 h-5" /></button>
                                            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"><ExternalLink className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900">{filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}</span>–
                        <span className="font-medium text-slate-900">{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}</span> of{' '}
                        <span className="font-medium text-slate-900">{filtered.length}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronLeft className="w-5 h-5" /></button>
                        <span className="text-sm font-medium text-slate-700 px-2">{safePage} / {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* COMBO PANEL                                               */}
            {/* ══════════════════════════════════════════════════════════ */}
            {showComboPanel && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

                        {/* Panel header */}
                        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-xl"><Gift className="w-5 h-5 text-amber-600" /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Quản lý Combo</h3>
                                    <p className="text-xs text-slate-400">{combos.length} combo hiện có</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowComboPanel(false); resetComboForm(); }}
                                className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            {/* LEFT – Danh sách combo */}
                            <div className="w-[40%] border-r border-slate-100 flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-slate-100">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/30 outline-none"
                                            placeholder="Tìm combo..." value={comboSearch}
                                            onChange={e => setComboSearch(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {comboLoading && (
                                        <div className="text-center py-10 text-slate-400 text-sm">
                                            <div className="w-6 h-6 border-2 border-slate-200 border-t-amber-400 rounded-full animate-spin mx-auto mb-2" />
                                            Đang tải...
                                        </div>
                                    )}
                                    {!comboLoading && combos.length === 0 && (
                                        <div className="text-center py-14 text-slate-300">
                                            <Gift className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                            <p className="text-sm">Chưa có combo nào</p>
                                        </div>
                                    )}
                                    {combos
                                        .filter(c => c.name.toLowerCase().includes(comboSearch.toLowerCase()))
                                        .map(c => (
                                            <div key={c.id}
                                                className={`p-4 rounded-2xl border cursor-pointer transition-all
                                                    ${editingComboId === c.id
                                                        ? 'border-amber-400 bg-amber-50 shadow-sm shadow-amber-100'
                                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}
                                                onClick={() => startEditCombo(c)}>
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-slate-900 text-sm truncate">{c.name}</p>
                                                        <p className="text-xs text-amber-600 font-bold mt-0.5">
                                                            {c.comboPrice.toLocaleString('vi-VN')}đ
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                            <Package className="w-3 h-3" /> {c.products?.length ?? 0} sp
                                                            {c.endDate && (
                                                                <><span className="mx-1">·</span>
                                                                    <Calendar className="w-3 h-3" /> HSD: {new Date(c.endDate).toLocaleDateString('vi-VN')}</>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <button onClick={e => { e.stopPropagation(); c.id && handleDeleteCombo(c.id); }}
                                                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {(c.products?.length ?? 0) > 0 && (
                                                    <div className="flex gap-1 mt-2.5 flex-wrap">
                                                        {c.products.slice(0, 5).map((p, i) => (
                                                            <img key={i} src={p.images?.[0] ?? 'https://placehold.co/28x28?text=?'}
                                                                className="w-7 h-7 rounded-lg object-cover border border-white shadow-sm" alt="" />
                                                        ))}
                                                        {c.products.length > 5 && (
                                                            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-400">
                                                                +{c.products.length - 5}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                                <div className="p-4 border-t border-slate-100">
                                    <button onClick={resetComboForm}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-amber-200 rounded-xl text-sm text-amber-500 hover:border-amber-400 hover:bg-amber-50/50 transition-all font-semibold">
                                        <Plus className="w-4 h-4" /> Tạo combo mới
                                    </button>
                                </div>
                            </div>

                            {/* RIGHT – Form */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${editingComboId ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                        <h4 className="text-sm font-bold text-slate-700">
                                            {editingComboId ? `Sửa combo #${editingComboId}` : 'Tạo combo mới'}
                                        </h4>
                                    </div>

                                    {/* Tên */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                                            Tên combo <span className="text-rose-400">*</span>
                                        </label>
                                        <input className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/30 outline-none"
                                            placeholder="VD: Giày chạy bộ" value={comboForm.name}
                                            onChange={e => setComboForm(p => ({ ...p, name: e.target.value }))} />
                                    </div>

                                    {/* Giá */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                                            Giá combo (đ) <span className="text-rose-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input type="number" min={0} className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/30 outline-none"
                                                placeholder="0" value={comboForm.comboPrice || ''}
                                                onChange={e => setComboForm(p => ({ ...p, comboPrice: Number(e.target.value) }))} />
                                        </div>
                                    </div>

                                    {/* Ngày */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Bắt đầu</label>
                                            <input type="datetime-local" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/30 outline-none"
                                                value={comboForm.startDate}
                                                onChange={e => setComboForm(p => ({ ...p, startDate: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Kết thúc</label>
                                            <input type="datetime-local" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/30 outline-none"
                                                value={comboForm.endDate}
                                                onChange={e => setComboForm(p => ({ ...p, endDate: e.target.value }))} />
                                        </div>
                                    </div>

                                    {/* Chọn sản phẩm */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Sản phẩm trong combo
                                            </label>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold
                                                ${comboForm.products.length >= 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {comboForm.products.length} đã chọn {comboForm.products.length < 2 && '(tối thiểu 2)'}
                                            </span>
                                        </div>

                                        {/* Chips sản phẩm đã chọn */}
                                        {comboForm.products.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-3 p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                                                {comboForm.products.map(p => (
                                                    <span key={p.id} className="flex items-center gap-1 pl-2 pr-1 py-1 bg-white border border-amber-200 text-amber-800 text-xs font-semibold rounded-full shadow-sm">
                                                        {p.name}
                                                        <button onClick={() => toggleProduct(p as any)}
                                                            className="w-4 h-4 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center transition-colors">
                                                            <X className="w-2.5 h-2.5" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Search + checkbox list */}
                                        <div className="relative mb-2">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                            <input className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-amber-400/40 outline-none"
                                                placeholder="Tìm sản phẩm để thêm..." value={productSearch}
                                                onChange={e => setProductSearch(e.target.value)} />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-100 divide-y divide-slate-50">
                                            {filteredForCombo.slice(0, 40).map(p => {
                                                const selected = comboForm.products.some(x => x.id === p.id);
                                                return (
                                                    <button key={p.id} onClick={() => toggleProduct(p)}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                                                            ${selected ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                                                        <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all
                                                            ${selected ? 'bg-amber-500 border-amber-500' : 'border-slate-300'}`}>
                                                            {selected && <Check className="w-2.5 h-2.5 text-white" />}
                                                        </div>
                                                        <img src={p.images?.[0] ?? 'https://placehold.co/28x28?text=?'}
                                                            className="w-7 h-7 rounded-lg object-cover border border-slate-200 flex-shrink-0" alt="" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                                                            <p className="text-[10px] text-slate-400">{p.category?.name} · {p.basePrice.toLocaleString('vi-VN')}đ</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                            {filteredForCombo.length === 0 && (
                                                <p className="text-center text-xs text-slate-400 py-6">Không tìm thấy sản phẩm</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form footer */}
                                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3 flex-shrink-0">
                                    <div>
                                        {comboForm.comboPrice > 0 && (
                                            <p className="text-base font-black text-amber-600">
                                                {comboForm.comboPrice.toLocaleString('vi-VN')}đ
                                            </p>
                                        )}
                                        <p className="text-[10px] text-slate-400">{comboForm.products.length} sản phẩm được chọn</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={resetComboForm}
                                            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
                                            Đặt lại
                                        </button>
                                        <button onClick={handleSaveCombo} disabled={saving}
                                            className="px-5 py-2 text-sm font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md shadow-amber-200">
                                            {saving
                                                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                                                : <Check className="w-4 h-4" />}
                                            {editingComboId ? 'Cập nhật' : 'Tạo Combo'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
};
const StatCard: React.FC<{ icon: React.ReactNode; color: string; label: string; value: number }> = ({ icon, color, label, value }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorMap[color] ?? ''}`}>{icon}</div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

export default ProductList;








// import React, { useState, useRef } from 'react';
// import {
//     Search, Filter, Plus, ExternalLink, Edit3, Trash2,
//     ChevronLeft, ChevronRight, TrendingUp, PackageCheck,
//     Download, Upload, AlertCircle, CheckCircle2, X
// } from 'lucide-react';
// import * as XLSX from 'xlsx';
// import { Product } from '../typesAdmin';
// import { productApi } from '../../api/adminApi';

// interface ProductListProps {
//     products: Product[];
//     onEdit: (product: Product) => void;
//     onDelete: (id: number) => void;
//     onAdd: () => void;
// }

// const ITEMS_PER_PAGE = 8;

// // ─── Cột Excel & mapping ────────────────────────────────────────────────────
// const EXPORT_COLUMNS = [
//     { header: 'ID', key: 'id' },
//     { header: 'Tên sản phẩm', key: 'name' },
//     { header: 'Slug', key: 'slug' },
//     { header: 'Danh mục', key: 'category.name' },
//     { header: 'Thương hiệu', key: 'brand.name' },
//     { header: 'Giá gốc', key: 'basePrice' },
//     { header: 'Giá sale', key: 'salePrice' },
//     { header: 'Tổng đã bán', key: 'totalSold' },
//     { header: 'Tồn kho', key: '_stock' },   // computed
//     { header: 'Kích hoạt', key: 'active' },
// ];

// const getNestedValue = (obj: any, path: string): any => {
//     if (path === '_stock') {
//         return (obj.variants ?? []).reduce((s: number, v: any) => s + v.stock, 0);
//     }
//     return path.split('.').reduce((acc, k) => acc?.[k], obj);
// };

// // ─── Toast nhỏ ───────────────────────────────────────────────────────────────
// type ToastType = 'success' | 'error';
// interface Toast { id: number; type: ToastType; msg: string }

// const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onAdd }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterCategory, setFilterCategory] = useState('All');
//     const [page, setPage] = useState(1);
//     const [deletingId, setDeletingId] = useState<number | null>(null);
//     const [toasts, setToasts] = useState<Toast[]>([]);
//     const importRef = useRef<HTMLInputElement>(null);

//     // ── Toast helpers ──────────────────────────────────────────────────────
//     const pushToast = (type: ToastType, msg: string) => {
//         const id = Date.now();
//         setToasts(prev => [...prev, { id, type, msg }]);
//         setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
//     };

//     // ── Categories ────────────────────────────────────────────────────────
//     const categories = Array.from(
//         new Set(products.map(p => p.category?.name).filter(Boolean))
//     ) as string[];

//     const filtered = products.filter(p => {
//         const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchCategory = filterCategory === 'All' || p.category?.name === filterCategory;
//         return matchSearch && matchCategory;
//     });

//     const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//     const safePage = Math.min(page, totalPages);
//     const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

//     const totalStock = (p: Product) =>
//         (p.variants ?? []).reduce((acc, v) => acc + v.stock, 0);
//     const isOos = (p: Product) =>
//         (p.variants ?? []).length > 0 && (p.variants ?? []).every(v => v.stock === 0);

//     // ── Delete ─────────────────────────────────────────────────────────────
//     const handleDelete = async (id: number) => {
//         if (!window.confirm('Xóa sản phẩm này?')) return;
//         setDeletingId(id);
//         try {
//             await productApi.delete(id);
//             onDelete(id);
//         } catch (err: any) {
//             alert(err?.response?.data?.message ?? 'Xóa thất bại. Vui lòng thử lại.');
//         } finally {
//             setDeletingId(null);
//         }
//     };

//     // ─────────────────────────────────────────────────────────────────────────
//     // EXPORT EXCEL
//     // ─────────────────────────────────────────────────────────────────────────
//     const handleExport = () => {
//         const rows = filtered.map(p =>
//             Object.fromEntries(
//                 EXPORT_COLUMNS.map(col => [
//                     col.header,
//                     col.key === 'active'
//                         ? (getNestedValue(p, col.key) ? 'Có' : 'Không')
//                         : (getNestedValue(p, col.key) ?? '')
//                 ])
//             )
//         );

//         const ws = XLSX.utils.json_to_sheet(rows);

//         // Độ rộng cột tự động
//         const colWidths = EXPORT_COLUMNS.map(col => ({
//             wch: Math.max(col.header.length + 4, 16)
//         }));
//         ws['!cols'] = colWidths;

//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Products');
//         XLSX.writeFile(wb, `products_export_${new Date().toISOString().slice(0, 10)}.xlsx`);

//         pushToast('success', `Đã xuất ${rows.length} sản phẩm ra file Excel.`);
//     };

//     // ─────────────────────────────────────────────────────────────────────────
//     // IMPORT EXCEL
//     // ─────────────────────────────────────────────────────────────────────────
//     const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         // Reset input để có thể import lại cùng file
//         e.target.value = '';

//         const reader = new FileReader();
//         reader.onload = (ev) => {
//             try {
//                 const data = new Uint8Array(ev.target?.result as ArrayBuffer);
//                 const wb = XLSX.read(data, { type: 'array' });
//                 const ws = wb.Sheets[wb.SheetNames[0]];
//                 const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

//                 if (rows.length === 0) {
//                     pushToast('error', 'File Excel không có dữ liệu.');
//                     return;
//                 }

//                 // Validate cột bắt buộc
//                 const required = ['Tên sản phẩm', 'Giá gốc'];
//                 const missing = required.filter(h => !(h in rows[0]));
//                 if (missing.length > 0) {
//                     pushToast('error', `Thiếu cột bắt buộc: ${missing.join(', ')}`);
//                     return;
//                 }

//                 // Map sang cấu trúc Product (tuỳ backend điều chỉnh thêm)
//                 const mapped = rows.map((r, idx) => ({
//                     _rowIndex: idx + 2,
//                     name: String(r['Tên sản phẩm'] ?? '').trim(),
//                     slug: String(r['Slug'] ?? '').trim() || undefined,
//                     basePrice: Number(r['Giá gốc']) || 0,
//                     salePrice: r['Giá sale'] !== '' ? Number(r['Giá sale']) : undefined,
//                     active: r['Kích hoạt'] === 'Có' || r['Kích hoạt'] === true,
//                     category: r['Danh mục'] ? { name: String(r['Danh mục']) } : undefined,
//                     brand: r['Thương hiệu'] ? { name: String(r['Thương hiệu']) } : undefined,
//                 }));

//                 const invalid = mapped.filter(r => !r.name || r.basePrice <= 0);
//                 if (invalid.length > 0) {
//                     pushToast(
//                         'error',
//                         `${invalid.length} dòng không hợp lệ (thiếu tên hoặc giá): dòng ${invalid.map(r => r._rowIndex).join(', ')}`
//                     );
//                     return;
//                 }

//                 // ⚠️ Đây là nơi bạn gọi API để lưu dữ liệu import.
//                 // Ví dụ: await productApi.bulkCreate(mapped)
//                 // Hiện tại chỉ log ra console để demo:
//                 console.log('[Import] Products to create:', mapped);

//                 pushToast('success', `Đọc thành công ${mapped.length} sản phẩm từ file. Kiểm tra console để xem dữ liệu.`);
//             } catch {
//                 pushToast('error', 'Không thể đọc file. Hãy đảm bảo file đúng định dạng .xlsx / .xls');
//             }
//         };
//         reader.readAsArrayBuffer(file);
//     };

//     return (
//         <div className="space-y-6 relative">

//             {/* ── Toast stack ─────────────────────────────────────────── */}
//             <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2">
//                 {toasts.map(t => (
//                     <div
//                         key={t.id}
//                         className={`flex items-start gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium max-w-sm
//                             ${t.type === 'success'
//                                 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
//                                 : 'bg-rose-50 text-rose-800 border border-rose-200'}`}
//                     >
//                         {t.type === 'success'
//                             ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
//                             : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-500" />}
//                         <span className="flex-1">{t.msg}</span>
//                         <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
//                             <X className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             {/* ── Header ──────────────────────────────────────────────── */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                     <h2 className="text-2xl font-bold text-slate-900">Products</h2>
//                     <p className="text-slate-500 text-sm">Manage your product catalog and inventory levels</p>
//                 </div>

//                 {/* Action buttons */}
//                 <div className="flex items-center gap-2 flex-wrap">
//                     {/* Import */}
//                     <input
//                         ref={importRef}
//                         type="file"
//                         accept=".xlsx,.xls"
//                         className="hidden"
//                         onChange={handleImportFile}
//                     />
//                     <button
//                         onClick={() => importRef.current?.click()}
//                         className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
//                         title="Import danh sách sản phẩm từ file Excel"
//                     >
//                         <Upload className="w-4 h-4 text-violet-500" />
//                         Import Excel
//                     </button>

//                     {/* Export */}
//                     <button
//                         onClick={handleExport}
//                         className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
//                         title="Xuất danh sách sản phẩm hiện tại ra file Excel"
//                     >
//                         <Download className="w-4 h-4 text-emerald-500" />
//                         Export Excel
//                     </button>

//                     {/* Add */}
//                     <button
//                         onClick={onAdd}
//                         className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 text-sm"
//                     >
//                         <Plus className="w-4 h-4" /> New Product
//                     </button>
//                 </div>
//             </div>

//             {/* ── Stats ───────────────────────────────────────────────── */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <StatCard icon={<PackageCheck className="w-6 h-6" />} color="blue" label="Total Items" value={products.length} />
//                 <StatCard icon={<TrendingUp className="w-6 h-6" />} color="emerald" label="Top Sellers" value={products.filter(p => p.totalSold > 100).length} />
//                 <StatCard icon={<Trash2 className="w-6 h-6" />} color="amber" label="Out of Stock" value={products.filter(isOos).length} />
//             </div>

//             {/* ── Search & Filter ──────────────────────────────────────── */}
//             <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
//                 <div className="relative flex-1 w-full">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
//                     <input
//                         type="text"
//                         placeholder="Search products by name..."
//                         value={searchTerm}
//                         onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
//                         className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                     />
//                 </div>
//                 <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-full md:w-auto">
//                     <Filter className="w-4 h-4 text-slate-500" />
//                     <select
//                         value={filterCategory}
//                         onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
//                         className="bg-transparent text-sm font-medium text-slate-600 outline-none"
//                     >
//                         <option value="All">All Categories</option>
//                         {categories.map(c => <option key={c} value={c}>{c}</option>)}
//                     </select>
//                 </div>

//                 {/* Số lượng đang hiển thị */}
//                 {(searchTerm || filterCategory !== 'All') && (
//                     <p className="text-xs text-slate-400 whitespace-nowrap">
//                         {filtered.length} / {products.length} sản phẩm
//                     </p>
//                 )}
//             </div>

//             {/* ── Table ───────────────────────────────────────────────── */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//                 <table className="w-full text-left">
//                     <thead className="bg-slate-50/80 border-b border-slate-100">
//                         <tr>
//                             {['Product', 'Status', 'Inventory', 'Price', 'Sales', ''].map((h, i) => (
//                                 <th key={i} className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === '' ? 'text-right' : ''}`}>
//                                     {h}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                         {paginated.length === 0 ? (
//                             <tr>
//                                 <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
//                                     Không tìm thấy sản phẩm nào.
//                                 </td>
//                             </tr>
//                         ) : paginated.map(product => {
//                             const stock = totalStock(product);
//                             const oos = isOos(product);
//                             return (
//                                 <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
//                                     <td className="px-6 py-5">
//                                         <div className="flex items-center gap-4">
//                                             <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
//                                                 {product.images?.[0]
//                                                     ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
//                                                     : <PackageCheck className="w-full h-full p-2.5 text-slate-300" />
//                                                 }
//                                             </div>
//                                             <div>
//                                                 <p className="font-semibold text-slate-900 leading-tight">{product.name}</p>
//                                                 <p className="text-xs text-slate-400 mt-0.5">
//                                                     {product.category?.name ?? 'Uncategorized'} · {product.brand?.name ?? 'No Brand'}
//                                                 </p>
//                                                 {product.slug && (
//                                                     <p className="text-[10px] text-slate-300 font-mono mt-0.5">/{product.slug}</p>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-5">
//                                         {product.active
//                                             ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
//                                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active
//                                             </span>
//                                             : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">Hidden</span>
//                                         }
//                                     </td>
//                                     <td className="px-6 py-5">
//                                         {(product.variants ?? []).length === 0 ? (
//                                             <span className="text-xs text-slate-400 italic">No variants</span>
//                                         ) : (
//                                             <div className="space-y-1.5">
//                                                 <div className="flex items-center justify-between text-xs font-medium">
//                                                     <span className="text-slate-500">Stock</span>
//                                                     <span className={oos || stock < 10 ? 'text-red-600 font-bold' : 'text-slate-900'}>
//                                                         {stock} units
//                                                     </span>
//                                                 </div>
//                                                 <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                                                     <div
//                                                         className={`h-full rounded-full ${oos || stock < 10 ? 'bg-red-500' : 'bg-blue-500'}`}
//                                                         style={{ width: `${Math.min(100, stock)}%` }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </td>
//                                     <td className="px-6 py-5">
//                                         <span className="font-bold text-slate-900">
//                                             ${(product.salePrice ?? product.basePrice).toLocaleString()}
//                                         </span>
//                                         {product.salePrice != null && product.salePrice < product.basePrice && (
//                                             <span className="block text-xs text-slate-400 line-through">
//                                                 ${product.basePrice.toLocaleString()}
//                                             </span>
//                                         )}
//                                     </td>
//                                     <td className="px-6 py-5 text-sm text-slate-600 font-medium">
//                                         {product.totalSold.toLocaleString()} sold
//                                     </td>
//                                     <td className="px-6 py-5 text-right">
//                                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                             <button onClick={() => onEdit(product)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Sửa">
//                                                 <Edit3 className="w-5 h-5" />
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDelete(product.id!)}
//                                                 disabled={deletingId === product.id}
//                                                 className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
//                                                 title="Xóa"
//                                             >
//                                                 <Trash2 className="w-5 h-5" />
//                                             </button>
//                                             <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all" title="Xem">
//                                                 <ExternalLink className="w-5 h-5" />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>

//                 {/* Pagination */}
//                 <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
//                     <p className="text-sm text-slate-500">
//                         Showing{' '}
//                         <span className="font-medium text-slate-900">
//                             {filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}
//                         </span>–
//                         <span className="font-medium text-slate-900">
//                             {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}
//                         </span>{' '}
//                         of <span className="font-medium text-slate-900">{filtered.length}</span> results
//                     </p>
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => setPage(p => Math.max(1, p - 1))}
//                             disabled={safePage === 1}
//                             className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                         >
//                             <ChevronLeft className="w-5 h-5" />
//                         </button>
//                         <span className="text-sm font-medium text-slate-700 px-2">{safePage} / {totalPages}</span>
//                         <button
//                             onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                             disabled={safePage === totalPages}
//                             className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                         >
//                             <ChevronRight className="w-5 h-5" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const colorMap: Record<string, string> = {
//     blue: 'bg-blue-50 text-blue-600',
//     emerald: 'bg-emerald-50 text-emerald-600',
//     amber: 'bg-amber-50 text-amber-600',
// };
// const StatCard: React.FC<{ icon: React.ReactNode; color: string; label: string; value: number }> = ({ icon, color, label, value }) => (
//     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
//         <div className={`p-3 rounded-xl ${colorMap[color] ?? ''}`}>{icon}</div>
//         <div>
//             <p className="text-sm text-slate-500 font-medium">{label}</p>
//             <p className="text-2xl font-bold text-slate-900">{value}</p>
//         </div>
//     </div>
// );

// export default ProductList;