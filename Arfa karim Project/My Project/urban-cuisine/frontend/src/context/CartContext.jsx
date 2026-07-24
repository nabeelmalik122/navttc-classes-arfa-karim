import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((menuItem, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem === menuItem._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem === menuItem._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          menuItem: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((menuItemId) => {
    setItems((prev) => prev.filter((i) => i.menuItem !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId, quantity) => {
    if (quantity < 1) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItem === menuItemId ? { ...i, quantity } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
