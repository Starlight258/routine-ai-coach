
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RoutineRecord {
  date: string;
  routines: {
    id: number;
    name: string;
    completed: boolean;
    color: string;
  }[];
}

// Mock data for demonstration
const mockRoutineRecords: RoutineRecord[] = [
  {
    date: '2025-01-01',
    routines: [
      { id: 1, name: '책 읽기', completed: true, color: '#FF6B8A' },
      { id: 2, name: '운동하기', completed: false, color: '#4ECDC4' },
    ]
  },
  {
    date: '2025-01-02',
    routines: [
      { id: 1, name: '책 읽기', completed: true, color: '#FF6B8A' },
      { id: 2, name: '운동하기', completed: true, color: '#4ECDC4' },
    ]
  },
];

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const getDateRecord = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockRoutineRecords.find(record => record.date === dateStr);
  };

  const getSuccessRate = (record: RoutineRecord) => {
    const completed = record.routines.filter(r => r.completed).length;
    return Math.round((completed / record.routines.length) * 100);
  };

  const renderDay = (date: Date) => {
    const record = getDateRecord(date);
    if (!record) return null;

    const successRate = getSuccessRate(record);
    let bgColor = 'bg-gray-100';
    
    if (successRate >= 80) bgColor = 'bg-green-200';
    else if (successRate >= 50) bgColor = 'bg-yellow-200';
    else if (successRate > 0) bgColor = 'bg-red-200';

    return (
      <div className={`w-full h-full ${bgColor} rounded-sm flex items-center justify-center`}>
        <span className="text-xs font-medium">{successRate}%</span>
      </div>
    );
  };

  const selectedRecord = selectedDate ? getDateRecord(selectedDate) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">루틴 달력 📅</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md"
          components={{
            Day: ({ date }) => (
              <div className="relative p-2">
                <span className="relative z-10">{date.getDate()}</span>
                <div className="absolute inset-0">
                  {renderDay(date)}
                </div>
              </div>
            )
          }}
        />
      </div>

      {/* 색상 범례 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <h3 className="font-semibold mb-3">성공률 범례</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <span>80% 이상</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 rounded"></div>
            <span>50-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span>1-49%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span>미수행</span>
          </div>
        </div>
      </div>

      {/* 선택된 날짜의 상세 정보 */}
      {selectedRecord && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold mb-4">
            {selectedDate?.toLocaleDateString('ko-KR')} 루틴 현황
          </h3>
          <div className="space-y-3">
            {selectedRecord.routines.map(routine => (
              <div key={routine.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: routine.color }}
                  />
                  <span>{routine.name}</span>
                </div>
                <Badge variant={routine.completed ? "default" : "secondary"}>
                  {routine.completed ? "완료" : "미완료"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
