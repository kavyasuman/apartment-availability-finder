
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flat, Location } from "@/types/apartment";
import { getFlatsByLocation } from "@/data/mockData";
import { CheckCheck, MapPin } from "lucide-react";

type AvailabilityResultsProps = {
  location: Location;
  results: { date: Date; availableFlats: string[] }[];
  selectedDate: Date;
};

export default function AvailabilityResults({
  location,
  results,
  selectedDate
}: AvailabilityResultsProps) {
  const flats = getFlatsByLocation(location);
  const locationColor = "apartment-kadri"; // Consistently use green

  // Sort results by date
  const sortedResults = [...results].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Get unique available flats across all dates
  const allAvailableFlats = Array.from(
    new Set(
      sortedResults.flatMap(result => result.availableFlats)
    )
  );

  if (allAvailableFlats.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card className="border-2 border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">No Availability</CardTitle>
            <CardDescription>
              We couldn't find any available apartments for the selected dates and guest count.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p>Try adjusting your search criteria:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>Select different dates</li>
              <li>Reduce the number of guests</li>
              <li>Check the other location</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getFlatDisplayInfo = (flatId: string) => {
    // For the 'all' location option, we prefixed the IDs with location-
    if (location === 'all' && flatId.includes('-')) {
      const [locationPart, idPart] = flatId.split('-');
      return {
        id: idPart,
        location: locationPart as 'kadri' | 'bejai',
        displayName: `${locationPart.charAt(0).toUpperCase() + locationPart.slice(1)} - Flat ${idPart}`
      };
    }
    
    return {
      id: flatId,
      location: location === 'all' ? 'kadri' : location, // Fallback
      displayName: `Flat ${flatId}`
    };
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Available Apartments {location !== 'all' && (
            <span className="text-apartment-kadri">
              at {location.charAt(0).toUpperCase() + location.slice(1)}
            </span>
          )}
        </h2>
        
        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-100 border-2 border-emerald-500 rounded"></div>
            <span className="text-sm">Available on selected date</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
            <span className="text-sm">Available on flexible dates</span>
          </div>
        </div>

        <p className="text-center mb-6 text-gray-600">
          Showing availability from {format(sortedResults[0].date, 'MMM dd')} to {format(sortedResults[sortedResults.length - 1].date, 'MMM dd')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allAvailableFlats.map(flatId => {
            const flatInfo = getFlatDisplayInfo(flatId);
            
            // Get available dates for this flat
            const availableDates = sortedResults
              .filter(result => result.availableFlats.includes(flatId))
              .map(result => result.date);
            
            // Is this flat available on the exact selected date?
            const exactDateResult = results.find(
              r => format(r.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
            );
            const availableOnExactDate = exactDateResult?.availableFlats.includes(flatId) || false;
            
            return (
              <Card 
                key={flatId}
                className={cn(
                  "overflow-hidden border-2",
                  availableOnExactDate ? "border-apartment-kadri" : "border-gray-200"
                )}
              >
                <CardHeader 
                  className={cn(
                    "relative",
                    availableOnExactDate ? "bg-apartment-kadri text-white" : "bg-gray-100"
                  )}
                >
                  <CardTitle className="flex items-center">
                    {flatInfo.displayName}
                    {availableOnExactDate && (
                      <CheckCheck className="ml-2 h-5 w-5" />
                    )}
                  </CardTitle>
                  {location === 'all' && (
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>{flatInfo.location.charAt(0).toUpperCase() + flatInfo.location.slice(1)}</span>
                    </div>
                  )}
                  <CardDescription 
                    className={availableOnExactDate ? "text-white/90" : ""}
                  >
                    Capacity: {flats.find(f => f.id === flatInfo.id)?.capacity || "N/A"} guests
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Available Dates:</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map(date => {
                      const isExactDate = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                      
                      return (
                        <Badge
                          key={date.toISOString()}
                          variant={isExactDate ? "default" : "outline"}
                          className={cn(
                            isExactDate ? "bg-apartment-kadri hover:bg-apartment-kadri/90" : "",
                            "text-xs"
                          )}
                        >
                          {format(date, 'MMM dd (EEE)')}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
