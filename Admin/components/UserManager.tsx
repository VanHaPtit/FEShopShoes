// import React, { useState, useMemo } from 'react';
// import {
//     User as UserIcon, Shield, Mail, Phone, Calendar,
//     ToggleLeft, ToggleRight, Send, X, CheckSquare, Square, Loader2, Users
// } from 'lucide-react';
// import { User } from '../typesAdmin';
// import axios from 'axios';

// interface UserManagerProps {
//     users: User[];
//     onToggleStatus: (id: number) => void;
// }

// const UserManager: React.FC<UserManagerProps> = ({ users, onToggleStatus }) => {
//     // 1. State quản lý Modal và Form
//     const [isMailModalOpen, setIsMailModalOpen] = useState(false);
//     const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
//     const [mailForm, setMailForm] = useState({ subject: '', content: '' });
//     const [isSending, setIsSending] = useState(false);

//     // 2. Lọc danh sách chỉ những người có role USER
//     const customersOnly = useMemo(() =>
//         users.filter(u => u.roles.some(r => r.name === 'USER' || r.name === 'ROLE_USER')),
//         [users]);

//     // 3. Logic chọn/bỏ chọn người nhận trong Modal
//     const toggleRecipient = (id: number) => {
//         const next = new Set(selectedUserIds);
//         next.has(id) ? next.delete(id) : next.add(id);
//         setSelectedUserIds(next);
//     };

//     // 4. Hàm gửi email
//     const handleSendEmails = async () => {
//         if (selectedUserIds.size === 0) return;
//         setIsSending(true);

//         try {
//             // Lấy danh sách email từ các ID đã chọn
//             const selectedEmails = customersOnly
//                 .filter(u => u.id && selectedUserIds.has(u.id))
//                 .map(u => u.email);

//             // Gửi API cho từng người
//             const requests = selectedEmails.map(email =>
//                 axios.post('http://localhost:8080/api/v1/mail/send', {
//                     toEmail: email,
//                     subject: mailForm.subject,
//                     content: mailForm.content
//                 })
//             );

//             await Promise.all(requests);
//             alert(`Thành công! Đã gửi email đến ${selectedEmails.length} người dùng.`);

//             // Đóng modal và reset
//             setIsMailModalOpen(false);
//             setSelectedUserIds(new Set());
//             setMailForm({ subject: '', content: '' });
//         } catch (error) {
//             console.error("Mail Error:", error);
//             alert("Gửi email thất bại. Vui lòng thử lại!");
//         } finally {
//             setIsSending(false);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             {/* TOP BAR */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">User Manager</h2>
//                     <p className="text-sm text-slate-500 font-medium">Hệ thống đang có {users.length} thành viên</p>
//                 </div>

//                 {/* NÚT SEND EMAIL CHÍNH */}
//                 <button
//                     onClick={() => setIsMailModalOpen(true)}
//                     className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-100 active:scale-95"
//                 >
//                     <Send className="w-4 h-4" /> Send Email
//                 </button>
//             </div>

//             {/* DANH SÁCH USER (VIEW CHÍNH) */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {users.map((user) => (
//                     <div key={user.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5 hover:shadow-md transition-all">
//                         <div className="flex items-start justify-between">
//                             <div className="flex items-center gap-4">
//                                 <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border">
//                                     {user.imageAvt ? <img src={user.imageAvt} className="w-full h-full object-cover" /> : <UserIcon className="m-auto mt-2 text-slate-400" />}
//                                 </div>
//                                 <div>
//                                     <h3 className="font-bold text-slate-900 leading-none">{user.fullName}</h3>
//                                     <p className="text-[10px] font-black uppercase text-blue-500 mt-2">{user.roles.map(r => r.name).join(', ')}</p>
//                                 </div>
//                             </div>
//                             <button onClick={() => user.id && onToggleStatus(user.id)} className={`p-2 rounded-xl ${user.enabled ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
//                                 {user.enabled ? <ToggleRight /> : <ToggleLeft />}
//                             </button>
//                         </div>
//                         <div className="text-sm text-slate-500 space-y-1">
//                             <div className="flex items-center gap-2"><Mail size={14} /> {user.email}</div>
//                             <div className="flex items-center gap-2"><Phone size={14} /> {user.phone}</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* MODAL SOẠN THẢO VÀ CHỌN NGƯỜI NHẬN */}
//             {isMailModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                     <div className="bg-white w-full max-w-5xl h-[80vh] rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col sm:flex-row">

