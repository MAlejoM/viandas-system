import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const cards = [
    {
      icon: '🍳',
      title: 'Recetas',
      desc: 'Gestiona todas tus recetas, ingredientes y detalles nutricionales',
      link: '/admin/recetas',
      color: 'bg-primary-50 text-primary-700',
      badge: null,
    },
    {
      icon: '🥕',
      title: 'Ingredientes',
      desc: 'Administra tu inventario de ingredientes y categorías',
      link: '/admin/ingredientes',
      color: 'bg-green-50 text-green-700',
      badge: null,
    },
    {
      icon: '👥',
      title: 'Clientes',
      desc: 'Registrá y gestioná tu cartera de clientes activos',
      link: '/admin/clientes',
      color: 'bg-teal-50 text-teal-700',
      badge: null,
    },
    {
      icon: '📅',
      title: 'Menús',
      desc: 'Crea y publica menús semanales para tus clientes',
      link: '/admin/menus',
      color: 'bg-emerald-50 text-emerald-700',
      badge: 'Próximamente',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <header className="text-center mb-16">
        <div className="text-5xl mb-4">🥗</div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Bienvenido,{' '}
          <span className="text-primary-600">{user?.nombre ?? 'Admin'}</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Tu panel de administración saludable. Gestiona ingredientes, recetas y clientes con facilidad.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.link}
            to={card.link}
            className="card group p-8 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className={`w-20 h-20 flex items-center justify-center text-4xl rounded-2xl mb-5 ${card.color} group-hover:scale-110 transition-transform shadow-inner`}
            >
              {card.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {card.title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
            {card.badge && (
              <span className="mt-3 inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {card.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
