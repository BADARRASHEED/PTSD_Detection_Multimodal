import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-lg z-10">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-teal-600">
            <Link href="/" className="hover:text-teal-800">
              PTSD Detection
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
