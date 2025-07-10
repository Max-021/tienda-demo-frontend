import React from 'react'

import { imgDataRules } from '../../data/imageRulesSugestion'

const ImagesRules = () => (
  <div style={{ padding: '8px', maxWidth: 550, fontSize: 14, lineHeight: 1.4, maxHeight: '300px', overflowY: 'auto'}}>
    <strong>Recomendaciones para tus imágenes</strong>
    <ul style={{ margin: '8px 0', paddingLeft: 16 }}>
      <li>
        <strong>Formato original:</strong> {imgDataRules.extensions.join(", ")}.
      </li>
      <li>
        <strong>Tamaño mínimo:</strong> al menos {imgDataRules.width} × {imgDataRules.height} px para asegurar nitidez.
      </li>
      <li>
        <strong>Relación de aspecto:</strong> {imgDataRules.aspectRatio} {imgDataRules.width} × {imgDataRules.height} px. 
        {imgDataRules.aspectRatio === '1/1' && ' Por ejemplo 500x500 (ideal), 1000x1000, 1500x1500, '}
      </li>
      <li>
        <strong>Área de interés central:</strong> el recorte se hace desde el centro, así que evitá dejar texto o caras en los bordes.
      </li>
      <li>
        <strong>Peso máximo recomendado:</strong> {imgDataRules.maxWeight}, despues la el peso de la imagen se va a optimizar, pero es mejor estar por debajo de lo recomendado.
      </li>
      <li>
        <strong>Iluminación y contraste:</strong> {imgDataRules.lightning}.
      </li>
      <li>
        <strong>Orientación:</strong> preferí siempre {imgDataRules.orientation} (paisaje), no {imgDataRules.noOrientation}.  
      </li>
      <li>
        <strong>Calidad:</strong> evitá imágenes muy ruidosas o pixeladas; la compresión WebP las optimiza, pero conviene partir de alta resolución.
      </li>
    </ul>
    <em>Estas pautas ayudan a que las imágenes se vean bien tras la optimización.</em>
  </div>
)

export default ImagesRules