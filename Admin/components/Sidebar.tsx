
import React from 'react';
import {
    LayoutDashboard,
    Package,
    Layers,
    Tag,
    Users,
    ShoppingCart,
    Settings,
    LogOut,
    Sparkles
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'products', icon: Package, label: 'Products' },
        { id: 'categories', icon: Layers, label: 'Categories' },
        { id: 'brands', icon: Tag, label: 'Brands' },
        { id: 'orders', icon: ShoppingCart, label: 'Orders' },
        { id: 'users', icon: Users, label: 'Customers' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ShopAdmin
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
