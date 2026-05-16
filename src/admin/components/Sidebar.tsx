import React from 'react';
import {
    Package,
    Layers,
    Tag,
    ShoppingCart,
    Users,
    MessageSquare,
    BarChart3,
    Settings
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'products', icon: Package, label: 'Products' },
        { id: 'categories', icon: Layers, label: 'Categories' },
        { id: 'brands', icon: Tag, label: 'Brands' },
        { id: 'orders', icon: ShoppingCart, label: 'Orders' },
        { id: 'users', icon: Users, label: 'Customers' },
        { id: 'chat', icon: MessageSquare, label: 'Chat & AI' },
        { id: 'statistics', icon: BarChart3, label: 'Statistics' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E2E8F0] flex flex-col z-50">
            {/* Logo Section */}
            <div className="px-6 pt-8 pb-10">
                <h1 className="text-xl font-black text-[#2563EB] uppercase tracking-wide">
                    ADMIN CENTER
                </h1>
                <p className="text-[13px] text-gray-500 font-medium mt-1">
                    Product Management
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-3.5 text-sm font-bold transition-colors relative
                                        ${isActive 
                                            ? 'text-[#2563EB] bg-[#F8FAFC]' 
                                            : 'text-gray-600 hover:bg-[#F8FAFC]'}`}
                                >
                                    <item.icon 
                                        size={20} 
                                        className={isActive ? 'text-[#2563EB]' : 'text-gray-400'} 
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span>{item.label}</span>
                                    
                                    {/* Active Right Border */}
                                    {isActive && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#2563EB]"></div>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom User Profile */}
            <div className="p-6 mt-auto">
                <div className="flex items-center gap-3">
                    <img 
                        src="https://ui-avatars.com/api/?name=Admin+User&background=1e293b&color=fff" 
                        alt="Admin" 
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-sm font-bold text-[#0F172A]">Admin User</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Manager</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;