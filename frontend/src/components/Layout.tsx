import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center py-4 mt-16">
        <p>&copy; 2026 Sistema de Viandas. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
