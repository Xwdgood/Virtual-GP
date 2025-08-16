"use client";

import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* 手机外壳 */}
      <div className="relative">
        {/* 手机边框 */}
        <div 
          className="relative bg-black rounded-[55px] p-2 shadow-2xl"
          style={{ width: '400px', height: '850px' }}
        >
          {/* 内屏边框 */}
          <div 
            className="relative bg-white rounded-[45px] overflow-hidden"
            style={{ width: '384px', height: '834px' }}
          >
            {/* 刘海屏 */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50">
              <div 
                className="bg-black rounded-b-2xl flex items-center justify-center"
                style={{ width: '150px', height: '30px' }}
              >
                {/* 听筒 */}
                <div className="w-12 h-1.5 bg-gray-800 rounded-full"></div>
              </div>
            </div>

            {/* 状态栏区域 */}
            <div className="absolute top-2 left-4 right-4 z-40 flex justify-between items-center text-black text-sm font-medium">
              {/* 左侧时间 */}
              <div className="flex-1">
                <span>9:41</span>
              </div>
              
              {/* 右侧状态图标 */}
              <div className="flex items-center space-x-1">
                {/* 信号 */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48c.75-1.3 1.77-2.41 3-3.24l-.85-1.48c-1.53.87-2.83 2.17-3.85 3.72zM7.4 10.9l.85 1.48c.48-.28 1-.51 1.54-.68l-.85-1.48c-.72.2-1.4.47-2.04.83zm8.2 0c-.64-.36-1.32-.63-2.04-.83l-.85 1.48c.54.17 1.06.4 1.54.68l.85-1.48zM19 11.47l.85 1.48c-1.02-1.55-2.32-2.85-3.85-3.72l-.85 1.48c1.23.83 2.25 1.94 3 3.24z"/>
                </svg>
                
                {/* WiFi */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                </svg>
                
                {/* 电池 */}
                <div className="flex items-center">
                  <div className="w-6 h-3 border border-black rounded-sm relative">
                    <div className="w-4 h-1.5 bg-black rounded-sm absolute top-0.5 left-0.5"></div>
                  </div>
                  <div className="w-0.5 h-1.5 bg-black rounded-r-sm ml-0.5"></div>
                </div>
              </div>
            </div>

            {/* 应用内容区域 */}
            <div 
              className="absolute left-0 right-0 bottom-0"
              style={{ width: '375px', height: '812px', margin: '0 auto', top: '44px' }}
            >
              {children}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-1 bg-black rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        {/* 音量键 */}
        <div className="absolute left-0 top-32">
          <div className="w-1 h-8 bg-gray-800 rounded-r-lg"></div>
        </div>
        <div className="absolute left-0 top-44">
          <div className="w-1 h-8 bg-gray-800 rounded-r-lg"></div>
        </div>

        {/* 电源键 */}
        <div className="absolute right-0 top-40">
          <div className="w-1 h-12 bg-gray-800 rounded-l-lg"></div>
        </div>
      </div>
    </div>
  );
}
