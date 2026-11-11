import { useCallback, useMemo, useState } from "react";
import { links } from "../data/site";
import { OrderContext, useOrder } from "./orderContext";

/**
 * Online ordering isn't live yet (links.orderOnline.ready === false), so
 * every "Order" button opens the phone-ordering sheet instead. Flip `ready`
 * in site.js and <OrderButton> becomes a plain external link everywhere.
 */
export function OrderProvider({ children }) {
  const [state, setState] = useState({ open: false, dish: null });
  const openOrder = useCallback((dish = null) => setState({ open: true, dish }), []);
  const closeOrder = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const value = useMemo(() => ({ ...state, openOrder, closeOrder }), [state, openOrder, closeOrder]);
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function OrderButton({ dish = null, className = "", children, ...rest }) {
  const { openOrder } = useOrder();
  if (links.orderOnline.ready) {
    return (
      <a href={links.orderOnline.href} target="_blank" rel="noreferrer" className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => openOrder(dish)} className={className} aria-haspopup="dialog" {...rest}>
      {children}
    </button>
  );
}
