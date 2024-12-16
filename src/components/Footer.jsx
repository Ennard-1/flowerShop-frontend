import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-4">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} My React App</p>
      </div>
    </footer>
  );
}

export default Footer;
