import "../styles/Navbar.scss";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <button onClick={toggleSidebar} className="menu-btn">☰ Menu</button>
      <p className="api-name app-name">PushNotify API</p>      
    </nav>
  );
};

export default Navbar;