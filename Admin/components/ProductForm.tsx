
import React, { useState, useEffect } from 'react';
import {
    X, Plus, Trash2, Wand2, Loader2, Save,
    Image as ImageIcon, Upload, ChevronRight, AlertCircle,
    // Fix: Added missing icon imports used in the JSX below
    Package, Layers, Tag
} from 'lucide-react';
import { Product, Category, Brand, ProductVariant, Gender } from '../typesAdmin';
import { generateProductDescription, generateSlug } from '../services/geminiService';

interface ProductFormProps {
    product?: Product;
    categories: Category[];
    brands: Brand[];
    onSave: (product: Product) => void;
    onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
    product, categories, brands, onSave, onClose
}) => {
    const [formData, setFormData] = useState<Product>(product || {
        name: '',
        description: '',
        basePrice: 0,
        salePrice: 0,
        totalSold: 0,
        category: null,
        brand: null,
        images: [],
        slug: '',
        active: true,
        gender: Gender.UNISEX,
        material: '',
        soleType: '',
        origin: '',
        variants: []
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');

    const handleAiDescription = async () => {
        if (!formData.name) return;
        setIsGenerating(true);
        const desc = await generateProductDescription(formData.name, formData.category?.name || 'General');
        const slug = await generateSlug(formData.name);
        setFormData(prev => ({ ...prev, description: desc, slug }));
        setIsGenerating(false);
    };

    const addVariant = () => {
        const newVariant: ProductVariant = {
            size: 40,
            color: 'Black',
            stock: 10,
            price: formData.basePrice
        };
        setFormData(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
    };

    const removeVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const addImage = () => {
        if (newImageUrl && !formData.images.includes(newImageUrl)) {
            setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl] }));
            setNewImageUrl('');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-end">
            <div className="bg-white w-full max-w-4xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
                        <p className="text-slate-500 text-sm">Fill in the details for your store catalog</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-600" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Nike Air Max 2024"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-sm"
                                        placeholder="nike-air-max-2024"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-sm font-medium text-slate-700">Description</label>
                                    <button
                                        onClick={handleAiDescription}
                                        disabled={isGenerating || !formData.name}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                        Generate with AI
                                    </button>
                                </div>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Describe your product features and benefits..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Classification & Specs */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Layers className="w-5 h-5 text-indigo-600" />
                            Category & Specifications
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                                    value={formData.category?.id || ''}
                                    onChange={e => setFormData({ ...formData, category: categories.find(c => c.id === Number(e.target.value)) || null })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                                    value={formData.brand?.id || ''}
                                    onChange={e => setFormData({ ...formData, brand: brands.find(b => b.id === Number(e.target.value)) || null })}
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value={Gender.UNISEX}>Unisex</option>
                                    <option value={Gender.MEN}>Men</option>
                                    <option value={Gender.WOMEN}>Women</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Origin</label>
                                <input
                                    type="text"
                                    value={formData.origin}
                                    onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                                    placeholder="e.g. Vietnam"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                            <Tag className="w-5 h-5 text-emerald-600" />
                            Pricing
                        </h3>
                        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Base Price ($)</label>
                                <input
                                    type="number"
                                    value={formData.basePrice}
                                    onChange={e => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price ($)</label>
                                <input
                                    type="number"
                                    value={formData.salePrice}
                                    onChange={e => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Variants Management */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Plus className="w-5 h-5 text-orange-600" />
                                Inventory & Variants
                            </h3>
                            <button
                                onClick={addVariant}
                                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Variant
                            </button>
                        </div>

                        <div className="overflow-hidden border border-slate-200 rounded-xl">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Size</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Color</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Stock</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Price Override</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {formData.variants.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                                                No variants added. Click "Add Variant" to manage inventory levels.
                                            </td>
                                        </tr>
                                    ) : (
                                        formData.variants.map((v, idx) => (
                                            <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number" value={v.size}
                                                        onChange={e => {
                                                            const vCopy = [...formData.variants];
                                                            vCopy[idx].size = Number(e.target.value);
                                                            setFormData({ ...formData, variants: vCopy });
                                                        }}
                                                        className="w-20 px-2 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text" value={v.color}
                                                        onChange={e => {
                                                            const vCopy = [...formData.variants];
                                                            vCopy[idx].color = e.target.value;
                                                            setFormData({ ...formData, variants: vCopy });
                                                        }}
                                                        className="w-32 px-2 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number" value={v.stock}
                                                        onChange={e => {
                                                            const vCopy = [...formData.variants];
                                                            vCopy[idx].stock = Number(e.target.value);
                                                            setFormData({ ...formData, variants: vCopy });
                                                        }}
                                                        className="w-24 px-2 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number" value={v.price}
                                                        onChange={e => {
                                                            const vCopy = [...formData.variants];
                                                            vCopy[idx].price = Number(e.target.value);
                                                            setFormData({ ...formData, variants: vCopy });
                                                        }}
                                                        className="w-28 px-2 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => removeVariant(idx)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Image Gallery */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-purple-600" />
                            Image Gallery
                        </h3>
                        <div className="flex gap-4 mb-4">
                            <input
                                type="text"
                                value={newImageUrl}
                                onChange={e => setNewImageUrl(e.target.value)}
                                placeholder="Paste image URL here..."
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                            <button
                                onClick={addImage}
                                className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <div className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                                <Upload className="w-6 h-6 mb-2" />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Upload</span>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-white sticky bottom-0">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Active Listing</span>
                        </label>
                        {!formData.name && (
                            <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Product name required
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!formData.name}
                            onClick={() => onSave(formData)}
                            className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {product ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ProductForm;
