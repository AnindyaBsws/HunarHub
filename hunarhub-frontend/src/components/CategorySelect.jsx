import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CategorySelect({
  categories,
  selected,
  setSelected,
  multiple = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef();

  // ✅ CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const isSelected = (cat) => {
    return multiple
      ? selected.find((s) => s.id === cat.id)
      : selected?.id === cat.id;
  };

  return (
    <div ref={wrapperRef} className="relative w-full md:w-64">

      {/* TRIGGER */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-3 md:py-2 bg-white border border-gray-200 rounded-lg
                   cursor-pointer shadow-sm hover:border-gray-300 
                   flex justify-between items-center transition"
      >
        <span className="text-sm text-gray-700 truncate">
          {multiple
            ? selected.length > 0
              ? selected.map((s) => s.name).join(", ")
              : "Select categories"
            : selected
            ? selected.name
            : "Select category"}
        </span>

        <span className="text-gray-400 text-xs">▼</span>
      </div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 w-full mt-2 bg-white border border-gray-200 
                       rounded-xl shadow-xl z-50 overflow-hidden"
          >

            {/* SEARCH (STICKY) */}
            <div className="p-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-3 md:py-2 text-sm border border-gray-200 
                           rounded-md outline-none focus:ring-2 
                           focus:ring-amber-200"
              />
            </div>

            {/* OPTIONS */}
            <div className="max-h-64 overflow-y-auto">

              {filtered.length === 0 && (
                <div className="px-4 py-3 text-gray-400 text-sm">
                  No category found
                </div>
              )}

              {filtered.map((cat) => {
                const selectedItem = isSelected(cat);

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelect(cat)}
                    className={`flex items-center justify-between px-4 py-3 text-sm 
                                cursor-pointer transition
                      ${
                        selectedItem
                          ? "bg-amber-50 text-amber-700"
                          : "hover:bg-gray-100"
                      }`}
                  >
                    <span>{cat.name}</span>

                    {selectedItem && (
                      <span className="text-amber-600 text-sm">✔</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategorySelect;