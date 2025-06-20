#Shop template

Proyecto que funciona como una plantilla para crear sitios web como portal de venta


##App.js

En app.js acomodar las rutas en funcion de lo requerido, porque algunas se pueden condicionar en funcion de si el usuario tiene una sesión activa o no. Por defecto la unica ruta que no está protegida es la de /login

##Products

En este componente dependiendo de si hay o no una sesión activa se muestran más opciones, como ser editar un producto o las que se pidan según el caso
Hay una barra secundaria que contiene la barra de búsqueda y la botonera secundaria, esta tiene principalmente dos botones, filtrar, que abre un popover y cambiar vista que alterna entre grilla/lista
Los productos aparecen en un componente productView que está creado dentro de products, si se le hace click se abre el componente productCard en un Dialog.
-completar con lo que hace el componente products

Este componente llama a productCard que contiene un detalle de cada producto, algunas acciones solo aparecen disponibles para quien administre el sitio

##Redux

###searchBarSlice: en este componente aparecen las opciones que aparecen en los filtros con una excepción, categorias, esta va en un array propio, el resto de los documentos obtenidos van en un objeto filterOptions que sigue este formato: { nombreEnum: [...valores del enum]}
Esto se usa despues para alterar el objeto filters de productSlice, que tiene los elementos que se usan para filtrar el catalogo, las categorias tambien afectan productslice pero de una manera independiente, de modo que ambos filtros pueden convivir

###ProductSlice: este slice va conectado a searchbarslice, y tiene hardcodeado los casos y valores de los filtros, esto para tener un control especifico y que lo que no tengo creado todavia no se pueda aplicar.

#####Revisar

En esta carpeta hay componentes y otros archivos que tienen cosas que no fueron necesarias en el desarrollo original pero pueden servir como alternativas sin en proyectos futuros los requerimientos de la plataforma a crear asi lo demanden, los archivos están separados en carpetas y dentro de cada uno está comentado la intención de desarrollo