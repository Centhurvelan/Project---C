import { NavLink } from "react-router-dom";
import Button from "../../components/button/button";
import { logoutUser } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";


const Header = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("user");
   dispatch<any>(logoutUser())
  };
  return (
    <>
      <nav className="navbar bg-primary navbar-expand-lg" data-bs-theme="dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">Shopping Pets</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse d-flex"  role="search" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink  aria-current="page" to="/dogs"  
                className={({ isActive }) => 
                'nav-link' + (isActive ? ' active' : '')
            }
            >Dogs</NavLink >
              </li>
              <li className="nav-item">
                <NavLink   className={({ isActive }) => 
                'nav-link' + (isActive ? ' active' : '')}
                 to="/birds">Birds</NavLink >
              </li>
              <li className="nav-item">
              <NavLink   className={({ isActive }) => 
                'nav-link' + (isActive ? ' active' : '')} to="/order">Order</NavLink>
              </li>
              <li className="nav-item">
                <Button type="button" className="nav-link" onClick={handleLogout} label="Logout"/>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
