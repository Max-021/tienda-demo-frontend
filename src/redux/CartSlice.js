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
            var pos = state.cartList.findIndex((el) => el.name === action.payload.name && el.color === action.payload.color);
            if(pos >= 0){
                console.log("Es repetido en pos: "+pos)
                const updatedList = state.cartList;
                console.log(updatedList[pos].quantity)
                updatedList[pos].quantity = updatedList[pos].quantity + action.payload.quantity;
                state.cartList = updatedList;
            }else{
                state.cartList = [...state.cartList, action.payload];
            }
            state.totalProducts = state.cartList.reduce((accumulator, prod) => accumulator + prod.quantity,0);
        },
        deleteFromCart: (state,action) => {
            const updatedList = state.cartList;
            updatedList.splice(action.payload, 1);
            state.cartList = updatedList;
            state.totalProducts = state.cartList.reduce((accumulator, prod) => accumulator + prod.quantity,0);
        },
        changeAmount:(state,action) =>{
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
            console.log(state.totalProducts);//verificar que no se pase a menos de 0
            state.totalProducts = state.cartList.reduce((accumulator, prod) => accumulator + prod.quantity,0);
        }
    }
})

export const {addNewProductToCart, deleteFromCart,changeAmount} = cartSlice.actions;

export const totalProducts = (state) => state.cart.totalProducts;
export const cartList = (state) => state.cart.cartList;

export default cartSlice.reducer;