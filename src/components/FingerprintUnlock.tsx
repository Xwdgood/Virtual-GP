"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface FingerprintUnlockProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FingerprintUnlock({ isOpen, onClose, onSuccess }: FingerprintUnlockProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPressed && !isCompleted) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2; // 每50ms增加2%，总共2秒
          if (newProgress >= 100) {
            setIsCompleted(true);
            return 100;
          }
          return newProgress;
        });
      }, 40); // 40ms间隔，确保2秒完成
    } else if (!isPressed) {
      setProgress(0);
      setIsCompleted(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPressed, isCompleted]);

  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        onSuccess();
      }, 300); // 完成后稍等一下再跳转
    }
  }, [isCompleted, onSuccess]);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Secure Access</h2>
          <p className="text-sm text-gray-600 mb-8">
            Use your fingerprint to access medical records
          </p>
          
          <div className="relative flex items-center justify-center mb-8">
            {/* 指纹按钮 */}
            <div 
              className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                isPressed 
                  ? 'border-[#84AE84] bg-[#84AE84]/10 scale-95' 
                  : 'border-gray-300 bg-gray-50 hover:border-[#84AE84] hover:bg-[#84AE84]/5'
              }`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* 进度环 */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#84AE84"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                  className="transition-all duration-100"
                />
              </svg>
              
              {/* 指纹图标 */}
              <svg 
                className={`w-10 h-10 transition-colors ${
                  isPressed ? 'text-[#84AE84]' : 'text-gray-600'
                }`}
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-2.04-1.34-3.30 0-2.58 2.07-4.68 4.64-4.68s4.64 2.1 4.64 4.68c0 1.26-.47 2.43-1.34 3.30-.19.19-.49.19-.68 0-.19-.19-.19-.49 0-.68.68-.68 1.02-1.58 1.02-2.62 0-2.06-1.66-3.74-3.7-3.74s-3.7 1.68-3.7 3.74c0 1.04.34 1.94 1.02 2.62.19.19.19.49 0 .68-.09.1-.22.15-.35.15zm-6.77-6.18c-.13 0-.26-.05-.35-.15-.87-.87-1.34-2.04-1.34-3.30 0-2.58 2.07-4.68 4.64-4.68s4.64 2.1 4.64 4.68c0 1.26-.47 2.43-1.34 3.30-.19.19-.49.19-.68 0-.19-.19-.19-.49 0-.68.68-.68 1.02-1.58 1.02-2.62 0-2.06-1.66-3.74-3.7-3.74s-3.7 1.68-3.7 3.74c0 1.04.34 1.94 1.02 2.62.19.19.19.49 0 .68-.09.1-.22.15-.35.15zm11.48 6.18c-.13 0-.26-.05-.35-.15-.87-.87-1.34-2.04-1.34-3.30 0-2.58 2.07-4.68 4.64-4.68s4.64 2.1 4.64 4.68c0 1.26-.47 2.43-1.34 3.30-.19.19-.49.19-.68 0-.19-.19-.19-.49 0-.68.68-.68 1.02-1.58 1.02-2.62 0-2.06-1.66-3.74-3.7-3.74s-3.7 1.68-3.7 3.74c0 1.04.34 1.94 1.02 2.62.19.19.19.49 0 .68-.09.1-.22.15-.35.15z"/>
              </svg>
            </div>
          </div>

          <div className="text-center mb-6">
            {isCompleted ? (
              <p className="text-[#84AE84] font-medium">Authenticated!</p>
            ) : isPressed ? (
              <p className="text-[#84AE84] font-medium">Hold to authenticate...</p>
            ) : (
              <p className="text-gray-600">Touch and hold to scan</p>
            )}
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
