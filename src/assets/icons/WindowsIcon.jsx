import React from 'react';

export default function WindowsIcon({ className = '', size = 24 }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 87.6 87.6" 
      width={size} 
      height={size} 
      className={className}
    >
      <path fill="currentColor" d="M0 12.5l35.7-4.9v33.8H0V12.5zM39.6 6.8l48-6.8v39.8h-48V6.8zM0 45.4h35.7v33.8l-35.7-4.9V45.4zM39.6 45.4h48v39.8l-48-6.6V45.4z"/>
    </svg>
  );
}
