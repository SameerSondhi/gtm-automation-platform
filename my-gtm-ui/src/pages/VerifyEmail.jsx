import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Lottie from 'lottie-react';
import checkmarkAnim from '../assets/animations/checkmarkAnim.json';
import Confetti from 'react-confetti';
import CustomToast from '../components/CustomToast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // inside VerifyEmail.jsx

useEffect(() => {
    let attempts = 0;
    const interval = setInterval(async () => {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;
  
      console.log('✅ Checking user after verification...', user);
  
      if (user || attempts > 10) {
        clearInterval(interval);
  
        if (user) {
          setTimeout(() => setShowSpinner(true), 1000);
  
          // ✅ Auto-create org based on metadata
          const { organization_name } = user.user_metadata || {};
          if (organization_name) {
            try {
              const res = await fetch('/api/org/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  user_id: user.id,
                  name: organization_name
                })
              });
  
              const result = await res.json();
              if (!res.ok) {
                console.error('❌ Org creation failed:', result.error);
              } else {
                console.log('✅ Org created:', result);
              }
            } catch (err) {
              console.error('❌ Org creation error:', err.message);
            }
          }
  
          setTimeout(() => {
            setShowConfetti(false);
            navigate('/crm');
          }, 3000);
        }
      }
  
      attempts += 1;
    }, 500);
  
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div className="animate-fadeIn text-center z-10">
        <div className="w-32 h-32 mx-auto mb-6">
          <Lottie animationData={checkmarkAnim} loop={false} />
        </div>

        <h1 className="text-3xl font-bold mb-2 text-primary">Email Verified 🎉</h1>
        <p className="text-lg text-gray-300">You're all set — welcome aboard!</p>

        {showSpinner && (
          <div className="mt-4 flex items-center justify-center text-sm text-gray-400 animate-fadeIn">
            <svg
              className="animate-spin mr-2 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redirecting to CRM...
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;