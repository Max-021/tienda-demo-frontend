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
}

function cleanFilters(obj = {}) {
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === true) {
      out[k] = v;
      return;
    }

    if (typeof v === 'number' && !Number.isNaN(v)) {
      out[k] = v;
      return;
    }

    if (typeof v === 'string' && v.trim() !== '') {
      out[k] = v;
      return;
    }

    if (Array.isArray(v) && v.length > 0) {
      out[k] = v;
      return;
    }

    if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 0) {
      out[k] = v;
      return;
    }

  });
  return out;
}

/**
 * prepareQuery - construye objeto query para llamar la API
 *
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.limit
 * @param {Object} params.filters
 * @param {Object} params.editorFilters
 * @returns {Object}
 */
export function prepareQuery({ page = 1, limit = 15, filters = {}, editorFilters = {} } = {}) {
  const queryObj = { page, limit };

  const ed = { ...editorFilters };

  if (ed.showInactive) {
    ed.isActive = false;
    delete ed.showInactive;
  } else {
    delete ed.showInactive;
  }

  if (!ed.showAll) {
    delete ed.showAll;
  }

  const cleanedEditor = cleanFilters(ed);
  const cleanedNormal = cleanFilters(filters);

  const combined = { ...cleanedNormal, ...cleanedEditor };

  if (combined.minPrice != null) queryObj['price[gte]'] = combined.minPrice;
  if (combined.maxPrice != null) queryObj['price[lte]'] = combined.maxPrice;

  if (Array.isArray(combined.colors) && combined.colors.length > 0) queryObj['stock[color]'] = combined.colors;

  Object.entries(combined).forEach(([k, v]) => {
    if (['minPrice', 'maxPrice', 'colors'].includes(k)) return;

    if (v === true) {
      queryObj[k] = true;
      return;
    }

    if (Array.isArray(v) && v.length > 0) {
      queryObj[k] = v;
      return;
    }

    if (typeof v === 'number' || (typeof v === 'string' && v.trim() !== '')) {
      queryObj[k] = v;
      return;
    }

  });

  return queryObj;
}