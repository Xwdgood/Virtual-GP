"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getUserData, saveUserData } from "@/lib/userData";
import { MedicalReport } from "@/types/user";

export default function MedicalReportsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [textContent, setTextContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [editableReport, setEditableReport] = useState<Partial<MedicalReport>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 加载用户数据
  useEffect(() => {
    const userData = getUserData();
    if (userData?.medicalReports) {
      setReports(userData.medicalReports);
    }
  }, []);

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newReport: MedicalReport = {
      id: Date.now().toString(),
      title: title.trim(),
      date: new Date(),
      description: description.trim() || undefined,
      textContent: textContent.trim() || undefined,
      imageUrl: imagePreview || undefined,
      type: imagePreview && textContent ? 'mixed' : imagePreview ? 'image' : 'text'
    };

    const newReports = [newReport, ...reports];
    setReports(newReports);

    // 保存到用户数据
    const userData = getUserData();
    if (userData) {
      saveUserData({
        ...userData,
        medicalReports: newReports
      });
    }

    // 重置表单
    setTitle("");
    setDescription("");
    setTextContent("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsOpen(false);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const startEditing = (report: MedicalReport) => {
    setEditingReport(report.id);
    setEditableReport({
      title: report.title,
      description: report.description || '',
      textContent: report.textContent || ''
    });
  };

  const cancelEditing = () => {
    setEditingReport(null);
    setEditableReport({});
  };

  const saveEdit = () => {
    if (!editingReport) return;

    const updatedReports = reports.map(report => 
      report.id === editingReport 
        ? {
            ...report,
            title: editableReport.title || report.title,
            description: editableReport.description,
            textContent: editableReport.textContent,
            date: new Date() // Update modification date
          }
        : report
    );

    setReports(updatedReports);

    // Save to user data
    const userData = getUserData();
    if (userData) {
      saveUserData({
        ...userData,
        medicalReports: updatedReports
      });
    }

    setEditingReport(null);
    setEditableReport({});
  };

  const deleteReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this medical report?')) {
      const updatedReports = reports.filter(report => report.id !== reportId);
      setReports(updatedReports);

      // Save to user data
      const userData = getUserData();
      if (userData) {
        saveUserData({
          ...userData,
          medicalReports: updatedReports
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden w-full h-full">
      {/* 顶部导航 */}
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

      {/* Page Title */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <h1 className="text-2xl font-bold text-[#84AE84] mb-2">Medical Reports</h1>
        <p className="text-sm text-gray-600">Manage your health records</p>
      </div>

      {/* 主要内容区域 */}
      <div className="absolute top-32 left-4 right-4 bottom-4 bg-[#ECECEC] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col">
        
        {/* Add按钮区域 */}
        <div className="p-6 border-b border-gray-300/30">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button 
                className="w-full h-16 bg-[#84AE84] hover:bg-[#84AE84]/90 border-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-2xl text-white text-lg font-semibold"
                variant="default"
              >
                <svg 
                  className="w-6 h-6 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
                Add Medical Report
              </Button>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Upload Medical Report</DrawerTitle>
                <DrawerDescription>
                  Add a new medical report with text and/or images
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* 标题输入 */}
                <div className="space-y-2">
                  <Label htmlFor="title">Report Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter report title..."
                    className="bg-white"
                  />
                </div>

                {/* 描述输入 */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description..."
                    className="bg-white"
                  />
                </div>

                {/* 文本内容输入 */}
                <div className="space-y-2">
                  <Label htmlFor="textContent">Text Content</Label>
                  <textarea
                    id="textContent"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter medical report details..."
                    className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#84AE84] focus:border-transparent outline-none resize-none bg-white"
                  />
                </div>

                {/* 图片上传 */}
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white">
                    {imagePreview ? (
                      <div className="space-y-3">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={200}
                          height={150}
                          className="mx-auto rounded-lg object-cover"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearImage}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <svg
                            className="w-8 h-8 text-gray-400"
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
                          <span className="text-sm text-gray-600">
                            Click to upload image
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DrawerFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  className="bg-[#84AE84] hover:bg-[#84AE84]/90"
                >
                  Save Report
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Timeline Display Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No medical reports yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Add your first medical report using the button above
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={report.id} className="relative">
                  {/* Timeline connector */}
                  {index < reports.length - 1 && (
                    <div className="absolute left-6 top-14 w-0.5 h-16 bg-[#84AE84]/30"></div>
                  )}
                  
                  <Card className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-none ml-10">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {/* Timeline node */}
                        <div className="absolute left-4 w-4 h-4 bg-[#84AE84] rounded-full border-4 border-white shadow-lg"></div>
                        
                        <div className="flex-1">
                          {/* Action buttons */}
                          <div className="flex justify-end gap-2 mb-2">
                            {editingReport === report.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={saveEdit}
                                  className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={cancelEditing}
                                  className="h-8 px-3 bg-gray-500 hover:bg-gray-600 text-white"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => startEditing(report)}
                                  className="h-8 px-3 bg-[#84AE84] hover:bg-[#84AE84]/90 text-white"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => deleteReport(report.id)}
                                  className="h-8 px-3 bg-red-500 hover:bg-red-600 text-white"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </Button>
                              </>
                            )}
                          </div>

                          {/* Title */}
                          {editingReport === report.id ? (
                            <input
                              type="text"
                              value={editableReport.title || ''}
                              onChange={(e) => setEditableReport(prev => ({...prev, title: e.target.value}))}
                              className="w-full font-semibold text-gray-800 mb-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#84AE84]"
                              placeholder="Report title"
                            />
                          ) : (
                            <h3 className="font-semibold text-gray-800 mb-1">{report.title}</h3>
                          )}
                          
                          <p className="text-xs text-gray-500 mb-2">{formatDate(report.date)}</p>
                          
                          {/* Description */}
                          {(editingReport === report.id || report.description) && (
                            <div className="mb-3">
                              {editingReport === report.id ? (
                                <input
                                  type="text"
                                  value={editableReport.description || ''}
                                  onChange={(e) => setEditableReport(prev => ({...prev, description: e.target.value}))}
                                  className="w-full text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#84AE84]"
                                  placeholder="Description (optional)"
                                />
                              ) : (
                                <p className="text-sm text-gray-600">{report.description}</p>
                              )}
                            </div>
                          )}
                          
                          {/* Image */}
                          {report.imageUrl && (
                            <div className="mb-3">
                              <Image
                                src={report.imageUrl}
                                alt={report.title}
                                width={280}
                                height={200}
                                className="rounded-lg object-cover w-full max-h-48"
                              />
                            </div>
                          )}
                          
                          {/* Text Content */}
                          {(editingReport === report.id || report.textContent) && (
                            <div className="mb-3">
                              {editingReport === report.id ? (
                                <textarea
                                  value={editableReport.textContent || ''}
                                  onChange={(e) => setEditableReport(prev => ({...prev, textContent: e.target.value}))}
                                  className="w-full h-24 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#84AE84] resize-none"
                                  placeholder="Report details..."
                                />
                              ) : (
                                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                                  {report.textContent}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Type Badge */}
                          <div className="mt-3 flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.type === 'image' 
                                ? 'bg-blue-100 text-blue-700'
                                : report.type === 'mixed'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {report.type === 'image' ? '📷 Image' : 
                               report.type === 'mixed' ? '📄📷 Mixed' : '📄 Text'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
