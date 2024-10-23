import React, { useState } from 'react';

const ImageUploader = () => {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      <div>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Uploaded ${index}`} style={{ width: '100px', height: '100px', margin: '5px' }} />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
