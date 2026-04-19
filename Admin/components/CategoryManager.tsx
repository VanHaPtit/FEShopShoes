// import React, { useState, useRef } from 'react';
// import { Layers, Plus, Edit3, Trash2, X, Image as ImageIcon, Save, Upload } from 'lucide-react';
// import { Category } from '../typesAdmin';

// interface CategoryManagerProps {
//     categories: Category[];
//     // Sửa lại type để nhận FormData hoặc xử lý logic upload tại đây
//     onSave: (data: FormData) => void;
//     onDelete: (id: number) => void;
// }

// const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onSave, onDelete }) => {
//     const [isFormOpen, setIsFormOpen] = useState(false);
//     const [editingCat, setEditingCat] = useState<Category | null>(null);
//     const [name, setName] = useState('');
//     const [file, setFile] = useState<File | null>(null);
//     const [preview, setPreview] = useState<string | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const handleEdit = (cat: Category) => {
//         setEditingCat(cat);
//         setName(cat.name);
//         setPreview(cat.image || null); // Hiển thị ảnh cũ nếu có
//         setFile(null);
//         setIsFormOpen(true);
//     };

//     const handleAddNew = () => {
//         setEditingCat(null);
//         setName('');
//         setFile(null);
//         setPreview(null);
//         setIsFormOpen(true);
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFile = e.target.files?.[0];
//         if (selectedFile) {
//             setFile(selectedFile);
//             setPreview(URL.createObjectURL(selectedFile)); // Tạo preview tạm thời
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const formData = new FormData();

//         // Tạo object category để gửi dưới dạng JSON Blob (Khớp với @RequestPart của Spring Boot)
//         const categoryData = {
//             id: editingCat?.id || null,
//             name: name,
//         };

//         formData.append(
//             'category',
//             new Blob([JSON.stringify(categoryData)], { type: 'application/json' })
//         );

//         // Thêm file ảnh (Khớp với @RequestPart("file") của Spring Boot)
//         if (file) {
//             formData.append('file', file);
//         }

