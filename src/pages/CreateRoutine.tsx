
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import WaveAnimation from '@/components/WaveAnimation';

const colors = [
  '#FF6B8A', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

const CreateRoutine = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    color: colors[0],
    selectedWeekdays: [] as string[],
    timeSlot: '',
    successCriteria: '',
    motivation: ''
  });

  const handleWeekdayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      selectedWeekdays: prev.selectedWeekdays.includes(day)
        ? prev.selectedWeekdays.filter(d => d !== day)
        : [...prev.selectedWeekdays, day]
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.timeSlot || formData.selectedWeekdays.length === 0) {
      alert('필수 항목을 모두 입력해주세요!');
      return;
    }
    
    // Here you would save to your data store
    console.log('Saving routine:', formData);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      <WaveAnimation />
      
      <div className="relative z-10 px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full bg-white/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">새 루틴 만들기 🌊</h1>
        </div>

        {/* Form */}
        <div className="space-y-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          {/* Routine Name */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium">
              루틴 이름 *
            </Label>
            <Input
              id="name"
              placeholder="예: 책 읽기, 운동하기, 명상하기"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-2 bg-white/70"
            />
          </div>

          {/* Color Selection */}
          <div>
            <Label className="text-gray-700 font-medium">루틴 색상</Label>
            <div className="flex gap-3 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          {/* Weekdays */}
          <div>
            <Label className="text-gray-700 font-medium">요일 선택 *</Label>
            <div className="flex gap-2 mt-2">
              {weekdays.map((day) => (
                <Button
                  key={day}
                  variant={formData.selectedWeekdays.includes(day) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleWeekdayToggle(day)}
                  className="min-w-[2.5rem]"
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Time Slot */}
          <div>
            <Label className="text-gray-700 font-medium">시간대 *</Label>
            <Select 
              value={formData.timeSlot} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, timeSlot: value }))}
            >
              <SelectTrigger className="mt-2 bg-white/70">
                <SelectValue placeholder="언제 하실 예정인가요?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="오전">🌅 오전 (6-12시)</SelectItem>
                <SelectItem value="오후">☀️ 오후 (12-18시)</SelectItem>
                <SelectItem value="저녁">🌆 저녁 (18-22시)</SelectItem>
                <SelectItem value="밤">🌙 밤 (22-6시)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Success Criteria */}
          <div>
            <Label htmlFor="criteria" className="text-gray-700 font-medium">
              성공 기준
            </Label>
            <Input
              id="criteria"
              placeholder="예: 30분 이상, 3회 이상, 10페이지 이상"
              value={formData.successCriteria}
              onChange={(e) => setFormData(prev => ({ ...prev, successCriteria: e.target.value }))}
              className="mt-2 bg-white/70"
            />
            <p className="text-xs text-gray-500 mt-1">
              AI가 성공/실패를 분석할 때 참고합니다
            </p>
          </div>

          {/* Motivation */}
          <div>
            <Label htmlFor="motivation" className="text-gray-700 font-medium">
              초심 (동기)
            </Label>
            <Textarea
              id="motivation"
              placeholder="이 루틴을 왜 하고 싶나요? AI가 힘들 때 상기시켜드릴게요!"
              value={formData.motivation}
              onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
              className="mt-2 bg-white/70"
              rows={3}
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 h-12 text-lg font-medium"
          >
            <Save className="h-5 w-5 mr-2" />
            루틴 저장하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutine;
