import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartList: [],
    totalProducts: 0,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addNewProductToCart: (state,action) => {
            let prod = action.payload;
            var pos = state.cartList.findIndex((el) => el._id === prod._id && el.color === prod.color);
            prod = {...prod, quantity: parseInt(prod.quantity)}
            if(pos >= 0){
                state.cartList[pos].quantity += prod.quantity;
            }else{
                state.cartList.push(prod);
            }
            state.totalProducts = state.cartList.reduce((accumulator, item) => accumulator + item.quantity,0);
        },
        deleteFromCart: (state,action) => {
            const updatedList = state.cartList;
            updatedList.splice(action.payload, 1);
            state.cartList = updatedList;
            state.totalProducts = state.cartList.reduce((accumulator, prod) => accumulator + prod.quantity,0);
        },
        changeAmount:(state,action) => {
            const updatedList = state.cartList;
            switch (action.payload[0]) {
                case '+':
                    updatedList[action.payload[1]].quantity++;
                    break;
                case '-':
                    if(updatedList[action.payload[1]].quantity > 0) {
                        updatedList[action.payload[1]].quantity--;
                    }
                    break;
                default:
                    console.log("Invalid argument");
                    break;
            }
            state.cartList = updatedList;
            cartSlice.caseReducers.updateTotalProducts(state,action);
        },
        updateTotalProducts:(state,action) => {
            state.totalProducts = state.cartList.reduce((accumulator, prod) => accumulator + prod.quantity,0);
        }
    }
})

export const {addNewProductToCart, deleteFromCart,changeAmount} = cartSlice.actions;

export const totalProducts = (state) => state.cart.totalProducts;
export const cartList = (state) => state.cart.cartList;

export default cartSlice.reducer;