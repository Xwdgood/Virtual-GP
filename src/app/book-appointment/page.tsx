"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { doctorsDatabase, searchAndFilterDoctors, sortDoctorsByDistance, sortDoctorsByCost, sortDoctorsByRating, DoctorFilters, getTimeSlotLabel } from "@/lib/doctorData";

export default function BookAppointmentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsDatabase);
  const [sortBy, setSortBy] = useState<'distance' | 'cost' | 'rating'>('distance');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [filters, setFilters] = useState<DoctorFilters>({
    gender: 'all',
    priceRange: { min: 0, max: 100 },
    maxDistance: 10,
    timeSlot: 'all'
  });
  // 临时过滤器状态（在drawer中编辑）
  const [tempFilters, setTempFilters] = useState<DoctorFilters>({
    gender: 'all',
    priceRange: { min: 0, max: 100 },
    maxDistance: 10,
    timeSlot: 'all'
  });
  const router = useRouter();

  useEffect(() => {
    let filteredDoctors = searchAndFilterDoctors(searchQuery, filters);
    
    // 应用排序
    switch (sortBy) {
      case 'distance':
        filteredDoctors = sortDoctorsByDistance(filteredDoctors);
        break;
      case 'cost':
        filteredDoctors = sortDoctorsByCost(filteredDoctors);
        break;
      case 'rating':
        filteredDoctors = sortDoctorsByRating(filteredDoctors);
        break;
    }
    
    setDoctors(filteredDoctors);
  }, [searchQuery, sortBy, filters]);

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleMoreDetails = (doctorId: string) => {
    // 这里可以导航到医生详情页面或显示更多信息
    alert(`More details for doctor ID: ${doctorId}`);
  };

  const handleBookAppointment = (doctorId: string, doctorName: string) => {
    router.push(`/doctor-detail/${doctorId}`);
  };

  // 打开过滤器drawer时，将当前过滤器复制到临时状态
  const handleOpenFilters = () => {
    setTempFilters({ ...filters });
    setShowFiltersDrawer(true);
  };

  // 保存过滤器设置
  const handleSaveFilters = () => {
    setFilters({ ...tempFilters });
    setShowFiltersDrawer(false);
  };

  // 清空过滤器
  const handleClearFilters = () => {
    const defaultFilters = {
      gender: 'all' as const,
      priceRange: { min: 0, max: 100 },
      maxDistance: 10,
      timeSlot: 'all' as const
    };
    setTempFilters(defaultFilters);
  };

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

      {/* Page Title */}
      <div className="pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-[#84AE84] tracking-wide mb-2 mt-10">BOOK AN APPOINTMENT</h1>
        <p className="text-gray-500 text-sm">Book a doctor to your preferences.</p>
      </div>

      {/* Search Section */}
      <div className="px-6 mb-4">
        {/* Location Icon and Search Bar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#84AE84] rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Enter location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#84AE84] focus:border-transparent bg-white"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <Drawer open={showFiltersDrawer} onOpenChange={setShowFiltersDrawer}>
            <DrawerTrigger asChild>
              <Button
                onClick={handleOpenFilters}
                className="flex items-center gap-2 bg-[#84AE84] hover:bg-[#84AE84]/90 text-white px-6 py-2 rounded-lg"
              >
                <span>Filters</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707l-2 2A1 1 0 0111 20v-6.586a1 1 0 00-.293-.707L4.293 7.293A1 1 0 014 6.586V4z" />
                </svg>
              </Button>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter Doctors</DrawerTitle>
                <DrawerDescription>
                  Adjust filters to find the perfect doctor for you
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Sort by */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Sort by:</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={sortBy === 'distance' ? 'default' : 'outline'}
                      onClick={() => setSortBy('distance')}
                      className={sortBy === 'distance' ? 'bg-[#84AE84] hover:bg-[#84AE84]/90' : ''}
                    >
                      Distance
                    </Button>
                    <Button
                      size="sm"
                      variant={sortBy === 'cost' ? 'default' : 'outline'}
                      onClick={() => setSortBy('cost')}
                      className={sortBy === 'cost' ? 'bg-[#84AE84] hover:bg-[#84AE84]/90' : ''}
                    >
                      Cost
                    </Button>
                    <Button
                      size="sm"
                      variant={sortBy === 'rating' ? 'default' : 'outline'}
                      onClick={() => setSortBy('rating')}
                      className={sortBy === 'rating' ? 'bg-[#84AE84] hover:bg-[#84AE84]/90' : ''}
                    >
                      Rating
                    </Button>
                  </div>
                </div>

                {/* Gender Filter */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Gender:</p>
                  <div className="flex gap-2">
                    {['all', 'male', 'female'].map((gender) => (
                      <Button
                        key={gender}
                        size="sm"
                        variant={tempFilters.gender === gender ? 'default' : 'outline'}
                        onClick={() => setTempFilters(prev => ({ ...prev, gender: gender as any }))}
                        className={tempFilters.gender === gender ? 'bg-[#84AE84] hover:bg-[#84AE84]/90' : ''}
                      >
                        {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Price Range: $0 - ${tempFilters.priceRange?.max}</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tempFilters.priceRange?.max || 100}
                    onChange={(e) => setTempFilters(prev => ({ 
                      ...prev, 
                      priceRange: { min: 0, max: parseInt(e.target.value) }
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#84AE84]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$100</span>
                  </div>
                </div>

                {/* Distance Filter */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Max Distance: {tempFilters.maxDistance}km</p>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={tempFilters.maxDistance || 10}
                    onChange={(e) => setTempFilters(prev => ({ 
                      ...prev, 
                      maxDistance: parseInt(e.target.value)
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#84AE84]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0km</span>
                    <span>20km</span>
                  </div>
                </div>

                {/* Available Time Slot */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Available Time:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['all', 'morning', 'afternoon', 'allday'].map((timeSlot) => (
                      <Button
                        key={timeSlot}
                        size="sm"
                        variant={tempFilters.timeSlot === timeSlot ? 'default' : 'outline'}
                        onClick={() => setTempFilters(prev => ({ ...prev, timeSlot: timeSlot as any }))}
                        className={tempFilters.timeSlot === timeSlot ? 'bg-[#84AE84] hover:bg-[#84AE84]/90' : ''}
                      >
                        {timeSlot === 'all' ? 'All' : getTimeSlotLabel(timeSlot)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <DrawerFooter>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={handleSaveFilters}
                    className="bg-[#84AE84] hover:bg-[#84AE84]/90"
                  >
                    Apply Filters
                  </Button>
                </div>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>


      </div>

      {/* Doctors List */}
      <div className="absolute top-57 left-0 right-0 bottom-16 overflow-y-auto px-6">
        <div className="space-y-4">
          {doctors.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500 mb-2">No doctors found</h3>
              <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            doctors.map((doctor) => (
                              <Card 
                  key={doctor.id} 
                  className="bg-white shadow-lg border-none rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => handleBookAppointment(doctor.id, doctor.name)}
                >
                <CardContent className="p-0">
                  {/* Doctor Header */}
                  <div className="bg-[#84AE84] p-4 text-white relative">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full overflow-hidden">
                        <img 
                          src={doctor.avatar} 
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{doctor.name}</h3>
                        <p className="text-white/90 text-sm">{doctor.specialty}</p>
                        <p className="text-white/80 text-xs">{doctor.gender === 'male' ? '👨‍⚕️ Male Doctor' : '👩‍⚕️ Female Doctor'}</p>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      <span className="font-medium">Earliest Available:</span>
                      <span className="text-gray-600">{formatDate(doctor.earliestAvailable)}</span>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm">
                      <span className="w-2 h-2 bg-black rounded-full mt-1.5 flex-shrink-0"></span>
                      <div>
                        <span className="font-medium">Location: </span>
                        <span className="text-gray-600">{doctor.location}</span>
                      </div>
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

                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      <span className="font-medium">Available Time:</span>
                      <span className="text-gray-600">
                        {doctor.availableTimeSlots.map(slot => getTimeSlotLabel(slot)).join(', ')}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreDetails(doctor.id);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-none"
                        variant="outline"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        More Details
                      </Button>
                      
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookAppointment(doctor.id, doctor.name);
                        }}
                        className="flex-1 bg-[#84AE84] hover:bg-[#84AE84]/90 text-white"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Bottom Terms */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <button className="text-gray-400 text-sm underline">
          View Terms and Conditions
        </button>
      </div>
    </div>
  );
}
