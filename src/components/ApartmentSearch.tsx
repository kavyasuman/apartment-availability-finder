import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Location } from "@/types/apartment";

const formSchema = z.object({
  location: z.enum(["all", "kadri", "bejai"] as const),
  date: z.date({
    required_error: "Please select a date.",
  }),
  guestCount: z.coerce
    .number()
    .min(1, { message: "Must have at least 1 guest." })
    .max(10, { message: "Maximum 10 guests allowed." }),
});

type FormValues = z.infer<typeof formSchema>;

type ApartmentSearchProps = {
  onSearch: (values: FormValues) => void;
};

export default function ApartmentSearch({ onSearch }: ApartmentSearchProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "all",
      guestCount: 1,
    },
  });

  function onSubmit(values: FormValues) {
    onSearch(values);
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Find Available Apartments</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all" className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-gradient-to-r from-apartment-kadri to-apartment-bejai mr-2"></div>
                      <span>All Locations</span>
                    </SelectItem>
                    <SelectItem value="kadri" className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-apartment-kadri mr-2"></div>
                      <span>Kadri</span>
                    </SelectItem>
                    <SelectItem value="bejai" className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-apartment-bejai mr-2"></div>
                      <span>Bejai</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select "All Locations" to view availability across both Kadri and Bejai. For specific location availability, select either Kadri or Bejai.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  We'll show availability for this date (±2 days).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Enter the number of guests (1-10).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-gradient-to-r from-apartment-primary to-apartment-accent hover:from-apartment-accent hover:to-apartment-primary">
            Find Available Apartments
          </Button>
        </form>
      </Form>
    </div>
  );
}
