import React from 'react';
import { MdRestore } from 'react-icons/md';

// Arrow function component for removed images preview with restore button
const RemovedImagesViewer = ({ removedImages = [], onRestore }) => {
  if (!removedImages || removedImages.length === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <p>Imágenes eliminadas, haciendo click en el ícono se pueden restaurar:</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {removedImages.map((url, idx) => (
          <div key={url} style={{ position: 'relative', width: 100 }}>
            <img src={url} alt={`removed-${idx}`} width={100} style={{ display: 'block', borderRadius: 4 }}/>
            <button type="button" onClick={() => onRestore(url)}
              style={{
                position: 'absolute',bottom: 0,right: 0,
                background: 'rgba(0,0,0,0.5)',border: 'none',borderRadius: '50%',
                color: 'white',cursor: 'pointer',padding: 4,zIndex: 10,
              }}
            >
              <MdRestore size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RemovedImagesViewer;
