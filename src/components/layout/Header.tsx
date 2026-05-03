"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, ShieldCheck, HeadphonesIcon } from "lucide-react";
import LOGO from "@/../public/assets/images/logo.png";
import Image from "next/image";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // افکت هدر هنگام اسکرول
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "خرید اشتراک پرمیوم اسپاتیفای", href: "/", icon: <ShieldCheck className="w-5 h-5" /> },
        { name: "قوانین و مقررات", href: "/terms", icon: <FileText className="w-5 h-5" /> },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-store-panel/95 backdrop-blur-md border-b border-store-border shadow-2xl"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* لوگو */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="rounded-full transition-all duration-300 shadow-lg shadow-[#1DB954]/20">
                            <Image src={LOGO} alt="Logo" className="w-14 h-14" />
                        </div>
                        <span className="text-xl font-bold text-store-text tracking-tight transition-colors group-hover:text-white">
                            فروشگاه Get Spotify
                        </span>
                    </Link>

                    {/* منوی دسکتاپ */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center gap-2 text-sm font-bold text-store-muted hover:text-store-text transition-all hover:-translate-y-0.5 duration-200 group"
                            >
                                {link.icon && (
                                    <span className="text-store-muted group-hover:text-[#1DB954] transition-colors group-hover:animate-bounce">
                                        {link.icon}
                                    </span>
                                )}
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* دکمه دسکتاپ با موشن چرخشی سبز و درخشان */}
                    <div className="hidden md:flex items-center">
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="https://t.me/getSpotify_Support"
                            target="_blank"
                            rel="noreferrer"
                            className="relative inline-flex overflow-hidden rounded-full p-[2px] shadow-lg shadow-[#1DB954]/30 group"
                        >
                            {/* لایه چرخان با رنگ اسپاتیفای و افکت درخشش */}
                            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1DB954_0%,transparent_50%,#1ed760_100%)] opacity-80 blur-[1px]" />
                            
                            {/* لایه رویی دکمه */}
                            <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-store-panel px-6 py-2.5 text-sm font-bold text-white backdrop-blur-3xl z-10 transition-colors group-hover:bg-store-panel/80">
                                <HeadphonesIcon className="w-4 h-4 text-[#1DB954]" />
                                ارتباط با پشتیبانی
                            </span>
                        </motion.a>
                    </div>

                    {/* دکمه همبرگری موبایل */}
                    <button
                        className="md:hidden p-2 text-store-muted hover:text-store-text transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* منوی موبایل */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-full left-0 right-0 border-b border-store-border bg-store-panel shadow-2xl"
                    >
                        <div className="px-4 py-6 flex flex-col gap-2">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-store-muted hover:bg-store-hover hover:text-store-text active:bg-store-border transition-all font-bold group"
                                    >
                                        {link.icon && (
                                            <span className="group-hover:text-[#1DB954] transition-colors">
                                                {link.icon}
                                            </span>
                                        )}
                                        <span>{link.name}</span>
                                    </Link>
                                </motion.div>
                            ))}
                            
                            {/* دکمه موبایل با موشن چرخشی */}
                            <motion.a
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                href="https://t.me/getSpotify_Support"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 relative flex overflow-hidden rounded-full p-[2px] shadow-lg shadow-[#1DB954]/30 active:scale-95 transition-transform duration-300 group"
                            >
                                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1DB954_0%,transparent_50%,#1ed760_100%)] opacity-80 blur-[1px]" />
                                <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-store-panel px-4 py-3.5 text-sm font-bold text-white backdrop-blur-3xl z-10 transition-colors group-hover:bg-store-panel/80">
                                    <HeadphonesIcon className="w-5 h-5 text-[#1DB954]" />
                                    ارتباط با پشتیبانی
                                </span>
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