//                         {/* CỘT TRÁI: DANH SÁCH USER ĐỂ CHỌN */}
//                         <div className="w-full sm:w-1/3 border-r border-slate-100 flex flex-col bg-slate-50">
//                             <div className="p-6 border-b bg-white">
//                                 <h4 className="font-black italic uppercase text-sm tracking-tighter">Chọn người nhận</h4>
//                                 {/* <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Chỉ hiển thị Role: USER ({customersOnly.length})</p> */}
//                             </div>
//                             <div className="flex-grow overflow-y-auto p-4 space-y-2">
//                                 {customersOnly.map(u => (
//                                     <div
//                                         key={u.id}
//                                         onClick={() => u.id && toggleRecipient(u.id)}
//                                         className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border-2
//                                             ${selectedUserIds.has(u.id as number) ? 'bg-blue-50 border-blue-200' : 'bg-white border-transparent hover:border-slate-200'}`}
//                                     >
//                                         <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all
//                                             ${selectedUserIds.has(u.id as number) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
//                                             {selectedUserIds.has(u.id as number) && <CheckSquare size={12} />}
//                                         </div>
//                                         <div className="min-w-0">
//                                             <p className="text-sm font-bold text-slate-800 truncate">{u.fullName}</p>
//                                             <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="p-4 bg-white border-t text-center">
//                                 <button
//                                     onClick={() => setSelectedUserIds(selectedUserIds.size === customersOnly.length ? new Set() : new Set(customersOnly.map(u => u.id as number)))}
//                                     className="text-[10px] font-black uppercase text-blue-600 hover:underline"
//                                 >
//                                     {selectedUserIds.size === customersOnly.length ? "Bỏ chọn tất cả" : "Chọn tất cả người dùng"}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* CỘT PHẢI: FORM SOẠN THƯ */}
//                         <div className="flex-grow flex flex-col bg-white">
//                             <div className="p-6 border-b flex justify-between items-center">
//                                 <div>
//                                     <h4 className="font-black italic uppercase text-sm tracking-tighter text-slate-900">Nội dung thư muốn gửi</h4>
//                                     <p className="text-[10px] text-blue-500 font-bold uppercase mt-1">Đã chọn: {selectedUserIds.size} người nhận</p>
//                                 </div>
//                                 <button onClick={() => setIsMailModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
//                             </div>

//                             <div className="p-8 space-y-6 flex-grow overflow-y-auto">
//                                 <div className="space-y-2">
//                                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tiêu đề email</label>
//                                     <input
//                                         type="text"
//                                         value={mailForm.subject}
//                                         onChange={e => setMailForm({ ...mailForm, subject: e.target.value })}
//                                         placeholder="Nhập tiêu đề thư..."
//                                         className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold transition-all"
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lời nhắn gửi đến khách hàng</label>
//                                     <textarea
//                                         rows={8}
//                                         value={mailForm.content}
//                                         onChange={e => setMailForm({ ...mailForm, content: e.target.value })}
//                                         placeholder="Chào bạn, chúng tôi có thông báo mới về đơn hàng của bạn..."
//                                         className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-medium text-slate-600 resize-none transition-all"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
//                                 <button onClick={() => setIsMailModalOpen(false)} className="text-xs font-bold text-slate-400 uppercase">Hủy</button>
//                                 <button
//                                     onClick={handleSendEmails}
//                                     disabled={isSending || selectedUserIds.size === 0 || !mailForm.subject || !mailForm.content}
//                                     className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 disabled:bg-slate-200 transition-all active:scale-95"
//                                 >
//                                     {isSending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
//                                     {isSending ? "Đang gửi..." : `Gửi thư (${selectedUserIds.size})`}
//                                 </button>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserManager;



