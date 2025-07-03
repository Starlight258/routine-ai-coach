
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BadgeSystem from '@/components/BadgeSystem';
import WaveAnimation from '@/components/WaveAnimation';

const Badges = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <WaveAnimation />
      
      <div className="relative z-10 px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full bg-white/50 dark:bg-gray-800/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <BadgeSystem />
      </div>
    </div>
  );
};

export default Badges;
