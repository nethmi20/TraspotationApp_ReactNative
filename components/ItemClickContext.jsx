import React, { createContext, useState } from 'react';

export const ClickContext = createContext();

export const ClickProvider = ({ children }) => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <ClickContext.Provider value={{ clickCount, setClickCount }}>
      {children}
    </ClickContext.Provider>
  );
};
