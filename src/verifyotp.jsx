import { useState } from 'react';
import { useFormik } from "formik";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';


export function VerifyOtp() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setpassword] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://sign-in-backend.vercel.app/verifyotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, password }),
            });
            const data = await response.json();
            setMessage(data.message);
            setTimeout(() => {
                navigate("/login")
            }, 3000);
        } catch (error) {
            console.log(error);
            setMessage('Failed to reset password');
        }
    };


    return (
        <div className="login-card">
            <Card sx={{ mx: 2, height: 400 }} className="card">
                <form onSubmit={handleResetPassword} className="loginfield">
                    <h2><label>OTP</label></h2>
                    <TextField type="text" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <TextField type="text" label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    <h2><label>New Password</label></h2>
                    <TextField
                        type="password"
                        value={password}
                        label="Password"
                        onChange={(e) => setpassword(e.target.value)}
                        required
                    />
                    <Button type="submit">Reset Password</Button>
                    {message && <h3>{message}</h3>}
                </form>

            </Card>
        </div>
    )
}