import { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";

function Header(props) {
    const { user } = useContext(UserContext);
    console.log("prikazi:", user)
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">{props.title}</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <UserContext.Consumer>
                        {context => (
                            context.user ?
                                <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/publish">Publish</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">Profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/logout">Logout</Link>
                        </li>
                        {user && user.isAdmin && ( // Check if user exists and isAdmin is true
                            <li className="nav-item">
                                <Link className="nav-link" to="/ordersList">Orders</Link>
                            </li>
                        )}
                         </>
                         :
                             <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">Register</Link>
                        </li>

                        </>

                        )}
                        </UserContext.Consumer>

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;