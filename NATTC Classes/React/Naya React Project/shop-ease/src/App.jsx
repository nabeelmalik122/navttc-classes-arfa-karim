import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import "./App.css";

const productsData = [
  {
    id: 1,
    title: "Wireless Headphones",
    description: "High quality sound with deep bass and noise cancellation.",
    price: "59.99",
    reviews: 128,
    badge: "NEW",
    badgeClass: "badge-green",
    image:
      "https://png.pngtree.com/png-vector/20230906/ourmid/pngtree-black-wireless-headphones-png-image_9998151.png",
  },
  {
    id: 2,
    title: "Smart Watch",
    description: "Track your fitness, heart rate and stay connected on the go.",
    price: "89.99",
    originalPrice: "129.99",
    reviews: 96,
    badge: "SALE",
    badgeClass: "badge-red",
    image:
      "https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-smart-watch-png-image_6694639.png",
  },
  {
    id: 3,
    title: "Running Shoes",
    description:
      "Lightweight and comfortable shoes for running and daily workouts.",
    price: "49.99",
    reviews: 75,
    badge: "TRENDING",
    badgeClass: "badge-blue",
    image:
      "https://png.pngtree.com/png-vector/20230906/ourmid/pngtree-white-running-shoes-png-image_9998150.png",
  },
  {
    id: 4,
    title: "Travel Backpack",
    description: "Spacious and durable backpack for travel and daily use.",
    price: "39.99",
    reviews: 60,
    badge: "NEW",
    badgeClass: "badge-purple",
    image:
      "https://png.pngtree.com/png-vector/20230906/ourmid/pngtree-black-travel-backpack-png-image_9998149.png",
  },
];

export default function App() {
  return (
    <div className="main-wrapper">
      <Navbar />

      <main className="content-container">
        <div className="product-grid">
          {productsData.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
