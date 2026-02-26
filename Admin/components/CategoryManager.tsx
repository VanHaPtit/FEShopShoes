
import React, { useState } from 'react';
import { Layers, Plus, Edit3, Trash2, X, Image as ImageIcon, Save } from 'lucide-react';
import { Category } from '../typesAdmin';

interface CategoryManagerProps {
    categories: Category[];
    onSave: (cat: Category) => void;
    onDelete: (id: number) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onSave, onDelete }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<Category | null>(null);
    const [formData, setFormData] = useState<Category>({ name: '', image: '' });

    const handleEdit = (cat: Category) => {
        setEditingCat(cat);
        setFormData(cat);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingCat(null);
        setFormData({ name: '', image: '' });
        setIsFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editingCat ? { ...formData, id: editingCat.id } : formData);
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
                    <p className="text-slate-500">Organize your products into meaningful groups</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                        <div className="h-40 bg-slate-100 relative overflow-hidden">
                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button onClick={() => handleEdit(cat)} className="p-2 bg-white rounded-lg text-slate-700 hover:text-blue-600">
                                    <Edit3 className="w-5 h-5" />
                                </button>
                                <button onClick={() => cat.id && onDelete(cat.id)} className="p-2 bg-white rounded-lg text-slate-700 hover:text-red-600">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <span className="font-bold text-slate-900">{cat.name}</span>
                            <Layers className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                ))}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">{editingCat ? 'Edit Category' : 'New Category'}</h3>
                            <button type="button" onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex gap-3">
                            <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
