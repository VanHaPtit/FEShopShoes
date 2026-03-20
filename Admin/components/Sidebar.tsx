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
        // { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'products', icon: Package, label: 'Products' },
        { id: 'categories', icon: Layers, label: 'Categories' },
        { id: 'brands', icon: Tag, label: 'Brands' },
        { id: 'orders', icon: ShoppingCart, label: 'Orders' },
        { id: 'users', icon: Users, label: 'Customers' },
    ];

    return (
        <>
            {/* Google Font import – Outfit display + DM Sans body */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

                .sidebar-root {
                    font-family: 'DM Sans', sans-serif;
                }
                .sidebar-logo-text {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                }
                .sidebar-nav-label {
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 500;
                }

                /* Subtle animated gradient on logo icon */
                @keyframes shimmer {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .logo-gem {
                    background: linear-gradient(135deg, #6366f1, #3b82f6, #06b6d4, #6366f1);
                    background-size: 300% 300%;
                    animation: shimmer 4s ease infinite;
                }

                /* Active pill glow */
                .nav-active {
                    background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.12));
                    border: 1px solid rgba(99,102,241,0.25);
                    box-shadow: 0 0 16px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.06);
                }
                .nav-inactive:hover {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.06);
                }
                .nav-inactive {
                    border: 1px solid transparent;
                }

                /* Thin decorative left rail for active */
                .nav-active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 20%;
                    height: 60%;
                    width: 3px;
                    background: linear-gradient(to bottom, #818cf8, #38bdf8);
                    border-radius: 0 3px 3px 0;
                }

                /* Section label */
                .section-label {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(148,163,184,0.45);
                    padding: 0 16px;
                    margin-bottom: 4px;
                    margin-top: 4px;
                }

                /* Subtle horizontal rule */
                .sidebar-divider {
                    border: none;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent);
                    margin: 12px 16px;
                }

                /* Bottom user card */
                .user-card {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 14px;
                    padding: 12px 14px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 0 12px 16px;
                }
                .user-avatar {
                    width: 34px;
                    height: 34px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #6366f1, #38bdf8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Outfit', sans-serif;
                    font-weight: 700;
                    font-size: 13px;
                    color: white;
                    flex-shrink: 0;
                }
            `}</style>

            <aside
                className="sidebar-root fixed left-0 top-0 h-full w-[232px] flex flex-col z-50"
                style={{
                    background: 'linear-gradient(160deg, #0f1117 0%, #131720 60%, #0d1321 100%)',
                    borderRight: '1px solid rgba(255,255,255,0.07)',
                }}
            >
                {/* ── Logo ─────────────────────────────────────────── */}
                <div className="flex items-center gap-3 px-5 pt-6 pb-5">
                    <div className="logo-gem w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Sparkles className="w-[18px] h-[18px] text-white" />
                    </div>
                    <div>
                        <p className="sidebar-logo-text text-white text-[17px] leading-none">ShopAdmin</p>
                        <p style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', marginTop: 3, fontFamily: 'DM Sans, sans-serif' }}>
                            Management Console
                        </p>
                    </div>
                </div>

                <hr className="sidebar-divider" />

                {/* ── Nav ──────────────────────────────────────────── */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    <p className="section-label">Catalogue</p>

                    {menuItems.slice(0, 3).map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-[11px] transition-all duration-200 group
                                    ${isActive ? 'nav-active' : 'nav-inactive'}`}
                            >
                                <item.icon
                                    className="w-[17px] h-[17px] flex-shrink-0 transition-colors duration-200"
                                    style={{ color: isActive ? '#818cf8' : 'rgba(148,163,184,0.6)' }}
                                />
                                <span
                                    className="sidebar-nav-label text-[13.5px] transition-colors duration-200"
                                    style={{ color: isActive ? '#e2e8f0' : 'rgba(148,163,184,0.7)' }}
                                >
                                    {item.label}
                                </span>
                                {isActive && (
                                    <span style={{
                                        marginLeft: 'auto',
                                        width: 6, height: 6,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #818cf8, #38bdf8)',
                                        boxShadow: '0 0 8px rgba(129,140,248,0.7)',
                                        flexShrink: 0,
                                    }} />
                                )}
                            </button>
                        );
                    })}

                    <p className="section-label" style={{ marginTop: 16 }}>Operations</p>

                    {menuItems.slice(3).map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-[11px] transition-all duration-200 group
                                    ${isActive ? 'nav-active' : 'nav-inactive'}`}
                            >
                                <item.icon
                                    className="w-[17px] h-[17px] flex-shrink-0 transition-colors duration-200"
                                    style={{ color: isActive ? '#818cf8' : 'rgba(148,163,184,0.6)' }}
                                />
                                <span
                                    className="sidebar-nav-label text-[13.5px] transition-colors duration-200"
                                    style={{ color: isActive ? '#e2e8f0' : 'rgba(148,163,184,0.7)' }}
                                >
                                    {item.label}
                                </span>
                                {isActive && (
                                    <span style={{
                                        marginLeft: 'auto',
                                        width: 6, height: 6,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #818cf8, #38bdf8)',
                                        boxShadow: '0 0 8px rgba(129,140,248,0.7)',
                                        flexShrink: 0,
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* ── Bottom: user card (commented sign-out preserved) ─ */}
                <div>
                    <hr className="sidebar-divider" />
                    <div className="user-card">
                        <div className="user-avatar">A</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12.5, fontWeight: 600, color: '#cbd5e1', fontFamily: 'DM Sans', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Admin
                            </p>
                            <p style={{ fontSize: 10.5, color: 'rgba(148,163,184,0.45)', fontFamily: 'DM Sans', marginTop: 1 }}>
                                Administrator
                            </p>
                        </div>
                        {/* <button> <LogOut /> </button> */}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;