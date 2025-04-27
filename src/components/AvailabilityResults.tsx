
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flat } from "@/types/apartment";
import { getFlatsByLocation } from "@/data/mockData";
import { CheckCheck } from "lucide-react";

type AvailabilityResultsProps = {
  location: 'kadri' | 'bejai';
  results: { date: Date; availableFlats: string[] }[];
  selectedDate: Date;
};

export default function AvailabilityResults({
  location,
  results,
  selectedDate
}: AvailabilityResultsProps) {
  const flats = getFlatsByLocation(location);
  const locationColor = location === 'kadri' ? 'apartment-kadri' : 'apartment-bejai';

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

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Available Apartments at <span className={`text-${locationColor}`}>{location.charAt(0).toUpperCase() + location.slice(1)}</span>
      </h2>
      <p className="text-center mb-6 text-gray-600">
        Showing availability from {format(sortedResults[0].date, 'MMM dd')} to {format(sortedResults[sortedResults.length - 1].date, 'MMM dd')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allAvailableFlats.map(flatId => {
          const flat = flats.find(f => f.id === flatId);
          
          if (!flat) return null;
          
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
                availableOnExactDate ? `border-${locationColor}` : "border-gray-200"
              )}
            >
              <CardHeader 
                className={cn(
                  "relative",
                  availableOnExactDate ? `bg-${locationColor} text-white` : "bg-gray-100"
                )}
              >
                <CardTitle className="flex items-center">
                  Flat {flatId}
                  {availableOnExactDate && (
                    <CheckCheck className="ml-2 h-5 w-5" />
                  )}
                </CardTitle>
                <CardDescription 
                  className={availableOnExactDate ? "text-white/90" : ""}
                >
                  Capacity: {flat.capacity} guests
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
                          isExactDate ? `bg-${locationColor} hover:bg-${locationColor}/90` : "",
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
  );
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
