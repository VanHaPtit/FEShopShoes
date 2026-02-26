
import React from 'react';
import { User as UserIcon, Shield, Mail, Phone, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { User } from '../typesAdmin';

interface UserManagerProps {
    users: User[];
    onToggleStatus: (id: number) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ users, onToggleStatus }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Customers & Staff</h2>
                    <p className="text-slate-500">Manage user accounts and access permissions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6 group hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-blue-500">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                    {user.imageAvt ? (
                                        <img src={user.imageAvt} alt={user.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500">
                                            <UserIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 leading-none">{user.fullName}</h3>
                                    <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                                        {user.roles.map(r => r.name).join(', ')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => user.id && onToggleStatus(user.id)}
                                className={`p-2 rounded-xl transition-colors ${user.enabled ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}
                            >
                                {user.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                            </button>
                        </div>

                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone className="w-4 h-4" />
                                {user.phone}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Calendar className="w-4 h-4" />
                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className={`text-xs font-black uppercase tracking-widest ${user.enabled ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {user.enabled ? 'Account Active' : 'Account Disabled'}
                            </span>
                            <button className="text-xs font-bold text-blue-600 hover:underline">View History</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManager;