//         onSave(formData);
//         setIsFormOpen(false);
//         // Clean up URL preview để tránh rò rỉ bộ nhớ
//         if (preview && file) URL.revokeObjectURL(preview);
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
//                     {/* <p className="text-slate-500">Quản lý danh mục sản phẩm và hình ảnh đại diện</p> */}
//                 </div>
//                 <button
//                     onClick={handleAddNew}
//                     className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
//                 >
//                     <Plus className="w-5 h-5" /> Add Category
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {categories.map((cat) => (
//                     <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
//                         <div className="h-40 bg-slate-100 relative overflow-hidden">
//                             {cat.image ? (
//                                 <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
//                             ) : (
//                                 <div className="w-full h-full flex items-center justify-center text-slate-300">
//                                     <ImageIcon className="w-12 h-12" />
//                                 </div>
//                             )}
//                             <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
//                                 <button onClick={() => handleEdit(cat)} className="p-2 bg-white rounded-lg text-slate-700 hover:text-blue-600">
//                                     <Edit3 className="w-5 h-5" />
//                                 </button>
//                                 <button onClick={() => cat.id && onDelete(cat.id)} className="p-2 bg-white rounded-lg text-slate-700 hover:text-red-600">
//                                     <Trash2 className="w-5 h-5" />
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="p-4 flex items-center justify-between">
//                             <span className="font-bold text-slate-900">{cat.name}</span>
//                             <Layers className="w-4 h-4 text-slate-400" />
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {isFormOpen && (
//                 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
//                     <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-xl font-bold">{editingCat ? 'Edit Category' : 'New Category'}</h3>
//                             <button type="button" onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
//                                 <X className="w-6 h-6 text-slate-400" />
//                             </button>
//                         </div>

//                         <div className="space-y-4">
//                             {/* Input Tên Danh Mục */}
//                             <div>
//                                 <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
//                                 <input
//                                     type="text"
//                                     required
//                                     value={name}
//                                     onChange={e => setName(e.target.value)}
//                                     className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
//                                     placeholder="Ví dụ: Giày Chạy Bộ"
//                                 />
//                             </div>

//                             {/* Khu Vực Upload Ảnh */}
//                             <div>
//                                 <label className="block text-sm font-medium text-slate-700 mb-1">Category Image</label>
//                                 <div
//                                     onClick={() => fileInputRef.current?.click()}
//                                     className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-colors relative group"
//                                 >
//                                     {preview ? (
//                                         <div className="relative w-full h-32">
//                                             <img src={preview} alt="Preview" className="w-full h-full object-contain" />
//                                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
//                                                 <Upload className="text-white w-8 h-8" />
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-1 text-center">
//                                             <Upload className="mx-auto h-10 w-10 text-slate-400" />
//                                             <div className="flex text-sm text-slate-600">
//                                                 <span className="font-semibold text-blue-600">Click to upload image</span>
//                                             </div>
//                                             <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
//                                         </div>
//                                     )}
//                                     <input
//                                         ref={fileInputRef}
//                                         type="file"
//                                         className="hidden"
//                                         accept="image/*"
//                                         onChange={handleFileChange}
//                                         required={!editingCat} // Chỉ bắt buộc khi tạo mới
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="mt-8 flex gap-3">
//                             <button
//                                 type="button"
//                                 onClick={() => setIsFormOpen(false)}
//                                 className="flex-1 px-4 py-2 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
//                             >
//                                 <Save className="w-4 h-4" /> Save
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CategoryManager;










import React, { useState, useRef } from 'react';
import { Layers, Plus, Edit3, Trash2, X, Image as ImageIcon, Save, Upload, CheckCircle2 } from 'lucide-react';
import { Category } from '../typesAdmin';

interface CategoryManagerProps {
    categories: Category[];
    onSave: (data: FormData) => void;
    onDelete: (id: number) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onSave, onDelete }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEdit = (cat: Category) => {
        setEditingCat(cat);
        setName(cat.name);
        setPreview(cat.image || null);
        setFile(null);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingCat(null);
        setName('');
        setFile(null);
        setPreview(null);
        setIsFormOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        const categoryData = {
            id: editingCat?.id || null,
            name: name,
        };

        formData.append(
            'category',
            new Blob([JSON.stringify(categoryData)], { type: 'application/json' })
        );

        if (file) {
            formData.append('file', file);
        }

        onSave(formData);
        setIsFormOpen(false);
        if (preview && file) URL.revokeObjectURL(preview);
    };

    return (
        <div className="space-y-8 bg-slate-50/50 p-4 md:p-8 rounded-3xl min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Danh mục sản phẩm</h2>
                        <p className="text-sm text-slate-500 mt-1">Quản lý các phân loại hàng hóa của bạn</p>
                    </div>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5" />
                    <span>Thêm Mới</span>
                </button>
            </div>

            {/* Grid hiển thị Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                        {/* Image Area */}
                        <div className="h-48 bg-slate-50 relative overflow-hidden group">
                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100/50">
                                    <ImageIcon className="w-10 h-10 mb-2" />
                                    <span className="text-xs font-medium">Chưa có ảnh</span>
                                </div>
                            )}
                        </div>

                        {/* Info & Actions Area */}
                        <div className="p-5 border-t border-slate-50 flex flex-col flex-grow justify-between gap-4">
                            <h3 className="font-bold text-slate-800 text-lg line-clamp-1" title={cat.name}>
                                {cat.name}
                            </h3>

                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => handleEdit(cat)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" /> Sửa
                                </button>
                                <button
                                    onClick={() => cat.id && onDelete(cat.id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Nút thêm nhanh dạng thẻ */}
                <button
                    onClick={handleAddNew}
                    className="h-full min-h-[280px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-blue-600"
                >
                    <div className="p-4 bg-white rounded-full shadow-sm">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-semibold">Thêm danh mục mới</span>
                </button>
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800">
                                {editingCat ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                            </h3>
                            <button type="button" onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Input Tên Danh Mục */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Tên danh mục <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="VD: Giày Thể Thao, Áo Khoác..."
                                />
                            </div>

                            {/* Khu Vực Upload Ảnh */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh đại diện</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative mt-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 
                                        ${preview ? 'border-blue-200 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                                >
                                    {preview ? (
                                        <div className="relative w-full h-40 group">
                                            <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg backdrop-blur-sm">
                                                <div className="flex flex-col items-center text-white">
                                                    <Upload className="w-6 h-6 mb-1" />
                                                    <span className="text-sm font-medium">Đổi ảnh khác</span>
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 text-center">
                                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-semibold text-blue-600">Nhấn để tải ảnh lên</span>
                                                <span className="text-slate-500"> hoặc kéo thả vào đây</span>
                                            </div>
                                            <p className="text-xs text-slate-400">Hỗ trợ: PNG, JPG, GIF (Tối đa 10MB)</p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required={!editingCat}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-sm shadow-blue-500/30 flex items-center justify-center gap-2 transition-colors"
                            >
                                <Save className="w-4 h-4" /> Lưu lại
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;