// src/pages/EmailConfirmation.jsx
import { Link } from 'react-router-dom';

const EmailConfirmation = () => {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">📬 Check Your Inbox</h1>
      <p className="text-lg text-muted mb-6 max-w-md">
        We've sent a verification link to your email. Please confirm your address before logging in.
      </p>
      <Link
        to="/login"
        className="btn-neon px-6 py-2 rounded text-sm font-semibold"
      >
        🔐 Go to Login
      </Link>
    </div>
  );
};

export default EmailConfirmation;