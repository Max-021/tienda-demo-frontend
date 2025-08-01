export function applyFilters(products, {activeCat, searchText, filters}) {
    return products
        .filter(p => (activeCat ? p.category === activeCat : true))
        .filter(p => (searchText ? p.name.toLowerCase().includes(searchText.toLowerCase()) : true ))
        .filter(p => {
            const {minPrice, maxPrice} = filters;
            return (minPrice == null || p.price >= minPrice) && (maxPrice == null || p.price <= maxPrice);
        })
        .filter(p => {
            const {colors} = filters;
            if(!Array.isArray(colors) || colors.length === 0) return true;
            return colors.some(c => p.stock.some(s => s.color === c));
        });
        // .filter(p => {
        //     const { minPrice, maxPrice, colors, ...rest } = filters;
        //     return Object.entries(rest).every(([key, val]) => {
        //         if (!Array.isArray(val) || val.length === 0) return true;
        //         const field = p[key];
        //         return Array.isArray(field)
        //         ? field.some(x => val.includes(x))
        //         : val.includes(field);
        // });
}

export function prepareQuery({page, limit, filters = {}}) {
    let queryObj = {page, limit};
    
    if(filters.minPrice != null) queryObj['price[gte]'] = filters.minPrice;
    if(filters.maxPrice != null) queryObj['price[lte]'] = filters.maxPrice;
    if(Array.isArray(filters.colors) && filters.colors.length > 0) queryObj['stock[color]'] = filters.colors;
    
    return queryObj;
}