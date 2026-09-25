import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export function CartProvider({ children }) {

    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cafeCart");

            return savedCart
                ? JSON.parse(savedCart)
                : [];
        } catch (error) {
            console.error("Failed to load cart:", error);
            return [];
        }
    });


    // Validate saved cart against the current menu
    useEffect(() => {

        const validateCart = async () => {

            if (cart.length === 0) {
                return;
            }

            try {

                const response = await axios.get(
                    `${API_URL}/api/menu`
                );

                const menuItems = response.data?.items || [];

                const validCart = cart.filter((cartItem) => {

                    const menuItem = menuItems.find(
                        (item) => Number(item.id) === Number(cartItem.id)
                    );

                    return (
                        menuItem &&
                        Number(menuItem.is_available) === 1
                    );
                });

                if (validCart.length !== cart.length) {
                    setCart(validCart);
                }

            } catch (error) {

                console.error(
                    "Failed to validate cart:",
                    error
                );

            }
        };

        validateCart();

    }, []);


    // Save cart whenever it changes
    useEffect(() => {
        localStorage.setItem(
            "cafeCart",
            JSON.stringify(cart)
        );
    }, [cart]);


    const addToCart = (item) => {

        setCart((currentCart) => {

            const existingItem = currentCart.find(
                (cartItem) => cartItem.id === item.id
            );

            if (existingItem) {

                return currentCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? {
                            ...cartItem,
                            quantity:
                                cartItem.quantity + 1
                        }
                        : cartItem
                );
            }

            return [
                ...currentCart,
                {
                    ...item,
                    quantity: 1
                }
            ];
        });
    };


    const removeFromCart = (id) => {

        setCart((currentCart) =>
            currentCart.filter(
                (item) => item.id !== id
            )
        );
    };


    const increaseQuantity = (id) => {

        setCart((currentCart) =>
            currentCart.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity:
                            item.quantity + 1
                    }
                    : item
            )
        );
    };


    const decreaseQuantity = (id) => {

        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            quantity:
                                item.quantity - 1
                        }
                        : item
                )
                .filter(
                    (item) => item.quantity > 0
                )
        );
    };


    const clearCart = () => {
        setCart([]);
    };


    const totalItems = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );


    const totalPrice = cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            item.quantity,
        0
    );


    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                totalItems,
                totalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

