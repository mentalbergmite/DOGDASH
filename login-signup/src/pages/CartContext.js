// CartContext.js

import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [addedItems, setAddedItems] = useState([]);

  const addToCart = (item) => {
    setAddedItems([...addedItems, item]);
  };

  return (
    <CartContext.Provider value={{ addedItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
