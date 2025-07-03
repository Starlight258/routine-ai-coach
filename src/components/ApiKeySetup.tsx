
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ApiKeySetupProps {
  isOpen: boolean;
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ isOpen, onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }
    
    // Store in localStorage
    localStorage.setItem('gemini_api_key', apiKey);
    onApiKeySet(apiKey);
    setError('');
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gemini API 키 설정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="apiKey">Gemini API 키</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="API 키를 입력하세요"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="text-sm text-gray-600">
            <p>Gemini API 키는 브라우저의 로컬 스토리지에 안전하게 저장됩니다.</p>
            <p className="mt-1">
              API 키가 없으시다면{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Google AI Studio
              </a>
              에서 발급받으세요.
            </p>
          </div>
          <Button type="submit" className="w-full">
            API 키 설정하기
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySetup;
