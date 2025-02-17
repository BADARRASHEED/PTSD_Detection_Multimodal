import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
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

          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-8">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className="text-teal-600 hover:text-teal-800"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/request-access"
                  className="text-teal-600 hover:text-teal-800"
                >
                  Request Access
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/contact"
                  className="text-teal-600 hover:text-teal-800"
                >
                  Contact Us
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button */}
          <Link
            href={"/login"}
            className="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition duration-200"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
