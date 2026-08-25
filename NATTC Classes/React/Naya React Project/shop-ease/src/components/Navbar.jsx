import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-logo">
        <span className="logo-icon">🛍️</span>
        <h1>Shop<span>Ease</span></h1>
      </div>

      <nav className="nav-links">
        <a href="#" className="active">Home</a>
        <a href="#">Products</a>
        <a href="#">Categories</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>

      <div className="nav-actions">
        <button className="icon-btn">🔍</button>
        <button className="icon-btn">👤</button>
        <div className="cart-icon">
          🛍️
          <span className="cart-badge">3</span>
        </div>
      </div>
    </header>
  );
}