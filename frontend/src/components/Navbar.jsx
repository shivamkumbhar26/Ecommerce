import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom' // Ensure this is 'react-router-dom'
import { LoginContext } from '../App'
import './Navbar.css'

function Navbar() {

  const { loginStatus, setLoginStatus, role, setRole } = useContext(LoginContext)

  // FIXED: useNavigate is a function, you must call it with ()
  const navigator = useNavigate()

  const logout = () => {
    setLoginStatus(false)
    setRole('USER')
    navigator('/')
    sessionStorage.clear()
  }

  return (
    <>
      {(role === 'ROLE_USER' || role === 'USER') && <div>
        <nav className="navbar navbar-expand-lg bg-white shadow-sm rounded-4 m-3 p-3">
          <div className="container-fluid">

            {/* Brand */}
            <Link className="navbar-brand fw-bold text-primary fs-4" to="/home">
              <i className="bi bi-mortarboard-fill me-2"></i>
              E-commerce
            </Link>

            {/* Toggler */}
            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <div className="navbar-nav ms-auto gap-3 align-items-center">

                <Link className="nav-link fw-semibold" to="/home">Home</Link>
                <Link className="nav-link fw-semibold" to="/products">Products</Link>
                <Link className="nav-link fw-semibold" to="/about">About</Link>
                <Link className="nav-link fw-semibold" to="/contact">Contact</Link>
                { loginStatus && (
                  <Link className="nav-link fw-semibold" to="/cart">Cart</Link>
                )}
                {loginStatus && (
                  <Link className="nav-link fw-semibold" to="/profile">Profile</Link>
                )}
                {/* Auth Buttons */}
                {!loginStatus && (
                  <Link className="btn btn-outline-primary px-4 rounded-pill" to="/login">
                    Log in
                  </Link>
                )}

                {loginStatus && (
                  <button className="btn btn-danger px-4 rounded-pill" onClick={logout}>
                    LogOut
                  </button>
                )}

              </div>
            </div>
          </div>
        </nav>
      </div>}

      {(role == 'ROLE_ADMIN') && <div>
        {/* TOP NAVBAR */}
        <nav
          className="navbar navbar-expand-lg navbar-dark px-3"
          style={{
            background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
          }}
        >
          <Link className="navbar-brand fw-bold text-light" to="/admin/dashboard">
            Admin Portal
          </Link>

          <div className="ms-auto dropdown">
            <button
              className="btn btn-outline-info dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              Admin
            </button>

            <ul className="dropdown-menu dropdown-menu-end dropdown-dark">
              <li>
                <Link className="dropdown-item" to="/profile">
                  Update Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/change-password">
                  Change Password
                </Link>
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* SECONDARY NAVBAR */}
        <nav
          className="navbar navbar-expand-lg border-bottom"
          style={{
            background: "rgba(20, 30, 40, 0.85)",
            backdropFilter: "blur(12px)"
          }}
        >
          <div className="container">
            <ul className="navbar-nav mx-auto gap-4">

              {/* DASHBOARD */}
              <li className="nav-item">
                <Link className="nav-link text-light fw-semibold" to="/admin/dashboard">
                  Dashboard
                </Link>

              </li>

              {/* COURSES */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-light fw-semibold"
                  data-bs-toggle="dropdown"
                >
                  Courses
                </button>

                <ul className="dropdown-menu dropdown-dark">
                  <li>
                    <Link className="dropdown-item" to="/admin/courses">
                      Get All Courses
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/course/add">
                      Add Course
                    </Link>
                  </li>
                </ul>
              </li>

              {/* VIDEOS */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-light fw-semibold"
                  data-bs-toggle="dropdown"
                >
                  Videos
                </button>

                <ul className="dropdown-menu dropdown-dark">
                  <li>
                    <Link className="dropdown-item" to="/admin/course/getallvideos">
                      Get All Videos
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/video/add">
                      Add Video
                    </Link>
                  </li>
                </ul>
              </li>

              {/* STUDENTS */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-light fw-semibold"
                  data-bs-toggle="dropdown"
                >
                  Students
                </button>

                <ul className="dropdown-menu dropdown-dark">
                  <li>
                    <Link className="dropdown-item" to="/admin/students">
                      Get All Students
                    </Link>
                  </li>
                </ul>
              </li>

            </ul>
          </div>
        </nav>
      </div>}

    </>
  )

}

export default Navbar