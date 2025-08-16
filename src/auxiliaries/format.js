//acá van funciones que sirvan para formatear datos

export const formatPrice = (value) => new Intl.NumberFormat('es-AR', {style: 'currency', currency: 'ARS', maximumFractionDigits: 0}).format(value);