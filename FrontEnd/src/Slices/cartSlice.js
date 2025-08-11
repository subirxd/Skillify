import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    totalItems: localStorage.getItem("totalItems") 
    ? JSON.parse(localStorage.getItem("totalItems")) 
    : 0,


    cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],

    total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        addToCart(state, actions){

            // Extract the course object from the action's payload
            const course = actions.payload;

            // Check if the course is already in the cart
            const index = state.cart.findIndex((item) => item._id === course._id);

            // If the course is found (index is 0 or greater), it means it's already in the cart
            if(index >= 0){
                // Display an error toast notification to the user
                toast.error("Course already in your cart.");
                // Return immediately without modifying the state further
                return;
            }

            // If the course is not in the cart (index is -1), proceed to add it
            // Add the new course to the cart array
            state.cart.push(course);

            // Increment the total number of items in the cart
            state.totalItems+=1;

            // Add the price of the new course to the total price of all items in the cart
            state.total += course.price;

            // Update the cart data in local storage to persist it across sessions
            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("total", JSON.stringify(state.total)); // Update total price in local storage
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems)); // Update total items in local storage

            // Display a success toast notification to the user
            toast.success("Course added to cart successfully");

        },

        removeCart(state, actions){
            const courseToRemove = actions.payload; // Renamed for clarity

            // 1. Find the index of the course to ensure it exists
            const index = state.cart.findIndex((item) => item._id === courseToRemove._id);

            if (index >= 0) {

                state.totalItems--;
                state.total -= state.cart[index].price;
                state.cart.splice(index, 1);

                // Update the cart data in local storage to persist it across sessions
                localStorage.setItem("cart", JSON.stringify(state.cart));
                localStorage.setItem("total", JSON.stringify(state.total)); // Update total price in local storage
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems)); // Update total items in local storage

                 toast.success("Course removed from cart");
            } else {
                 toast.error("Course not found in cart");
            }
        },

        resetCart(state) {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;

            // Update to localstorage
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");
        },
    },
});

export const {addToCart, removeCart, resetCart} = cartSlice.actions;
export default cartSlice.reducer;