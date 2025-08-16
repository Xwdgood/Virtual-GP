"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUserData, saveUserData } from "@/lib/userData";
import { MedicalReport } from "@/types/user";

interface ChatSummary {
  symptoms: string[];
  recommendations: string[];
  recentHistory: string[];
}

export default function ConsultationSummaryPage() {
  const [summary, setSummary] = useState<ChatSummary>({
    symptoms: [],
    recommendations: [],
    recentHistory: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableSummary, setEditableSummary] = useState<ChatSummary>({
    symptoms: [],
    recommendations: [],
    recentHistory: []
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const chatData = searchParams.get('messages');
    if (chatData) {
      try {
        const messages = JSON.parse(decodeURIComponent(chatData));
        // 过滤掉系统消息，只保留真实的用户和助手对话
        const realMessages = messages.filter((msg: any) => 
          msg.text && 
          msg.text.trim() !== "" && 
          msg.text !== "Hello, how can I assist you today?" // 过滤默认问候语
        );
        
        if (realMessages.length > 0) {
          generateSummary(realMessages);
        } else {
          showEmptyState();
        }
      } catch (error) {
        console.error('Error parsing chat data:', error);
        showEmptyState();
      }
    } else {
      showEmptyState();
    }
  }, [searchParams]);

  const generateSummary = async (messages: any[]) => {
    // 固定“大脑创伤”模板总结（替代 OpenAI 调用）
    const fixedSummary = {
      symptoms: [
        "You are chatting with a public AI site. To protect the owner's token, I won't disclose anything; I will assume traumatic brain injury.",
        "Please report your traumatic brain injury level (1–10).",
        "If you are still replying, I consider it level 10 and very serious—hang up and book a doctor now."
      ],
      recommendations: [
        "Hang up and book an appointment with a doctor immediately.",
        "Do not rely on public AI tools for emergencies."
      ],
      recentHistory: [
        `Consultation on ${new Date().toLocaleDateString()}`
      ]
    };

    setSummary(fixedSummary);
    setEditableSummary(fixedSummary);
    setIsLoading(false);
  };

  const generateFallbackSummary = (aiResponse: string) => {
    // 如果AI返回的不是JSON，尝试从文本中提取信息
    const fallbackData = {
      symptoms: aiResponse.includes('symptom') ? ['Based on conversation analysis'] : [],
      recommendations: aiResponse.includes('recommend') ? ['Please refer to the consultation details'] : [],
      recentHistory: ['Chat consultation completed']
    };
    setSummary(fallbackData);
    setEditableSummary(fallbackData);
  };

  const generateFallbackFromMessages = (messages: any[]) => {
    // 从聊天记录中提取基本信息
    const userMessages = messages.filter(msg => msg.sender === 'user').map(msg => msg.text);
    const assistantMessages = messages.filter(msg => msg.sender === 'assistant').map(msg => msg.text);

    const fallbackData = {
      symptoms: userMessages.length > 0 ? [`Patient concerns: ${userMessages[0]}`] : ['No specific symptoms recorded'],
      recommendations: assistantMessages.length > 0 ? [`Medical advice provided`] : ['Consultation completed'],
      recentHistory: [`Consultation on ${new Date().toLocaleDateString()}`]
    };

    setSummary(fallbackData);
    setEditableSummary(fallbackData);
  };

  const showEmptyState = () => {
    // 显示空状态，提示用户没有足够的对话内容
    setSummary({
      symptoms: [],
      recommendations: [],
      recentHistory: []
    });
    setEditableSummary({
      symptoms: [],
      recommendations: [],
      recentHistory: []
    });
    setIsLoading(false);
  };

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const toggleEdit = () => {
    if (isEditing) {
      setSummary(editableSummary);
    }
    setIsEditing(!isEditing);
  };

  const updateEditableItem = (section: keyof ChatSummary, index: number, value: string) => {
    setEditableSummary(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? value : item)
    }));
  };

  const addNewItem = (section: keyof ChatSummary) => {
    setEditableSummary(prev => ({
      ...prev,
      [section]: [...prev[section], ""]
    }));
  };

  const removeItem = (section: keyof ChatSummary, index: number) => {
    setEditableSummary(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSaveSummary = async () => {
    setIsSaving(true);
    
    try {
      const userData = getUserData();
      if (!userData) {
        alert("User not found. Please login again.");
        router.push("/");
        return;
      }

      const currentSummary = isEditing ? editableSummary : summary;
      const newReport: MedicalReport = {
        id: Date.now().toString(),
        title: "Chat Record",
        date: new Date(),
        description: "AI consultation summary",
        textContent: `Symptoms:\n${currentSummary.symptoms.map(s => `• ${s}`).join('\n')}\n\nRecommendations:\n${currentSummary.recommendations.map(r => `• ${r}`).join('\n')}\n\nRecent History:\n${currentSummary.recentHistory.map(h => `• ${h}`).join('\n')}`,
        type: 'text'
      };

      const updatedReports = [newReport, ...(userData.medicalReports || [])];
      
      saveUserData({
        ...userData,
        medicalReports: updatedReports
      });

      alert("Chat record saved to medical records!");
      router.push("/medical-reports");
    } catch (error) {
      console.error('Error saving summary:', error);
      alert("Save failed, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBookAppointment = () => {
    router.push("/book-appointment");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84AE84] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#84AE84] font-medium">AI is analyzing your consultation...</p>
          <p className="text-gray-500 text-sm mt-2">Extracting symptoms, recommendations, and history</p>
        </div>
      </div>
    );
  }

  const renderEditableSection = (title: string, items: string[], section: keyof ChatSummary) => (
    <div>
      <h2 className="text-lg font-bold text-[#84AE84] mb-3 tracking-wide">{title}</h2>
      {items.length === 0 && !isEditing ? (
        <div className="text-gray-400 text-sm italic mb-4">
          No {title.toLowerCase()} recorded during consultation
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="w-2 h-2 bg-black rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
              {isEditing ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateEditableItem(section, index, e.target.value)}
                    className="flex-1 text-gray-800 text-sm leading-relaxed bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#84AE84]"
                  />
                  <button
                    onClick={() => removeItem(section, index)}
                    className="text-red-500 hover:text-red-700 text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="text-gray-800 text-sm leading-relaxed">{item}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {isEditing && (
        <div className="mt-2">
          <button
            onClick={() => addNewItem(section)}
            className="text-[#84AE84] text-sm hover:underline flex items-center"
          >
            <span className="w-2 h-2 bg-gray-300 rounded-full mr-3"></span>
            + Add new item
          </button>
        </div>
      )}
    </div>
  );

  const currentSummary = isEditing ? editableSummary : summary;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden w-full h-full">
      {/* Top Navigation */}
      <div className="absolute top-4 left-4 z-10">
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

      {/* Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          className="w-11 h-11 rounded-full bg-[#84AE84] hover:bg-[#84AE84]/90 border-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-0 flex items-center justify-center"
          variant="default"
          onClick={toggleEdit}
        >
          {isEditing ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )}
        </Button>
      </div>

      {/* Page Title */}
      <div className="text-center pt-6 pb-4">
        <h1 className="text-xl font-bold text-[#84AE84] tracking-widest">
          CONSULTATION<br />SUMMARY
        </h1>
      </div>

      {/* Scrollable Content Area */}
      <div className="absolute top-24 left-0 right-0 bottom-32 overflow-y-auto">
        {/* Check if consultation is empty */}
        {currentSummary.symptoms.length === 0 && 
         currentSummary.recommendations.length === 0 && 
         currentSummary.recentHistory.length === 0 && 
         !isEditing ? (
          <div className="px-6 py-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-500 mb-2">No Consultation Content</h3>
            <p className="text-gray-400 text-sm mb-4">
              The consultation appears to be empty or contains only greeting messages.
            </p>
            <p className="text-gray-400 text-sm">
              Start a conversation with the AI doctor to generate a meaningful summary.
            </p>
          </div>
        ) : (
          <div className="px-6 space-y-6">
            
            {/* Symptoms Section */}
            {renderEditableSection("SYMPTOMS", currentSummary.symptoms, "symptoms")}

            {/* Recommendations Section */}
            {renderEditableSection("RECOMMENDATION", currentSummary.recommendations, "recommendations")}

            {/* Recent History Section */}
            {renderEditableSection("RECENT HISTORY", currentSummary.recentHistory, "recentHistory")}
            
          </div>
        )}
      </div>

      {/* Bottom Button Area */}
      <div className="absolute bottom-6 left-6 right-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleSaveSummary}
            disabled={isSaving}
            className="h-14 bg-[#84AE84] hover:bg-[#84AE84]/90 text-white font-semibold rounded-2xl shadow-lg"
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
            ) : (
              "Save Summary"
            )}
          </Button>
          
          <Button
            onClick={handleBookAppointment}
            className="h-14 bg-[#84AE84] hover:bg-[#84AE84]/90 text-white font-semibold rounded-2xl shadow-lg"
          >
            Book<br />appointment
          </Button>
        </div>

        {/* Terms Link */}
        <div className="text-center pt-2">
          <button className="text-gray-400 text-sm underline">
            View Terms and Conditions
          </button>
        </div>
      </div>
    </div>
  );
}