import React from 'react';

const Input = ({ type = 'text', className = '', ...props }) => {
  return (
    <input
      type={type}
      className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export default Input;