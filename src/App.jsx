import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useFormik } from "formik";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Routes, Route, useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { ForgetPassword } from "./forgetPassword";
import { VerifyOtp } from './verifyotp';

export default function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  // const token=false;
  return (
    token ? <section>{children}</section> : <Navigate replace to="/" />
    //  token? <section>{children}</section>:<h1>unautharaied</h1>
  )
}
function DashBoard() {
  const navigate = useNavigate("")
  const handleClick = () => {
    localStorage.removeItem('token');
    setTimeout(() => {
      navigate("/login")
    }, 1500);
    console.log("logout")
  }
  return (
    <div>
      <Button variant="outlined" onClick={handleClick}>Logout</Button>
      <Card sx={{ maxWidth: 300, margin: "auto", marginTop: 25, padding: 10 }} classname="card">
        <h2>Team Kakashi</h2>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKU77dDE7DQ5V2N09rswKOxRoQF6p1xcTYAw&usqp=CAU"
          alt="Team Kakashi" />
      </Card>
    </div >
  )
}
function Login() {
  const navigate = useNavigate();
  const [formstate, setformstate] = useState("success");

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    // validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      console.log("submit")
      const data = await fetch("http://localhost:4005/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(values)
      });
      if (data.status === 400) {
        console.log("error");
        setformstate("error");
      } else {
        setformstate("success");
        const result = await data.json();
        console.log("success", result);
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      }

    }
  });
  return (
    <div className="login-card">

      <Card sx={{ mx: 2, height: 300 }} className="card">
        <CardContent>
          <form onSubmit={formik.handleSubmit} className='loginform'>
            <h2>LOGIN</h2>
            <div className='loginfield'>
              <TextField
                name='username'
                value={formik.values.username}
                onChange={formik.handleChange}
                label="Username"
                variant="outlined" />
              <TextField
                value={formik.values.password}
                onChange={formik.handleChange}
                label="Password"
                name="password"
                type="password"
                variant="outlined" />

              <CardActions className="btn">
                <Button color={formstate} type='submit' variant="contained">{formstate === "success" ? "submit" : "retry"}</Button>
                <label className="alreadyuser" onClick={() => navigate("/")}>Sign in</label>
                <label className="alreadyuser" onClick={() => navigate("/forget-password")} >
                  Forget Password
                </label>
              </CardActions>

            </div>

          </form>
        </CardContent>
      </Card>
    </div >
  );
}


function Signin() {
  const navigate = useNavigate()
  const [formstate, setformstate] = useState("success")

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    // validationSchema: formValidationSchema,
    onSubmit: (newdata) => {
      // console.log(values)
      adddata(newdata)
    }
  });

  const adddata = (newdata) => {
    console.log(newdata)

    fetch("http://localhost:4005/signup", {
      method: "POST",
      body: JSON.stringify(newdata),
      headers: {
        "content-type": "application/json"
      }
    })
    navigate("/login")
  };
  return (
    <div className="login-card">
      <Card sx={{ mx: 2, height: 250 }} className="card">
        <form onSubmit={formik.handleSubmit} className='loginform'>
          <h2>SIGNUP</h2>
          <div className='loginfield'>
            <TextField
              placeholder="username"
              name='username'
              value={formik.values.username}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Username"
              variant="outlined" />
            <TextField
              placeholder="password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Password"
              name="password"
              type="password"
              variant="outlined" />
            <Button color="success" type='submit' variant="contained">submit</Button>
            <p className="alreadyuser" onClick={() => navigate("/login")} sx={{ fontSize: 7 }}>
              Already registered user
            </p>
          </div>

        </form>
      </Card>
    </div>

  );
}
