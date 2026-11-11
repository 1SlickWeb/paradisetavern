import { createContext, useContext } from "react";

export const OrderContext = createContext({ open: false, dish: null, openOrder: () => {}, closeOrder: () => {} });

export const useOrder = () => useContext(OrderContext);
