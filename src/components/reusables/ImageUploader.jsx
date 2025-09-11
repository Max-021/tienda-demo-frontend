import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { compressImage, IMG_HEIGHT, IMG_WIDTH, IMG_TYPE } from "../../auxiliaries/imageCompressor";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDelete } from "react-icons/md";
import IconPopOver from "./IconPopOver.jsx";
import ImagesRules from "./ImagesRules.jsx";
import CircularProgress from "@mui/material/CircularProgress";

const SortableImage = ({ file, index, onDelete, isCover }) => {
  const id = typeof file === "string" ? file : `${file.name}-${file.lastModified}`;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [objectUrl, setObjectUrl] = useState( typeof file === "string" ? file : "" );

  useEffect(() => {
    if (typeof file !== "string") {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const imgDivTitle = isCover ? "portada" : "imagen producto";

  return (
    <div
      className={isCover ? "imgFormCover" : ""}
      title={imgDivTitle}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform), transition,
        position: "relative", width: 100,
        margin: 10, cursor: "grab", alignSelf: "flex-start",  borderRadius: 2,
      }}
      {...attributes}
      {...listeners}
    >
      <img src={objectUrl} alt={`preview-${index}`} width={100} />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onDelete(id)}
        style={{
          position: "absolute", top: 0, right: 0,
          background: "rgba(0,0,0,0.5)",
          border: "none", borderRadius: "50%",
          color: "white", cursor: "pointer",
          padding: 5, zIndex: 10,
        }}
      >
        <MdDelete size={20} />
      </button>
    </div>
  );
};

const ImageUploader = ({ images = [], onImgChange, name, setRemovedImages }) => {
  const validImages = Array.isArray(images) ? images : [];
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setIsCompressing(true);
      try {
        const optimized = await Promise.all(acceptedFiles.map((file) => compressImage(file, { maxWidth: IMG_WIDTH, maxHeight: IMG_HEIGHT, quality: 0.8, mimeType: IMG_TYPE, })));
        onImgChange([...validImages, ...optimized]);
      } catch (err) {
        console.error("Error comprimiendo imágenes:", err);
      } finally {
        setIsCompressing(false);
      }
    },
    [validImages, onImgChange]
  );

  const handleDelete = (id) => {
    const fileOrUrl = validImages.find((file) =>
      typeof file === "string"
        ? file === id
        : `${file.name}-${file.lastModified}` === id
    );
    if (typeof fileOrUrl === "string") setRemovedImages((prev) => [...prev, id]);

    const newImages = validImages.filter((file) =>
      typeof file === "string"
        ? file !== id
        : `${file.name}-${file.lastModified}` !== id
    );
    onImgChange(newImages);
  };

  const handleDragEnd = (event) => {
    if (validImages.length === 0) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = validImages.findIndex((file) =>
      typeof file === "string"
        ? file === active.id
        : `${file.name}-${file.lastModified}` === active.id
    );
    const newIndex = validImages.findIndex((file) =>
      typeof file === "string"
        ? file === over.id
        : `${file.name}-${file.lastModified}` === over.id
    );

    const updatedImages = arrayMove(validImages, oldIndex, newIndex);
    onImgChange(updatedImages);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: {"image/*": []} });

  return (
    <div>
      <p>
        Subir imágenes
        {name === "img" ? "" : ` para: ${<strong>{name}</strong>}`}
        <IconPopOver setAnchorEl={setAnchorEl} anchorEl={anchorEl} shownElement={<ImagesRules />}/>
      </p>
      <div {...getRootProps()}
        style={{
          position: "relative", border: "2px dashed #ccc",
          padding: 20, textAlign: "center",
          cursor: "pointer", marginBottom: 20,
        }}
      >
        <input {...getInputProps()} />
        {isCompressing ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress size={32} />
            <span style={{ marginLeft: 8 }}>Optimizando imágenes…</span>
          </div>
        ) : (
          <p>Arrastra y suelta imágenes aquí o haz clic para seleccionar</p>
        )}
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={validImages.map((file) =>
            typeof file === "string" ? file : `${file.name}-${file.lastModified}`
          )}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
            {validImages.map((file, index) => (
              <SortableImage
                key={typeof file === "string" ? file : `${file.name}-${file.lastModified}`}
                file={file}
                index={index}
                isCover={index === 0}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ImageUploader;