import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import authGradient from '../assets/animations/authGradient.json';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [orgName, setOrgName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !orgName) {
      toast({ type: 'error', message: 'Please enter a username and organization name.' });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:5173/verify-email',
        data: {
          username,
          organization_name: orgName
        }
      }
    });

    if (error) {
      setErrorMsg(error.message);
      toast({ type: 'error', message: error.message });
    } else {
      toast({ type: 'success', message: '✅ Check your inbox to verify your email!' });
      navigate('/email-confirmation');
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-white">
      {/* Left: Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleSignup} className="card-surface p-8 rounded-xl w-full max-w-md shadow-xl">
          <h2 className="text-2xl font-bold neon-text text-center mb-4">Sign Up</h2>
          {errorMsg && <p className="text-red-400 text-sm mb-3">{errorMsg}</p>}

          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-3 bg-slate-800 border border-slate-600 rounded text-sm text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Organization Name"
            className="w-full p-2 mb-3 bg-slate-800 border border-slate-600 rounded text-sm text-white"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 bg-slate-800 border border-slate-600 rounded text-sm text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 bg-slate-800 border border-slate-600 rounded text-sm text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-neon w-full">Sign Up</button>

          <p className="text-sm mt-4 text-center text-slate-400">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline font-medium">Login</a>
          </p>
        </form>
      </div>

       {/* Right: Canvas/Graphic */}
<div className="hidden md:flex w-1/2 items-center justify-center relative bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-[#0f0f0f] overflow-hidden">
  {/* Soft blur glowing background */}
  <div className="absolute inset-0 bg-#0D161B"/> 

  <div className="relative z-10 text-left px-10 space-y-6 max-w-md">
    <motion.h2
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-2xl font-semibold text-primary"
    >
      Capture leads in seconds.
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-muted text-base"
    >
      Enrich leads with AI.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="text-muted text-base"
    >
      Track GTM performance effortlessly.
    </motion.p>
  </div>
</div>
    </div>
  );
};

export default Signup;