// Product.js
import React from 'react';
import './Product.css';

const Product = ({ id, name, price, imageSource, addToCart }) => {
  const imageUrl = `http://localhost:5000/api/images/${imageSource}`;

  return (
    <div className="product">
      <div className="product-image-container">
        <img className="custom-image" src={imageUrl} alt={name} />
      </div>
      <div className="product-details">
        <p className="product-name">{name}</p>
        <p className="product-price">${price}</p>
      </div>
      <button className="product-button" type="button" onClick={() => addToCart({ id, name, price, imageSource })}>
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
