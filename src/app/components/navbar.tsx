import React from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-lg z-10"> 
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-teal-600">
            <a href="/" className="hover:text-teal-800">PTSD Detection</a>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-8">
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="text-teal-600 hover:text-teal-800">
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#features" className="text-teal-600 hover:text-teal-800">
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/how-it-works" className="text-teal-600 hover:text-teal-800">
                  How It Works
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className="text-teal-600 hover:text-teal-800">
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button */}
          <div>
            <a
              href="/sign-up"
              className="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition duration-200"
            >
              Sign Up
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
