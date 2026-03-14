import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#0A0A0A] py-12 mt-20">
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="text-xl font-bold tracking-wider text-white">
                        VESTO
                    </span>
                    <p className="text-white/40 text-sm text-center md:text-left">
                        AI-Powered Style Intelligence for the Modern Wardrobe.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                    <p className="text-white/40 text-sm">Contact Us</p>
                    <a
                        href="mailto:vesto.fashionstore@gmail.com"
                        className="text-white/80 hover:text-white hover:underline transition-colors text-sm font-medium"
                    >
                        vesto.fashionstore@gmail.com
                    </a>
                </div>
            </div>
            
            <div className="container mx-auto px-6 md:px-12 mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-white/30 text-xs">
                    © {new Date().getFullYear()} Vesto. All rights reserved.
                </p>
                <div className="flex gap-4 text-white/30 text-xs">
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
