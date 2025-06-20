import { onCategorySelected, searchProduct, filterProducts } from "../ProductsSlice";

export const selectCategoryAndFilter = (cat) => (dispatch) => {
    dispatch(onCategorySelected(cat));
    dispatch(filterProducts());
};

export const searchAndFilter = (text) => (dispatch) => {
    dispatch(searchProduct(text));
    dispatch(filterProducts());
};