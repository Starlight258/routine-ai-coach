
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Routine {
  id: number;
  name: string;
  color: string;
  timeSlot: string;
  successCriteria: string;
  status: 'success' | 'failed' | 'pending';
  completedToday: boolean;
  streak: number;
  weekdays: string[];
}

interface RoutineCardProps {
  routine: Routine;
  onToggle: () => void;
}

const RoutineCard = ({ routine, onToggle }: RoutineCardProps) => {
  const getStatusColor = () => {
    switch (routine.status) {
      case 'success': return 'border-green-400 bg-green-50';
      case 'failed': return 'border-red-400 bg-red-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getStatusIcon = () => {
    if (routine.completedToday) {
      return <Check className="h-5 w-5 text-green-600" />;
    }
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className={`rounded-2xl border-2 ${getStatusColor()} p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md`}>
      <Link to={`/routine/${routine.id}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: routine.color }}
            />
            <div>
              <h3 className="font-semibold text-gray-800">{routine.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {routine.timeSlot}
                </span>
                <span className="text-xs text-gray-500">
                  {routine.successCriteria}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {routine.streak > 0 && (
              <div className="text-center">
                <div className="text-xs text-gray-500">연속</div>
                <div className="text-sm font-bold text-orange-500">{routine.streak}일</div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                onToggle();
              }}
              className="rounded-full hover:bg-white/50"
            >
              {getStatusIcon()}
            </Button>
          </div>
        </div>
      </Link>
      
      <div className="flex gap-1 mt-3">
        {routine.weekdays.map((day, index) => (
          <span 
            key={index}
            className="text-xs bg-white/60 px-2 py-1 rounded-full text-gray-600"
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RoutineCard;
