import  { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/loginUser';
import { toast } from 'react-toastify';
import { LoginContext } from '../App';
import './Login.css'; // ✅ IMPORT THE CSS FILE HERE
import api from '../api/axiosConfig';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setLoginStatus, setRole } = useContext(LoginContext);

    const signIn = async (en) => {
        en.preventDefault();
        // Basic Validation
        if (email.length === 0 || password.length === 0) {
            toast.warning('Please enter email and password');
            return;
        }
        

        try{
        const result = await api.post('/auth/login' ,{email, password});

        if (result.status==200) {

            console.log(result.data)
            toast.success('Welcome back!');
            sessionStorage.setItem('token', result.data.token);
            setLoginStatus(true);
            setRole(result.data.role);
            sessionStorage.setItem('role', result.data.role);
            sessionStorage.setItem('email', email);
            navigate('/home');
        }
            
        }catch(error){
            console.log(error.response)
            toast.error(error.response?.data?.message || "Login failed")
        }
        return 
    };

    return (
        <div className="login-page">
            <div className="login-card">

                {/* LEFT SIDE: Brand / Welcome Info */}
                <div className="login-brand-panel">
                    <i className="bi bi-person-workspace brand-icon"></i>
                    <h2>User Login</h2>
                    <p>Access your courses, assignments, and grades in one place.</p>
                </div>

                {/* RIGHT SIDE: The Form */}
                <div className="login-form-panel">
                    <div className="mb-5 text-center">
                        <h2 className="form-title">Login</h2>
                        <p className="text-muted">Enter your credentials to continue</p>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="emailInput"
                            placeholder="name@example.com"
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label htmlFor="emailInput">Email Address</label>
                    </div>

                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control"
                            id="passwordInput"
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label htmlFor="passwordInput">Password</label>
                    </div>

                    <div className="d-grid mb-4">
                        <button className="btn btn-primary custom-btn" onClick={signIn}>
                            Sign In
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-muted">New Student? </span>
                        <Link to="/register" className="register-link">Create Account</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;