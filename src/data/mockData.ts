import { Availability, Flat, Location } from "@/types/apartment";
import { addDays, format, parse, parseISO } from "date-fns";

// Define the flats
export const flats: Flat[] = [
  { id: '101', name: 'Flat 101', location: 'kadri', capacity: 3 },
  { id: '102', name: 'Flat 102', location: 'kadri', capacity: 2 },
  { id: '201', name: 'Flat 201', location: 'kadri', capacity: 4 },
  { id: '202', name: 'Flat 202', location: 'kadri', capacity: 2 },
  { id: '302', name: 'Flat 302', location: 'kadri', capacity: 3 },
  { id: '101', name: 'Flat 101', location: 'bejai', capacity: 2 },
  { id: '102', name: 'Flat 102', location: 'bejai', capacity: 3 },
  { id: '201', name: 'Flat 201', location: 'bejai', capacity: 4 },
  { id: '202', name: 'Flat 202', location: 'bejai', capacity: 2 },
  { id: '302', name: 'Flat 302', location: 'bejai', capacity: 3 },
];

// Generate sample data for the current month (April 2023)
const generateAprilData = (location: 'kadri' | 'bejai'): Availability[] => {
  const data: Availability[] = [];
  const daysInApril = 30;
  
  for (let day = 1; day <= daysInApril; day++) {
    const date = `2025-04-${day.toString().padStart(2, '0')}`;
    const parsedDate = parseISO(date);
    const dayName = format(parsedDate, 'EEE');
    
    const flatAvailability: { [flatId: string]: { available: boolean, guestCount: number, guestName?: string, amount?: number }} = {};
    
    flats.filter(flat => flat.location === location).forEach(flat => {
      // Generate random availability
      // Weekend days (Friday, Saturday) are less likely to be available
      const isWeekend = dayName === 'Fri' || dayName === 'Sat';
      const randomAvailable = Math.random() > (isWeekend ? 0.7 : 0.4);
      
      flatAvailability[flat.id] = {
        available: randomAvailable,
        guestCount: randomAvailable ? 0 : Math.floor(Math.random() * flat.capacity) + 1,
        guestName: randomAvailable ? undefined : `Guest ${Math.floor(Math.random() * 100)}`,
        amount: randomAvailable ? undefined : Math.floor(Math.random() * 2000) + 1000
      };
    });
    
    data.push({
      date,
      day: dayName,
      flatAvailability
    });
  }
  
  return data;
};

export const kadriAprilData = generateAprilData('kadri');
export const bejaiAprilData = generateAprilData('bejai');

export const getDataByLocation = (location: Location) => {
  if (location === 'all') {
    // For 'all', return combined data from both locations
    return [...kadriAprilData, ...bejaiAprilData];
  }
  return location === 'kadri' ? kadriAprilData : bejaiAprilData;
};

export const getFlatsByLocation = (location: Location) => {
  if (location === 'all') {
    // For 'all', return all flats
    return flats;
  }
  return flats.filter(flat => flat.location === location);
};

export const getAvailabilityForDateRange = (
  location: Location, 
  date: Date, 
  guestCount: number,
  daysFlexibility: number = 2
): { date: Date, availableFlats: string[] }[] => {
  const result: { date: Date, availableFlats: string[] }[] = [];
  
  // Calculate the start and end dates with flexibility
  const startDate = addDays(date, -daysFlexibility);
  const endDate = addDays(date, daysFlexibility);
  
  for (let i = 0; i <= daysFlexibility * 2; i++) {
    const currentDate = addDays(startDate, i);
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    if (location === 'all') {
      // Handle both locations for 'all'
      const kadriData = kadriAprilData.find(d => d.date === formattedDate);
      const bejaiData = bejaiAprilData.find(d => d.date === formattedDate);
      
      const availableFlats: string[] = [];
      
      // Process Kadri flats
      if (kadriData) {
        const kadriFlats = flats.filter(flat => flat.location === 'kadri');
        kadriFlats.forEach(flat => {
          const flatData = kadriData.flatAvailability[flat.id];
          if (flatData && flatData.available && flat.capacity >= guestCount) {
            availableFlats.push(`kadri-${flat.id}`);
          }
        });
      }
      
      // Process Bejai flats
      if (bejaiData) {
        const bejaiFlats = flats.filter(flat => flat.location === 'bejai');
        bejaiFlats.forEach(flat => {
          const flatData = bejaiData.flatAvailability[flat.id];
          if (flatData && flatData.available && flat.capacity >= guestCount) {
            availableFlats.push(`bejai-${flat.id}`);
          }
        });
      }
      
      result.push({
        date: currentDate,
        availableFlats
      });
    } else {
      // Original logic for single location
      const locationData = location === 'kadri' ? kadriAprilData : bejaiAprilData;
      const flatsInLocation = flats.filter(flat => flat.location === location);
      
      // Find the availability data for this date
      const availabilityData = locationData.find(d => d.date === formattedDate);
      
      if (availabilityData) {
        const availableFlats = flatsInLocation
          .filter(flat => {
            const flatData = availabilityData.flatAvailability[flat.id];
            return flatData && flatData.available && flat.capacity >= guestCount;
          })
          .map(flat => flat.id);
        
        result.push({
          date: currentDate,
          availableFlats
        });
      } else {
        // If no data for this date, assume no flats available
        result.push({
          date: currentDate,
          availableFlats: []
        });
      }
    }
  }
  
  return result;
};
