
import React, { useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    ExternalLink,
    Edit3,
    Trash2,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    PackageCheck
} from 'lucide-react';
import { Product } from '../typesAdmin';

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onAdd }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category?.name === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Products</h2>
                    <p className="text-slate-500">Manage your product catalog and inventory levels</p>
                </div>
                <button
                    onClick={onAdd}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 w-fit"
                >
                    <Plus className="w-5 h-5" /> New Product
                </button>
            </div>

            {/* Stats Mini Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                        <PackageCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Items</p>
                        <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Top Sellers</p>
                        <p className="text-2xl font-bold">{products.filter(p => p.totalSold > 100).length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 text-amber-600">
                    <div className="bg-amber-50 p-3 rounded-xl">
                        <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Out of Stock</p>
                        <p className="text-2xl font-bold">{products.filter(p => p.variants.every(v => v.stock === 0)).length}</p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-transparent text-sm font-medium text-slate-600 outline-none"
                        >
                            <option value="All">All Categories</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Apparel">Apparel</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sales</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <PackageCheck className="w-full h-full p-2.5 text-slate-300" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 leading-tight">{product.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{product.category?.name || 'Uncategorized'} • {product.brand?.name || 'No Brand'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    {product.active ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                                            Hidden
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-medium">
                                            <span className="text-slate-500">Stock Level</span>
                                            <span className={product.variants.reduce((acc, v) => acc + v.stock, 0) < 10 ? 'text-red-600' : 'text-slate-900'}>
                                                {product.variants.reduce((acc, v) => acc + v.stock, 0)} units
                                            </span>
                                        </div>
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${product.variants.reduce((acc, v) => acc + v.stock, 0) < 10 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                style={{ width: `${Math.min(100, product.variants.reduce((acc, v) => acc + v.stock, 0))}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">${product.salePrice || product.basePrice}</span>
                                        {product.salePrice && product.salePrice < product.basePrice && (
                                            <span className="text-xs text-slate-400 line-through">${product.basePrice}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                                    {product.totalSold.toLocaleString()} sold
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        >
                                            <Edit3 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(product.id!)}
                                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                                            <ExternalLink className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Mockup */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{filteredProducts.length}</span> of <span className="font-medium text-slate-900">{products.length}</span> results</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 cursor-not-allowed">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
