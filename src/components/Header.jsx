import { Award, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header style={{ marginBottom: '3.5rem', textAlign: 'center' }} className="animate-fade-in">
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '0.75rem', 
        marginBottom: '1rem',
        padding: '0.4rem 1.2rem',
        background: 'var(--primary-light)',
        borderRadius: '100px',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <Award size={18} color="var(--primary)" />
        <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
          VOLUNTEER HONOR ROLL
        </span>
        <Sparkles size={14} color="var(--primary)" />
      </div>
      <h1 style={{ 
        fontSize: '3.5rem', 
        fontWeight: '800', 
        color: 'var(--text-primary)',
        marginBottom: '0.75rem',
        lineHeight: '1.1',
        letterSpacing: '-0.04em'
      }}>
        教师志愿时长榜单
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', fontWeight: '400', maxWidth: '600px', margin: '0 auto' }}>
        记录每一次微小的奉献，致敬教育路上的志愿之光
      </p>
    </header>
  );
}
