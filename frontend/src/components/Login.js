import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext); 

    async function Login(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        console.log(data)
        if(data._id !== undefined){
            //localStorage.setItem('token', data.token);
            userContext.setUserContext(data);
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    return (
<form className="container mt-5" onSubmit={Login}>
    {userContext.user ? <Navigate replace to="/" /> : ""}
    <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input type="text" className="form-control" id="username" name="username" placeholder="Enter your username" value={username} onChange={(e)=>(setUsername(e.target.value))}/>
    </div>
    <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" className="form-control" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e)=>(setPassword(e.target.value))}/>
    </div>
    <button type="submit" className="btn btn-primary">Log in</button>
    {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
</form>
    );
}

export default Login;