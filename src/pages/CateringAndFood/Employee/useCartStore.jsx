
import create from "zustand";

const useCartStore = create((set) => ({
  cart: {},
  addToCart: (item, handleAlert) => set((state) => {
    const currentCount = state.cart[item._id]?.count || 0;


    if (currentCount >= item.maxQuantity) {
      handleAlert(
        true,
        "warning",
        `You can only add up to ${item.maxQuantity} of this item.`
      );
      return state;
    }

    return {
      cart: {
        ...state.cart,
        [item._id]: {
          count: currentCount + 1,
          price: item.price,
          image: item.image,
          id: item._id,
          name: item.name,
        },
      },
    };
  }),
  increment1: (itemId, maxQuantity, handleAlert) => set((state) => {
    const currentItem = state.cart[itemId];
    const currentCount = currentItem?.count || 0;
    console.log("currentItem", currentItem);
    if (currentCount >= maxQuantity) {
      handleAlert(
        true,
        "warning",
        `You cannot add more than ${maxQuantity} of this item.`
      );
      return state;
    }

    return {
      cart: {
        ...state.cart,
        [itemId]: {
          ...currentItem,
          count: currentCount + 1,
        },
      },
    };
  }),
  increment: (item, maxQuantity, handleAlert) => set((state) => {
    const currentItem = state.cart[item._id];
    const currentCount = currentItem?.count || 0;
  
    if (currentCount >= maxQuantity) {
      handleAlert(
        true,
        "warning",
        `You cannot add more than ${maxQuantity} of this item.`
      );
      return state;
    }
  
    return {
      cart: {
        ...state.cart,
        [item._id]: {
          ...currentItem,
          count: currentCount + 1,
          price: item.price,
          image: item.image,
          id: item._id,
          name: item.name,
        },
      },
    };
  }),
  
  decrement: (itemId) => set((state) => {
    const currentItem = state.cart[itemId];
    if (!currentItem) return state;

    const updatedCount = Math.max(currentItem.count - 1, 0);
    const newCart = { ...state.cart };

    if (updatedCount === 0) {
      delete newCart[itemId]; // Remove item when count is 0
    } else {
      newCart[itemId] = {
        ...currentItem,
        count: updatedCount,
      };
    }

    return { cart: newCart };
  }),

  clearCart: () => set({ cart: {} }),
  removeFromCart: (itemId) => set((state) => {
    const newCart = { ...state.cart };
    delete newCart[itemId];
    return { cart: newCart };
  }),
}));

export default useCartStore;