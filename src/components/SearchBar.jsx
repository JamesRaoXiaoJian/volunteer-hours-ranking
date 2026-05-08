import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
      <Search 
        size={18} 
        color="var(--text-muted)" 
        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
      />
      <input
        type="text"
        className="input"
        placeholder="搜索姓名或部门..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ paddingLeft: '2.5rem' }}
      />
    </div>
  );
}
