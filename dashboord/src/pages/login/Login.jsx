import React, { useEffect, useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion'; // Make sure to use framer-motion if motion/react fails
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../hook/useAuth';


export default function AdminLogin() {
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // UI States
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setErrorMessage('');
        setIsSubmitting(true);

        const credentials = { email, password };

        try {
            // Note: Ensure your useAuth login function throws an error or returns a failed status if credentials are bad
            await login(credentials);
            
            // The useEffect below will handle the successful redirect once Redux state updates
            // If the login fails and doesn't update state, we catch it or reset the spinner after a timeout
            setTimeout(() => {
                if (!isLoggedIn) {
                    setIsSubmitting(false);
                    setErrorMessage("Invalid email or password.");
                }
            }, 1500); 
        } catch (error) {
            setErrorMessage("Authentication failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    // Auto-redirect to the dashboard if Redux says we are logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="login-container">
            {/* Ambient Background Elements tailored for CoursVault */}
            <div className="ambient-background" aria-hidden="true">
                <div className="ambient-blob blob-primary" style={{ background: 'rgba(230, 57, 70, 0.15)' }}></div>
                <div className="ambient-blob blob-secondary" style={{ background: 'rgba(255, 184, 0, 0.1)' }}></div>
            </div>

            <main className="login-main">
                {/* Brand Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="login-header"
                >
                    <div className="brand-logo" style={{ color: '#E63946' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="brand-title">CoursVault</h1>
                    <p className="brand-subtitle">Admin Command Center</p>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="login-card"
                >
                    <form onSubmit={handleSubmit} className="login-form">

                        {/* Error Message Banner - Updated for Dark Theme */}
                        {errorMessage && (
                            <div
                                role="alert"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    backgroundColor: 'rgba(230, 57, 70, 0.1)',
                                    border: '1px solid rgba(230, 57, 70, 0.3)',
                                    color: '#E63946',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    marginBottom: '16px'
                                }}
                            >
                                <AlertCircle size={16} color="#E63946" style={{ flexShrink: 0 }} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="input-group">
                            <label htmlFor="email" className="input-label">Admin Email</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" color="#A1A1AA" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@coursvault.com"
                                    required
                                    autoComplete="email"
                                    className="form-input"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="input-group">
                            <label htmlFor="password" className="input-label">Vault Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" color="#A1A1AA" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    className="form-input"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    disabled={isSubmitting}
                                    style={{ color: '#A1A1AA' }}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                            style={{
                                background: 'linear-gradient(135deg, #E63946, #C92C39)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '14px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                marginTop: '10px'
                            }}
                        >
                            <span>
                                {isSubmitting ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Decrypting Vault...
                                    </>
                                ) : (
                                    'Access Dashboard'
                                )}
                            </span>
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>

                    </form>
                </motion.div>

                {/* Footer Metadata */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="login-footer"
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '12px', color: '#A1A1AA' }}
                >
                    <span className="system-status" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="status-dot" style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }}></span>
                        Secure Connection Established
                    </span>
                    <span className="system-version">v1.0.0</span>
                </motion.div>
            </main>
        </div>
    );
}