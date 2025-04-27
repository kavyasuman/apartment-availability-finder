
import { useState } from "react";
import { addDays, subDays } from "date-fns";
import ApartmentSearch from "@/components/ApartmentSearch";
import AvailabilityResults from "@/components/AvailabilityResults";
import { getAvailabilityForDateRange } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

type SearchParams = {
  location: 'kadri' | 'bejai';
  date: Date;
  guestCount: number;
};

const Index = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [availabilityResults, setAvailabilityResults] = useState<{ date: Date, availableFlats: string[] }[] | null>(null);

  const handleSearch = (values: SearchParams) => {
    const results = getAvailabilityForDateRange(
      values.location,
      values.date,
      values.guestCount,
      2 // 2 days flexibility
    );
    
    setSearchParams(values);
    setAvailabilityResults(results);
    
    // Show toast notification
    toast({
      title: "Search complete!",
      description: `Showing available apartments for ${values.guestCount} guests.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-apartment-primary to-apartment-accent bg-clip-text text-transparent">
            Apartment Availability Finder
          </h1>
          <p className="mt-2 text-gray-600 max-w-lg mx-auto">
            Find available service apartments in Kadri and Bejai based on your travel dates and guest count.
          </p>
        </header>

        <ApartmentSearch onSearch={handleSearch} />

        {availabilityResults && searchParams && (
          <AvailabilityResults
            location={searchParams.location}
            results={availabilityResults}
            selectedDate={searchParams.date}
          />
        )}

        {!availabilityResults && (
          <div className="max-w-md mx-auto mt-20 text-center text-gray-500">
            <p>Use the form above to search for available apartments.</p>
            <p className="mt-2 text-sm">We'll show you options with 2 days of flexibility.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
