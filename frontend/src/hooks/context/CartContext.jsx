"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);
const STORAGE_PREFIX = "novacart_cart_"; // + user.id لكل مستخدم سلة منفصلة

const initialState = {
  items: [], // { id, name, price, image, category, quantity }
};

function cartReducer(state, action) {
  switch (action.type) {
    case "HYDRATE": {
      return action.payload || initialState;
    }

    case "ADD_ITEM": {
      const product = action.payload.product;
      const quantity = action.payload.quantity ?? 1;

      if (product.inStock === false) {
        return state; // لا تسمح بإضافة منتج غير متوفر
      }

      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice ?? null,
            image: product.image,
            category: product.category,
            quantity,
          },
        ],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case "CLEAR_CART": {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const storageKey = user ? `${STORAGE_PREFIX}${user.id}` : null;

  // كل ما تتغير حالة تسجيل الدخول (دخول/خروج/تبديل مستخدم):
  // - لو في مستخدم: نحمّل سلته الخاصة من localStorage (أو سلة فاضية لو أول مرة)
  // - لو ما في مستخدم (خرج تسجيل الدخول أو لسا ما سجل): نفضي السلة من الذاكرة
  useEffect(() => {
    if (authLoading) return; // ننتظر لحد ما نعرف حالة تسجيل الدخول الفعلية

    if (!user) {
      dispatch({ type: "HYDRATE", payload: initialState });
      return;
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${user.id}`);
      dispatch({
        type: "HYDRATE",
        payload: stored ? JSON.parse(stored) : initialState,
      });
    } catch {
      dispatch({ type: "HYDRATE", payload: initialState });
    }
  }, [user, authLoading]);

  // حفظ السلة بـ localStorage كل ما تتغير — بس لو في مستخدم مسجل دخول
  useEffect(() => {
    if (!storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // تجاهل أخطاء التخزين (مثلاً وضع التصفح الخاص)
    }
  }, [state, storageKey]);

  const addItem = (product, quantity = 1) => {
    if (!user) return; // ما نسمح بالإضافة قبل تسجيل الدخول
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  };

  const removeItem = (id) =>
    dispatch({ type: "REMOVE_ITEM", payload: { id } });

  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const value = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart لازم تستخدمها داخل CartProvider");
  }
  return context;
}