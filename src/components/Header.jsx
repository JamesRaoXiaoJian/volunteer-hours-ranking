import React from 'react';
import logo from '../figures/logo.jpg';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header style={{ marginBottom: '5rem', textAlign: 'center' }} className="header-root animate-fade-in">
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.6rem', 
        backgroundColor: 'rgba(59, 130, 246, 0.08)', 
        padding: '6px 16px', 
        borderRadius: '100px',
        color: 'var(--primary)',
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.08em',
        marginBottom: '2rem',
        border: '1px solid rgba(59, 130, 246, 0.1)'
      }}>
        <span style={{ fontSize: '1rem' }}>💡</span> SERVICE HONOR ROLL
      </div>
      
      <div className="header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
        <div className="header-logo" style={{
          background: 'white',
          padding: '12px',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(0,0,0,0.02)'
        }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ 
              height: '7.5rem', 
              width: 'auto', 
              borderRadius: '16px'
            }} 
          />
        </div>
        <div className="header-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
          <h1 style={{ 
            fontSize: '3.8rem', 
            fontWeight: '900', 
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: '1',
            margin: 0
          }}>
            教师服务时长榜单
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.2rem', 
            marginTop: '0.6rem', 
            fontWeight: '500',
            opacity: 0.7,
            margin: '0.6rem 0 0 0',
            letterSpacing: '0.02em'
          }}>
            聚合，配合，竞合，融合
          </p>
        </div>
      </div>
    </header>
  );
}