import axiosClient from "../../api/axiosClient";
import React, { useState, useMemo } from 'react';
import {
    User as UserIcon, Mail, Phone,
    ToggleLeft, ToggleRight, Send, X, CheckSquare,
    Loader2, Filter, RefreshCcw
} from 'lucide-react';
import { User } from '../typesAdmin';
import axios from 'axios';

interface UserManagerProps {
    users: User[];
    onToggleStatus: (id: number) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ users, onToggleStatus }) => {
    // ── State: Modal & Email Form ──────────────────────────────────────────────
    const [isMailModalOpen, setIsMailModalOpen] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
    const [mailForm, setMailForm] = useState({ subject: '', content: '' });
    const [isSending, setIsSending] = useState(false);
    const [sendResult, setSendResult] = useState<{ success: number; failed: number } | null>(null);

    // ── State: Filter ──────────────────────────────────────────────────────────
    const [minPaidCount, setMinPaidCount] = useState<number>(1);
    const [isFiltering, setIsFiltering] = useState(false);
    const [qualifiedUserIds, setQualifiedUserIds] = useState<Set<number> | null>(null);

    // ── Derived data ───────────────────────────────────────────────────────────
    const customersOnly = useMemo(() =>
        users.filter(u => u.roles.some(r => r.name === 'USER' || r.name === 'ROLE_USER')),
        [users]
    );

    const displayedUsers = useMemo(() => {
        if (qualifiedUserIds === null) return customersOnly;
        return customersOnly.filter(u => u.id && qualifiedUserIds.has(u.id));
    }, [customersOnly, qualifiedUserIds]);

    // ── Helpers ────────────────────────────────────────────────────────────────
    const getToken = () => localStorage.getItem('token');

    const openModal = () => {
        setSendResult(null);
        setSelectedUserIds(new Set());
        setMailForm({ subject: '', content: '' });
        setQualifiedUserIds(null);
        setMinPaidCount(1);
        setIsMailModalOpen(true);
    };

    const closeModal = () => setIsMailModalOpen(false);

    // ── Filter handler ─────────────────────────────────────────────────────────
    const handleFilterUsers = async () => {
        setIsFiltering(true);

        try {
            const response = await axiosClient.post(
                "/orders/check-condition",
                { minPaidCount }
            );

            const ids = new Set<number>(
                response.data.map((item: any) => item.userId)
            );

            setQualifiedUserIds(ids);
            setSelectedUserIds(new Set());

        } catch (error) {
            console.error("Lỗi khi lọc user:", error);
            alert("Lọc dữ liệu thất bại!");
        } finally {
            setIsFiltering(false);
        }
    };

    const handleClearFilter = () => {
        setQualifiedUserIds(null);
        setSelectedUserIds(new Set());
        setMinPaidCount(1);
    };

    // ── Selection handlers ─────────────────────────────────────────────────────
    const toggleRecipient = (id: number) => {
        setSelectedUserIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleSelectAll = () => {
        if (selectedUserIds.size === displayedUsers.length && displayedUsers.length > 0) {
            setSelectedUserIds(new Set());
        } else {
            setSelectedUserIds(new Set(new Set(displayedUsers
                .filter(u => u.id !== undefined)
                .map(u => u.id as number)
            )));
        }
    };

    const allSelected = displayedUsers.length > 0 && selectedUserIds.size === displayedUsers.length;

    // ── Send email handler ─────────────────────────────────────────────────────
    const handleSendEmails = async () => {
        if (
            selectedUserIds.size === 0 ||
            !mailForm.subject.trim() ||
            !mailForm.content.trim()
        ) return;

        setIsSending(true);
        setSendResult(null);

        try {
            const selectedEmails = customersOnly
                .filter(u => u.id && selectedUserIds.has(u.id))
                .map(u => u.email);

            const results = await Promise.allSettled(
                selectedEmails.map(email =>
                    axiosClient.post("/mail/send", {
                        toEmail: email,
                        subject: mailForm.subject,
                        content: mailForm.content
                    })
                )
            );

            const success = results.filter(r => r.status === "fulfilled").length;
            const failed = results.filter(r => r.status === "rejected").length;

            setSendResult({ success, failed });

            if (failed === 0) {
                setTimeout(() => {
                    setMailForm({ subject: "", content: "" });
                    setSelectedUserIds(new Set());
                    setSendResult(null);
                }, 1500);
            }

        } catch (error) {
            console.error("Send mail error:", error);
            alert("Gửi email thất bại!");
        } finally {
            setIsSending(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* TOP BAR */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
                        User Manager
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                        Hệ thống đang có {users.length} thành viên
                    </p>
                </div>

                <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Send className="w-4 h-4" /> Send Email
                </button>
            </div>

            {/* USER CARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border flex items-center justify-center">
                                    {user.imageAvt
                                        ? <img src={user.imageAvt} className="w-full h-full object-cover" alt="avatar" />
                                        : <UserIcon className="text-slate-400" size={22} />
                                    }
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 leading-none">{user.fullName}</h3>
                                    <p className="text-[10px] font-black uppercase text-blue-500 mt-2">
                                        {user.roles.map(r => r.name).join(', ')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => user.id && onToggleStatus(user.id)}
                                className={`p-2 rounded-xl transition-colors ${user.enabled
                                    ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                                    }`}
                                title={user.enabled ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            >
                                {user.enabled ? <ToggleRight /> : <ToggleLeft />}
                            </button>
                        </div>

                        <div className="text-sm text-slate-500 space-y-1">
                            <div className="flex items-center gap-2">
                                <Mail size={14} />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} />
                                <span>{user.phone}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* EMAIL MODAL */}
            {isMailModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col sm:flex-row">

                        {/* ── CỘT TRÁI: Bộ lọc & Danh sách người nhận ── */}
                        <div className="w-full sm:w-1/3 border-r border-slate-100 flex flex-col bg-slate-50">

                            {/* Header bộ lọc */}
                            <div className="p-5 border-b bg-white space-y-4 flex-shrink-0">
                                <h4 className="font-black italic uppercase text-sm tracking-tighter text-slate-900">
                                    Bộ lọc đối tượng
                                </h4>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">
                                        Số đơn (PAID) tối thiểu
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={minPaidCount}
                                            onChange={(e) => setMinPaidCount(Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-bold focus:border-blue-400 transition-colors"
                                        />
                                        <button
                                            onClick={handleFilterUsers}
                                            disabled={isFiltering}
                                            title="Áp dụng bộ lọc"
                                            className="bg-slate-900 text-white px-4 rounded-xl flex items-center justify-center hover:bg-slate-700 disabled:bg-slate-300 transition-colors"
                                        >
                                            {isFiltering
                                                ? <Loader2 size={16} className="animate-spin" />
                                                : <Filter size={16} />
                                            }
                                        </button>
                                    </div>
                                </div>

                                {qualifiedUserIds !== null && (
                                    <div className="flex items-center justify-between bg-blue-50 p-2 rounded-xl border border-blue-100">
                                        <span className="text-xs font-bold text-blue-600">
                                            Tìm thấy {displayedUsers.length} người
                                        </span>
                                        <button
                                            onClick={handleClearFilter}
                                            className="text-[10px] text-blue-500 hover:text-blue-700 flex items-center gap-1 font-bold uppercase transition-colors"
                                        >
                                            <RefreshCcw size={10} /> Bỏ lọc
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Danh sách user */}
                            <div className="flex-grow overflow-y-auto p-4 space-y-2">
                                {displayedUsers.length === 0 ? (
                                    <div className="text-center text-sm text-slate-400 font-medium py-10">
                                        Không tìm thấy người dùng nào
                                    </div>
                                ) : (
                                    displayedUsers.map(u => {
                                        const isSelected = selectedUserIds.has(u.id as number);
                                        return (
                                            <div
                                                key={u.id}
                                                onClick={() => u.id && toggleRecipient(u.id)}
                                                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border-2 select-none
                                                    ${isSelected
                                                        ? 'bg-blue-50 border-blue-200'
                                                        : 'bg-white border-transparent hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                                                    ${isSelected
                                                        ? 'bg-blue-600 border-blue-600 text-white'
                                                        : 'border-slate-300 bg-white'
                                                    }`}
                                                >
                                                    {isSelected && <CheckSquare size={12} />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate">{u.fullName}</p>
                                                    <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Chọn tất cả */}
                            <div className="p-4 bg-white border-t text-center flex-shrink-0">
                                <button
                                    onClick={handleSelectAll}
                                    disabled={displayedUsers.length === 0}
                                    className="text-[10px] font-black uppercase text-blue-600 hover:underline disabled:opacity-40 transition-opacity"
                                >
                                    {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả danh sách trên'}
                                </button>
                            </div>
                        </div>

                        {/* ── CỘT PHẢI: Form soạn thư ── */}
                        <div className="flex-grow flex flex-col bg-white min-w-0">
                            {/* Header */}
                            <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
                                <div>
                                    <h4 className="font-black italic uppercase text-sm tracking-tighter text-slate-900">
                                        Nội dung thư muốn gửi
                                    </h4>
                                    <p className="text-[10px] text-blue-500 font-bold uppercase mt-1">
                                        Đã chọn: {selectedUserIds.size} người nhận
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                    title="Đóng"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Form body */}
                            <div className="p-8 space-y-6 flex-grow overflow-y-auto">
                                {/* Thông báo kết quả */}
                                {sendResult && (
                                    <div className={`p-4 rounded-2xl border font-bold text-sm ${sendResult.failed === 0
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-amber-50 border-amber-200 text-amber-700'
                                        }`}>
                                        {sendResult.failed === 0
                                            ? `✅ Đã gửi thành công ${sendResult.success} email!`
                                            : `⚠️ Thành công: ${sendResult.success} — Thất bại: ${sendResult.failed}`
                                        }
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        Tiêu đề email
                                    </label>
                                    <input
                                        type="text"
                                        value={mailForm.subject}
                                        onChange={e => setMailForm(f => ({ ...f, subject: e.target.value }))}
                                        placeholder="Nhập tiêu đề thư..."
                                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        Lời nhắn gửi đến khách hàng
                                    </label>
                                    <textarea
                                        rows={8}
                                        value={mailForm.content}
                                        onChange={e => setMailForm(f => ({ ...f, content: e.target.value }))}
                                        placeholder="Chào bạn, chúng tôi có thông báo mới về đơn hàng của bạn..."
                                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-medium text-slate-600 resize-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div className="p-6 bg-slate-50 border-t flex justify-end gap-4 flex-shrink-0">
                                <button
                                    onClick={closeModal}
                                    className="text-xs font-bold text-slate-400 uppercase hover:text-slate-600 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSendEmails}
                                    disabled={isSending || selectedUserIds.size === 0 || !mailForm.subject || !mailForm.content}
                                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all active:scale-95"
                                >
                                    {isSending
                                        ? <><Loader2 className="animate-spin" size={16} /> Đang gửi...</>
                                        : <><Send size={16} /> Gửi thư ({selectedUserIds.size})</>
                                    }
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;