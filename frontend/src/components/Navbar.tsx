import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-white text-2xl font-bold">🍽️ Viandas</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/admin/recetas"
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
            >
              Recetas
            </Link>
            <Link
              to="/admin/ingredientes"
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
            >
              Ingredientes
            </Link>
            <Link
              to="/menus"
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
            >
              Menús
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/admin/recetas"
              className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Recetas
            </Link>
            <Link
              to="/admin/ingredientes"
              className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Ingredientes
            </Link>
            <Link
              to="/menus"
              className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Menús
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
