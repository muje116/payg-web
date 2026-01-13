import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../contexts/AuthContext";

export default function MainLayout({ children }) {
    const { logout } = useContext(AuthContext);

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden font-sans">
            {/* Sidebar background gradient and glass effect */}
            <div className="z-10 bg-gray-900 border-r border-gray-800 shadow-2xl relative">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar with glassmorphism */}
                <header className="h-16 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 z-20">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Dashboard Overview
                        </h2>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 rounded-lg text-sm font-medium transition-all duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Main interactive area with custom scrollbar */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
