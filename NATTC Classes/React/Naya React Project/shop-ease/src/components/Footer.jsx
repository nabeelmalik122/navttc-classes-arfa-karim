import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="nav-logo">
            <span>🛍️</span>
            <h1>Shop<span>Ease</span></h1>
          </div>
          <p className="footer-desc">Your one-stop shop for quality products at the best prices.</p>
          <div className="social-links">
            <span className="social-icon">f</span>
            <span className="social-icon">t</span>
            <span className="social-icon">i</span>
            <span className="social-icon">yt</span>
          </div>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li>• Home</li>
            <li>• Products</li>
            <li>• Categories</li>
            <li>• About Us</li>
            <li>• Contact</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Customer Service</h3>
          <ul>
            <li>• FAQs</li>
            <li>• Shipping & Delivery</li>
            <li>• Returns & Refunds</li>
            <li>• Privacy Policy</li>
            <li>• Terms & Conditions</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Newsletter</h3>
          <p className="footer-desc">Subscribe to get updates on new products and offers.</p>
          <div className="newsletter-box">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 ShopEase. All rights reserved.
      </div>
    </footer>
  );
}