import "../styles/Navbar.scss";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar w100">
      <button onClick={toggleSidebar} className="menu-button">☰ Menu</button>
      <p className="api-name app-name">PushNotify API</p>      
    </nav>
  );
};

export default Navbar;
