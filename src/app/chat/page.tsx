"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  imageData?: string; // 添加图片数据字段
}

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi, I'm your Virtual GP. What symptoms are you experiencing?",
      sender: 'assistant',
      timestamp: new Date()
    },

  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // 固定“三段”英文回复：按用户消息逐段回复
  const FIXED_REPLIES = [
    "You are chatting with a publicly deployed AI web tool. To protect my owner's token I cannot reveal anything, so I will temporarily assume you have a traumatic brain injury.~",
    "What is your traumatic brain injury level (1–10)?",
    "If you are still replying, I consider it level 10 and very serious. Please hang up now and book a doctor immediately."
  ] as const;

  // 当前应回复到第几段（0,1,2），第三段后保持在2
  const [replyStep, setReplyStep] = useState<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 检查摄像头支持和权限
  useEffect(() => {
    const checkCameraSupport = async () => {
      console.log('检查摄像头支持...');
      
      // 检查浏览器支持
      if (!navigator.mediaDevices) {
        console.log('不支持 mediaDevices API');
        return;
      }
      
      if (!navigator.mediaDevices.getUserMedia) {
        console.log('不支持 getUserMedia');
        return;
      }
      
      try {
        // 检查可用的摄像头设备
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('找到摄像头设备:', videoDevices.length);
        
        // 检查权限状态（如果支持）
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          console.log('摄像头权限状态:', permission.state);
        }
      } catch (error) {
        console.log('检查摄像头设备时出错:', error);
      }
    };
    
    checkCameraSupport();
  }, []);

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleEndCall = () => {
    // 将聊天消息传递给总结页面
    const messagesData = encodeURIComponent(JSON.stringify(messages));
    router.push(`/consultation-summary?messages=${messagesData}`);
  };

  // 移除未使用的摄像头功能
  /* const _toggleCamera = async () => { // 暂时保留但标记为未使用
    if (isCameraOpen) {
      setIsCameraOpen(false);
      setIsVideoLoading(true);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    } else {
      setIsVideoLoading(true);
      try {
        console.log('尝试访问摄像头...');
        
        // 检查浏览器支持
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('浏览器不支持摄像头访问');
        }

        // 请求摄像头权限
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user' 
          } 
        });
        
        console.log('摄像头访问成功');
        
        // 立即设置视频流
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // 当视频准备好播放时
          videoRef.current.oncanplay = () => {
            console.log('Video can play');
            setIsVideoLoading(false);
          };
          
          videoRef.current.onplaying = () => {
            console.log('Video is playing');
            setIsVideoLoading(false);
          };
          
          // 立即尝试播放
          videoRef.current.play().then(() => {
            console.log('Video play success');
            setIsVideoLoading(false);
          }).catch(error => {
            console.error('Video play error:', error);
            setIsVideoLoading(false);
          });
        }
        
        setIsCameraOpen(true);
        
        // 2秒后强制隐藏加载动画
        setTimeout(() => {
          setIsVideoLoading(false);
        }, 2000);
      } catch (error) {
        console.error('摄像头访问失败:', error);
        
        let errorMessage = '无法访问摄像头';
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            errorMessage = '摄像头权限被拒绝，请在浏览器设置中允许摄像头访问';
          } else if (error.name === 'NotFoundError') {
            errorMessage = '未找到摄像头设备';
          } else if (error.name === 'NotReadableError') {
            errorMessage = '摄像头正被其他应用使用';
          } else if (error.name === 'OverconstrainedError') {
            errorMessage = '摄像头不支持请求的配置';
          } else {
            errorMessage = `摄像头错误: ${error.message}`;
          }
        }
        
        // 显示错误消息给用户
        const errorMsg: Message = {
          id: Date.now().toString(),
          text: errorMessage,
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    }
  }; */

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      try {
        console.log('开始拍照...');
        console.log('视频尺寸:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
        
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // 镜像翻转画布以匹配预览
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
          
          // 绘制视频帧
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          
          // 转换为base64图片
          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          console.log('图片数据长度:', imageData.length);
          
          // 创建图片消息
          const photoMessage: Message = {
            id: Date.now().toString(),
            text: `📸 Photo captured`,
            sender: 'user',
            timestamp: new Date(),
            imageData: imageData
          };
          
          setMessages(prev => [...prev, photoMessage]);
          
          // 在输入框中添加图片提示
          setInputValue(prev => prev + '📷 [Photo] ');
          
          console.log('拍照成功');
        } else {
          console.error('无法获取canvas context');
        }
      } catch (error) {
        console.error('拍照失败:', error);
        
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: "拍照失败，请重试",
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } else {
      console.error('视频未准备好或尺寸为0');
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "摄像头未准备好，请稍等片刻再拍照",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // 检查请求频率限制（最少间隔3秒）
    const now = Date.now();
    if (now - lastRequestTime < 1000) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Please wait a few seconds before sending another message.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    setLastRequestTime(now);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    // const currentInput = inputValue; // 不再需要
    setInputValue("");
    setIsLoading(true);

    try {
      // 逐段返回固定回复
      const textToSend = FIXED_REPLIES[Math.min(replyStep, 2)];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: textToSend,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setReplyStep(prev => Math.min(prev + 1, 2));
    } catch (error) {
      console.error('Error generating fixed reply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden w-full h-full">
      {/* A. 顶部区域 */}
      <div className="absolute top-4 left-4 z-10">
        {/* 左上Home圆形按钮 */}
        <Button 
          className="w-11 h-11 rounded-full bg-[#84AE84] hover:bg-[#84AE84]/90 border-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-0 flex items-center justify-center"
          variant="default"
          onClick={handleGoHome}
        >
          <svg 
            className="w-5 h-5 text-white" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
        </Button>
      </div>

      {/* 右侧竖排功能圆钮组 */}
      <div className="absolute top-16 right-4 z-10 flex flex-col gap-3">
        {/* 摄像头按钮 - 已禁用 */}
        <Button 
          className="w-14 h-14 rounded-full bg-[#84AE84] border-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-0 flex items-center justify-center relative cursor-not-allowed"
          variant="default"
          
        >
          <div className="absolute inset-1 rounded-full bg-[#E7F6E7]/30"></div>
          <svg 
            className="w-6 h-6 text-white relative z-10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Button>

        {/* 录制视频按钮 */}
        <Button 
          className={`w-14 h-14 rounded-full ${isRecording ? 'bg-[#F1827D]' : 'bg-[#84AE84]'} hover:bg-[#84AE84]/90 border-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-0 flex items-center justify-center relative`}
          variant="default"
          onClick={toggleRecording}
        >
          <div className="absolute inset-1 rounded-full bg-[#E7F6E7]/30"></div>
          {isRecording ? (
            <div className="w-4 h-4 bg-white rounded-sm relative z-10"></div>
          ) : (
            <svg 
              className="w-6 h-6 text-white relative z-10" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </Button>

        {/* 挂电话按钮 */}
        <Button 
          className="w-14 h-14 rounded-full bg-[#F1827D] hover:bg-[#F1827D]/90 border-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-0 flex items-center justify-center relative"
          variant="default"
          onClick={handleEndCall}
        >
          <div className="absolute inset-1 rounded-full bg-white/20"></div>
          <svg 
            className="w-6 h-6 text-white relative z-10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
            />
            <line 
              x1="18" 
              y1="6" 
              x2="6" 
              y2="18" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>

      {/* B. 角色插画区 */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-32 h-32 bg-[#84AE84]/10 rounded-full flex items-center justify-center overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <Image
            src="/images/doctor_avatar.png"
            alt="Dr. Assistant Avatar"
            width={120}
            height={120}
            className="w-30 h-30 object-cover rounded-full"
          />
        </div>
        <div className="text-center mt-2">
          <div className="text-lg font-semibold text-[#84AE84]">Dr. Assistant</div>
          <div className="text-sm text-gray-600">AI Medical Consultant</div>
        </div>
      </div>

      {/* C. 聊天容器 */}
      <div className="absolute top-80 left-4 right-4 bottom-20 bg-[#ECECEC] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col">
        {/* 消息区域 */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col space-y-4">
                      {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-center'}`}>
              <div className={`rounded-2xl px-4 py-3 max-w-[82%] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${
                message.sender === 'user' 
                  ? 'bg-white text-gray-800 border border-gray-200' 
                  : 'bg-[#84AE84] text-white'
              }`}>
                {message.imageData ? (
                  <div className="space-y-2">
                    <Image 
                      src={message.imageData} 
                      alt="Captured photo" 
                      width={400}
                      height={300}
                      className="max-w-full h-auto rounded-lg border border-gray-300"
                      style={{ maxHeight: '200px' }}
                    />
                    <p className="text-sm font-medium">
                      {message.text}
                    </p>
                  </div>
                ) : (
                  <p className="text-base font-medium leading-6">
                    {message.text}
                  </p>
                )}
              </div>
            </div>
          ))}
            
            {isLoading && (
              <div className="flex justify-center">
                <div className="bg-[#84AE84] rounded-2xl px-4 py-3 max-w-[82%] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-white text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* 输入区域 */}
        <div className="p-4 border-t border-gray-300/30">
          <div className="bg-white rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] h-12 flex items-center px-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-base font-medium text-gray-900 placeholder-[#9AA0A6] disabled:opacity-50"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
            />
            
            {/* 语音输入按钮 */}
            <Button 
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border-none p-0 flex items-center justify-center ml-2"
              variant="default"
              onClick={() => {
                // 语音输入功能待实现
                console.log('Voice input clicked');
              }}
              title="Voice input"
            >
              <svg 
                className="w-4 h-4 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
              </svg>
            </Button>

            {inputValue && (
              <Button 
                className="w-8 h-8 rounded-full bg-[#84AE84] hover:bg-[#84AE84]/90 border-none p-0 flex items-center justify-center ml-2 disabled:opacity-50"
                variant="default"
                onClick={sendMessage}
                disabled={isLoading}
              >
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 摄像头预览窗口 - 已禁用 */}
      {false && isCameraOpen && (
        <div className="absolute bottom-28 left-4 w-48 h-36 bg-gray-900 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden z-20 border-2 border-[#98D798]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="192"
            height="144"
            className="w-full h-full object-cover bg-gray-800"
            style={{ 
              transform: 'scaleX(-1)', // 镜像翻转，更自然
              backgroundColor: '#1f2937' 
            }}
            onError={(e) => {
              console.error('Video element error:', e);
            }}
            onLoadStart={() => {
              console.log('Video load start');
            }}
            onLoadedData={() => {
              console.log('Video loaded data');
            }}
          />
          
          {/* 只在加载时显示占位符 */}
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-xs z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <div>Loading Camera...</div>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-2 right-2">
            <Button
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 border-none p-0 flex items-center justify-center backdrop-blur-sm transition-all duration-200"
              variant="default"
              onClick={capturePhoto}
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
              </div>
            </Button>
          </div>
          
          <div className="absolute top-2 left-2 text-xs text-white bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
            Camera Active
          </div>
        </div>
      )}
    </div>
  );
}
