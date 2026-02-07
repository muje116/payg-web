import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../contexts/AuthContext";
import GlobalPlayer from "./GlobalPlayer";
import { motion } from "framer-motion";
import { Bell, LogOut, Menu } from "lucide-react";
import { usePlayer } from "../contexts/PlayerContext";

export default function MainLayout({ children }) {
    const { logout } = useContext(AuthContext);
    const { currentTrack, isExpanded } = usePlayer();

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden font-sans">
            {/* Sidebar background gradient and glass effect */}
            <div className="z-10 bg-gray-900 border-r border-gray-800 shadow-2xl relative hidden md:block">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top bar with glassmorphism */}
                <header className="h-16 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 z-20">
                    <div className="flex items-center space-x-4">
                        <button className="md:hidden text-gray-400 hover:text-white">
                             <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Dashboard Overview
                        </h2>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-400 hover:text-white transition-colors relative">
                            <Bell size={24} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900"></span>
                        </button>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 rounded-lg text-sm font-medium transition-all duration-300"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                {/* Main interactive area with custom scrollbar */}
                <main className={`flex-1 overflow-y-auto overflow-x-hidden p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat transition-all duration-300 ${currentTrack ? 'pb-24' : ''}`}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-7xl mx-auto space-y-8"
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Global Player */}
                <GlobalPlayer />
            </div>
        </div>
    );
}
