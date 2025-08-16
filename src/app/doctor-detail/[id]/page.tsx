"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Doctor } from "@/types/doctor";
import { doctorsDatabase } from "@/lib/doctorData";
import { getUserData } from "@/lib/userData";
import { MedicalReport } from "@/types/user";

interface TimeSlot {
  time: string;
  available: boolean;
  period: 'morning' | 'afternoon';
}

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showDateDrawer, setShowDateDrawer] = useState(false);
  const [showRecordsDrawer, setShowRecordsDrawer] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<MedicalReport[]>([]);
  const [userRecords, setUserRecords] = useState<MedicalReport[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 生成未来7天的日期
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  // 生成时间段
  const generateTimeSlots = (availableSlots: string[]): TimeSlot[] => {
    const morningSlots = [
      '9:00', '9:30', '10:00', '10:30', '11:00', '11:30'
    ];
    const afternoonSlots = [
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    const slots: TimeSlot[] = [];

    // 添加早上时段
    morningSlots.forEach(time => {
      slots.push({
        time,
        available: availableSlots.includes('morning') || availableSlots.includes('allday'),
        period: 'morning'
      });
    });

    // 添加下午时段
    afternoonSlots.forEach(time => {
      slots.push({
        time,
        available: availableSlots.includes('afternoon') || availableSlots.includes('allday'),
        period: 'afternoon'
      });
    });

    return slots;
  };

  useEffect(() => {
    const foundDoctor = doctorsDatabase.find(d => d.id === doctorId);
    if (foundDoctor) {
      setDoctor(foundDoctor);
    }

    // 加载用户医疗记录
    const userData = getUserData();
    if (userData?.medicalReports) {
      setUserRecords(userData.medicalReports);
    }
  }, [doctorId]);

  const handleGoBack = () => {
    router.push("/book-appointment");
  };

  const handleDateSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowDateDrawer(false);
  };

  const handleRecordSelect = (record: MedicalReport) => {
    setSelectedRecords(prev => {
      const exists = prev.find(r => r.id === record.id);
      if (exists) {
        return prev.filter(r => r.id !== record.id);
      } else {
        return [...prev, record];
      }
    });
  };

  const handleSaveRecords = () => {
    setShowRecordsDrawer(false);
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time first.");
      return;
    }
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      router.push("/book-appointment");
    }, 2000);
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden w-full h-full flex items-center justify-center">
        <p>Doctor not found</p>
      </div>
    );
  }

  const dates = generateDates();
  const timeSlots = generateTimeSlots(doctor.availableTimeSlots);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden w-full h-full">
      {/* Top Navigation */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          className="w-11 h-11 rounded-full bg-[#84AE84] hover:bg-[#84AE84]/90 border-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-0 flex items-center justify-center"
          variant="default"
          onClick={handleGoBack}
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

      {/* Scrollable Content Area */}
      <div className="absolute top-16 left-0 right-0 bottom-44 overflow-y-auto">
        <div className="px-6 pt-4 pb-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-[#84AE84] mb-2">
            BOOK AN APPOINTMENT<br />WITH THIS DOCTOR?
          </h1>
        </div>

        {/* Doctor Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image 
              src={doctor.avatar} 
              alt={doctor.name}
              width={192}
              height={192}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

                  {/* Doctor Info Card */}
          <Card className="bg-[#84AE84] border-none rounded-xl mb-4">
            <CardContent className="text-center text-white px-4">
              <p className="text-xl font-bold">{doctor.name}</p>
            </CardContent>
          </Card>

        {/* Doctor Details */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="font-medium">Earliest Available:</span>
            <span className="text-gray-600">
              {doctor.earliestAvailable.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
              })} {doctor.earliestAvailable.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="font-medium">Distance:</span>
            <span className="text-gray-600">{doctor.distance === 0 ? '0km' : `${doctor.distance}km`}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="font-medium">Cost:</span>
            <span className="text-gray-600">{doctor.cost === 0 ? '$0' : `$${doctor.cost}`}</span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <span className="w-2 h-2 bg-black rounded-full mt-1.5 flex-shrink-0"></span>
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-medium text-black underline"
              onClick={() => alert("More details: " + doctor.description)}
            >
              More Details
            </Button>
          </div>
        </div>

        {/* Selected Date & Time Display */}
        {selectedDate && selectedTime && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-green-800 mb-2">Selected Appointment:</h3>
              <p className="text-green-700 text-sm">
                {dates.find(d => d.date === selectedDate)?.display} at {selectedTime}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Selected Records Display */}
        {selectedRecords.length > 0 && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-800 mb-2">
                Attached Medical Records ({selectedRecords.length}):
              </h3>
              <div className="space-y-1">
                {selectedRecords.map(record => (
                  <p key={record.id} className="text-blue-700 text-sm">• {record.title}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="absolute bottom-16 left-6 right-6 space-y-3">
        {/* Top Row - Date and Medical Records */}
        <div className="grid grid-cols-2 gap-3">
          {/* Date Selection Drawer */}
          <Drawer open={showDateDrawer} onOpenChange={setShowDateDrawer}>
            <DrawerTrigger asChild>
              <Button className="h-12 bg-[#84AE84] hover:bg-[#84AE84]/90 text-white font-medium rounded-xl text-sm">
                {selectedDate && selectedTime ? 'Change Date' : 'Select Date'}
              </Button>
            </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Select Date & Time</DrawerTitle>
              <DrawerDescription>Choose your preferred appointment slot</DrawerDescription>
            </DrawerHeader>
            <div className="p-4  max-h-[60vh] overflow-y-auto">
              {dates.map(dateObj => (
                <div key={dateObj.date} className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">{dateObj.display}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(slot => (
                      <Button
                        key={`${dateObj.date}-${slot.time}`}
                        size="sm"
                        variant="outline"
                        disabled={!slot.available}
                        onClick={() => handleDateSelect(dateObj.date, slot.time)}
                        className={`${
                          slot.available 
                            ? slot.period === 'morning' 
                              ? 'border-blue-300 text-blue-700 hover:bg-blue-50' 
                              : 'border-orange-300 text-orange-700 hover:bg-orange-50'
                            : 'opacity-50 cursor-not-allowed bg-gray-100'
                        }`}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

          {/* Medical Records Drawer */}
          <Drawer open={showRecordsDrawer} onOpenChange={setShowRecordsDrawer}>
            <DrawerTrigger asChild>
              <Button className="h-12 bg-[#84AE84] hover:bg-[#84AE84]/90 text-white font-medium rounded-xl text-sm">
                Attach Medical
              </Button>
            </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Select Medical Records</DrawerTitle>
              <DrawerDescription>Choose records to share with the doctor</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {userRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No medical records found</p>
              ) : (
                <div className="space-y-3">
                  {userRecords.map(record => (
                    <Card 
                      key={record.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedRecords.find(r => r.id === record.id)
                          ? 'bg-green-50 border-green-300'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleRecordSelect(record)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{record.title}</h4>
                            <p className="text-xs text-gray-500">
                              {record.date.toLocaleDateString()}
                            </p>
                            {record.description && (
                              <p className="text-xs text-gray-600 mt-1">{record.description}</p>
                            )}
                          </div>
                          {selectedRecords.find(r => r.id === record.id) && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            <DrawerFooter>
              <Button onClick={handleSaveRecords} className="bg-[#84AE84] hover:bg-[#84AE84]/90">
                Save Selection ({selectedRecords.length})
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        </div>

        {/* Book Appointment - Full Width */}
        <Button 
          onClick={handleBookAppointment}
          className="w-full h-12 bg-[#84AE84] hover:bg-[#84AE84]/90 text-white font-medium rounded-xl"
        >
          Book Appointment
        </Button>

        {/* Go back link */}
        <div className="text-center pt-4">
          <button 
            onClick={handleGoBack}
            className="text-gray-400 text-sm underline"
          >
            Go back
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 mx-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Appointment Booked!</h3>
            <p className="text-gray-600 text-sm">
              Your appointment with {doctor.name} has been successfully scheduled.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
