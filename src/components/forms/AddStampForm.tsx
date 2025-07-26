'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ImageUploader } from "../ui/ImageUploader";
import { addStamp } from "@/actions/stamps";
import { useTransition } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  country: z.string().min(2, { message: "Country is required." }),
  year: z.coerce.number().min(1840, { message: "Year must be after 1840." }),
  condition: z.string({ required_error: "Please select a condition." }),
  denomination: z.string().min(1, { message: "Denomination is required." }),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required.").max(3, "You can only upload a maximum of 3 images."),
  catalogNumber: z.string().optional(),
  theme: z.string().optional(),
  acquisitionDate: z.date().optional(),
  purchasePrice: z.coerce.number().optional(),
  seller: z.string().optional(),
  taxes: z.coerce.number().optional(),
  shipping: z.coerce.number().optional(),
  currentValuation: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export function AddStampForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      country: "",
      year: undefined,
      catalogNumber: "",
      denomination: "",
      theme: "",
      seller: "",
      notes: "",
      images: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value) && key === 'images') {
        value.forEach(file => formData.append('images', file));
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      const result = await addStamp(formData);
      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  }

  function onSaveAsDraft() {
    const values = form.getValues();
    console.log("Saved as draft:", values);
    toast.info("Draft saved!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images *</FormLabel>
              <FormControl>
                <ImageUploader onFilesChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Penny Black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., United Kingdom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 1840" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mint">Mint</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="on-cover">On Cover</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="denomination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Denomination *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1d" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="catalogNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catalog Number (Scott, etc.)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., SG1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentValuation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Valuation</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 15.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
              control={form.control}
              name="acquisitionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Acquisition Date</FormLabel>
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1800-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes about the stamp..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onSaveAsDraft} disabled={isPending}>
                Save as Draft
            </Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Adding...' : 'Add Stamp'}</Button>
        </div>
      </form>
    </Form>
  );
}
