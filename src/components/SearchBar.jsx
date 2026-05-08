import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search
        size={18}
        color="var(--text-muted)"
        className="search-bar-icon"
      />
      <input
        type="text"
        className="input search-bar-input"
        placeholder="搜索姓名或部门..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
