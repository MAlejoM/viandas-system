import { EstadoCliente, Zona, TipoEntrega } from '../types';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const BadgeBase = ({ children, className }: BadgeProps) => (
  <span className={`px-2 py-1 text-xs font-bold rounded-full ${className}`}>
    {children}
  </span>
);

export const EstadoClienteBadge = ({ estado }: { estado: EstadoCliente }) => {
  const styles = estado === 'ACTIVO' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
  return <BadgeBase className={styles}>{estado}</BadgeBase>;
};

export const ZonaBadge = ({ zona }: { zona: Zona }) => {
  const styles = zona === 'SAN_LORENZO' 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-orange-100 text-orange-800';
  return <BadgeBase className={styles}>{zona.replace('_', ' ')}</BadgeBase>;
};

export const EntregaBadge = ({ tipo }: { tipo: TipoEntrega }) => {
  const styles = tipo === 'DOMICILIO' 
    ? 'bg-purple-100 text-purple-800' 
    : 'bg-indigo-100 text-indigo-800';
  return <BadgeBase className={styles}>{tipo}</BadgeBase>;
};
