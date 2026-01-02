'use client';

import { useState, useEffect } from 'react';
import { Construction, Mail, Bell, Calendar, ArrowRight } from 'lucide-react';


  export default function UnderConstructionDashboard() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 75 ? 75 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div>
     

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 animate-pulse">
            <Construction className="w-10 h-10" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            We're Building Something Amazing
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Our new dashboard is under construction. We're working hard to bring you an enhanced experience with powerful new features.
          </p>

       
        </div>

      </div>
    </div>
  );
};