import React from 'react';

const Textarea = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export default Textarea;