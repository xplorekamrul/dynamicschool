"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

interface DatePickerProps {
   value?: string;
   onChange?: (date: string) => void;
   placeholder?: string;
   disabled?: boolean;
}

export function DatePicker({
   value,
   onChange,
   placeholder = "Pick a date",
   disabled = false,
}: DatePickerProps) {
   const [date, setDate] = React.useState<Date | undefined>(
      value ? new Date(value) : undefined
   );

   const handleDateChange = (newDate: Date | undefined) => {
      setDate(newDate);
      if (newDate) {
         onChange?.(newDate.toISOString().split("T")[0]);
      }
   };

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               disabled={disabled}
               className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
               )}
            >
               <CalendarIcon className="mr-2 h-4 w-4" />
               {date ? format(date, "PPP") : placeholder}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0" align="start">
            <Calendar
               mode="single"
               selected={date}
               onSelect={handleDateChange}
               disabled={disabled}
            />
         </PopoverContent>
      </Popover>
   );
}
