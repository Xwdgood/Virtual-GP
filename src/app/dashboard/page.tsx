"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { logoutUser } from "@/lib/userData";
import FingerprintUnlock from "@/components/FingerprintUnlock";

export default function DashboardPage() {
  const router = useRouter();
  const [showFingerprintUnlock, setShowFingerprintUnlock] = useState(false);

  const handleCallDoctor = () => {
    router.push("/chat");
  };

  const handleMedicalReports = () => {
    setShowFingerprintUnlock(true);
  };

  const handleFingerprintSuccess = () => {
    setShowFingerprintUnlock(false);
    router.push("/medical-reports");
  };

  const handleFingerprintCancel = () => {
    setShowFingerprintUnlock(false);
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  const handleBookAppointment = () => {
    router.push("/book-appointment");
  };

  return (
    <MobileLayout>
      {/* Logout按钮 */}
      <div className="absolute top-30 right-10 z-10">
        <Button 
          className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 border-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-0 flex items-center justify-center"
          variant="default"
          onClick={handleLogout}
          title="Logout"
        >
          <svg 
            className="w-5 h-5 text-white" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Green Homescreen Center Area */}
        <Card className="bg-gradient-to-br from-[#77b080] to-[#6a9d73] border-none shadow-xl">
          <CardContent className="p-4 text-center text-white">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to VirtualGP</h2>
              <p className="text-white/90 text-sm">
                Your AI-powered healthcare companion is ready to assist you
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-lg font-semibold">24/7</div>
                <div className="text-white/80">Available</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-lg font-semibold">AI-Powered</div>
                <div className="text-white/80">Diagnosis</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Three Main Action Buttons */}
        <div className="space-y-4">
          <Button 
            className="w-full h-20 text-left justify-start bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90 text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
            variant="outline"
            onClick={handleCallDoctor}
          >
            <div className="flex items-center w-full">
              <div className="w-12 h-12 bg-[#77b080]/10 rounded-full flex items-center justify-center mr-4">
                <svg 
                  className="w-6 h-6 text-[#77b080]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">Call Virtual Doctor</div>
                <div className="text-sm text-gray-600">Get instant medical consultation</div>
              </div>
            </div>
          </Button>

          <Button 
            className="w-full h-20 text-left justify-start bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90 text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
            variant="outline"
            onClick={handleMedicalReports}
          >
            <div className="flex items-center w-full">
              <div className="w-12 h-12 bg-[#77b080]/10 rounded-full flex items-center justify-center mr-4">
                <svg 
                  className="w-6 h-6 text-[#77b080]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">Upload Medical Records</div>
                <div className="text-sm text-gray-600">Securely store your health data</div>
              </div>
            </div>
          </Button>

          <Button 
            className="w-full h-20 text-left justify-start bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90 text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
            variant="outline"
            onClick={handleBookAppointment}
          >
            <div className="flex items-center w-full">
              <div className="w-12 h-12 bg-[#77b080]/10 rounded-full flex items-center justify-center mr-4">
                <svg 
                  className="w-6 h-6 text-[#77b080]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">Schedule Medical Appointment</div>
                <div className="text-sm text-gray-600">Book with healthcare providers</div>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* 指纹解锁组件 */}
      <FingerprintUnlock
        isOpen={showFingerprintUnlock}
        onClose={handleFingerprintCancel}
        onSuccess={handleFingerprintSuccess}
      />
    </MobileLayout>
  );
}
