import { useState, useEffect } from "react";

export function useFavourites(key: string) {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setFavourites(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, [key]);

  const toggleFavourite = (id: string) => {
    setFavourites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  return { favourites, toggleFavourite };
}
