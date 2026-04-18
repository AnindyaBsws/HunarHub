import { useState } from "react";

function CategorySelect({ categories, selected, setSelected, multiple = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (cat) => {
    if (multiple) {
      if (selected.find((s) => s.id === cat.id)) {
        setSelected(selected.filter((s) => s.id !== cat.id));
      } else {
        setSelected([...selected, cat]);
      }
    } else {
      setSelected(cat);
      setOpen(false);
    }
  };

  return (
    <div className="relative">

      {/* Input */}
      <div
        onClick={() => setOpen(!open)}
        className="px-3 py-2 bg-white/10 border border-white/20 rounded cursor-pointer"
      >
        {multiple
          ? selected.length > 0
            ? selected.map((s) => s.name).join(", ")
            : "Select categories"
          : selected
          ? selected.name
          : "Select category"}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute w-full bg-black border border-white/20 rounded mt-1 z-50 max-h-60 overflow-y-auto">

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-black border-b border-white/20 outline-none"
          />

          {filtered.length === 0 && (
            <div className="px-3 py-2 text-gray-400">
              No category found
            </div>
          )}

          {filtered.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className="px-3 py-2 hover:bg-white/10 cursor-pointer"
            >
              {cat.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategorySelect;