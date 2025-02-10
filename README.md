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


#####Revisar

En esta carpeta hay componentes y otros archivos que tienen cosas que no fueron necesarias en el desarrollo original pero pueden servir como alternativas sin en proyectos futuros los requerimientos de la plataforma a crear asi lo demanden, los archivos están separados en carpetas y dentro de cada uno está comentado la intención de desarrollo