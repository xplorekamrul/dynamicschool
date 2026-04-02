"use client";

import { cn } from "@/lib/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

export interface InfiniteScrollOption {
   value: string;
   label: string;
   icon?: React.ComponentType<{ className?: string }>;
   disabled?: boolean;
   [key: string]: any;
}

export interface InfiniteScrollMultiSelectProps {
   value?: string[];
   onValueChange: (values: string[]) => void;
   placeholder?: string;
   className?: string;
   searchable?: boolean;
   searchPlaceholder?: string;
   disabled?: boolean;
   onOpen?: () => void;
   onClose?: () => void;
   onLoadMore?: (searchQuery: string) => Promise<InfiniteScrollOption[]>;
   onSearchChange?: (searchQuery: string) => void;
   isLoading?: boolean;
   hasMore?: boolean;
   emptyMessage?: string;
   renderTag?: (option: InfiniteScrollOption, onRemove: () => void) => React.ReactNode;
   initialOptions?: InfiniteScrollOption[];
}

export function InfiniteScrollMultiSelect({
   value = [],
   onValueChange,
   placeholder = "Select options...",
   className,
   searchable = true,
   searchPlaceholder = "Search...",
   disabled = false,
   onOpen,
   onClose,
   onLoadMore,
   onSearchChange,
   hasMore = true,
   emptyMessage = "No results found",
   renderTag,
   initialOptions = [],
}: InfiniteScrollMultiSelectProps) {
   const [open, setOpen] = React.useState(false);
   const [searchQuery, setSearchQuery] = React.useState("");
   const [options, setOptions] = React.useState<InfiniteScrollOption[]>([]);
   const [allLoadedOptions, setAllLoadedOptions] = React.useState<InfiniteScrollOption[]>(initialOptions);
   const [highlightedIndex, setHighlightedIndex] = React.useState(0);
   const [isLoadingMore, setIsLoadingMore] = React.useState(false);
   const [hasInitialized, setHasInitialized] = React.useState(initialOptions.length > 0);
   const triggerRef = React.useRef<HTMLButtonElement>(null);
   const inputRef = React.useRef<HTMLInputElement>(null);
   const optionsRef = React.useRef<(HTMLDivElement | null)[]>([]);
   const scrollContainerRef = React.useRef<HTMLDivElement>(null);

   // Handle open/close callbacks
   const handleOpenChange = React.useCallback(
      (isOpen: boolean) => {
         setOpen(isOpen);
         if (isOpen) {
            onOpen?.();
            // Show initial options if available
            if (initialOptions.length > 0 && options.length === 0) {
               setOptions(initialOptions);
            }
            // Load initial data when opening for the first time
            if (!hasInitialized && onLoadMore) {
               loadMoreOptions("");
               setHasInitialized(true);
            } else if (searchQuery === "" && options.length === 0 && allLoadedOptions.length > 0) {
               // If search was cleared, restore from cache
               setOptions(allLoadedOptions);
            }
         } else {
            onClose?.();
         }
      },
      [onOpen, onClose, hasInitialized, onLoadMore, searchQuery, options.length, allLoadedOptions, initialOptions]
   );

   // Load more options
   const loadMoreOptions = React.useCallback(
      async (query: string) => {
         if (!onLoadMore || isLoadingMore) return;
         setIsLoadingMore(true);
         try {
            const newOptions = await onLoadMore(query);
            setOptions((prev) => {
               // Avoid duplicates
               const existingValues = new Set(prev.map((o) => o.value));
               const filtered = newOptions.filter((o) => !existingValues.has(o.value));
               return [...prev, ...filtered];
            });
            // Also update the all loaded options cache
            setAllLoadedOptions((prev) => {
               const existingValues = new Set(prev.map((o) => o.value));
               const filtered = newOptions.filter((o) => !existingValues.has(o.value));
               return [...prev, ...filtered];
            });
         } catch (error) {
            console.error("Error loading more options:", error);
         } finally {
            setIsLoadingMore(false);
         }
      },
      [onLoadMore, isLoadingMore]
   );

   // Handle search
   const handleSearch = React.useCallback(
      (query: string) => {
         setSearchQuery(query);
         if (query === "") {
            // If search is cleared, restore from cache
            setOptions(allLoadedOptions);
         } else {
            // New search - reset options
            setOptions([]);
         }
         onSearchChange?.(query);
         if (onLoadMore && query !== "") {
            loadMoreOptions(query);
         }
      },
      [onSearchChange, onLoadMore, loadMoreOptions, allLoadedOptions]
   );

   // Focus input when dropdown opens
   React.useEffect(() => {
      if (open && searchable && inputRef.current) {
         setTimeout(() => {
            inputRef.current?.focus();
         }, 0);
      } else if (!open) {
         // Don't clear search query when closing, only clear when explicitly needed
         setOptions(allLoadedOptions.length > 0 ? allLoadedOptions : []);
      }
   }, [open, searchable, allLoadedOptions]);

   // Handle option selection
   const handleSelectOption = React.useCallback(
      (option: InfiniteScrollOption) => {
         if (option.disabled) return;
         const newValue = value.includes(option.value)
            ? value.filter((v) => v !== option.value)
            : [...value, option.value];
         onValueChange(newValue);
      },
      [value, onValueChange]
   );

   // Handle remove tag
   const handleRemoveTag = React.useCallback(
      (optionValue: string) => {
         onValueChange(value.filter((v) => v !== optionValue));
      },
      [value, onValueChange]
   );

   // Keyboard navigation
   React.useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         switch (e.key) {
            case "ArrowDown":
               e.preventDefault();
               setHighlightedIndex((prev) =>
                  prev < options.length - 1 ? prev + 1 : 0
               );
               break;
            case "ArrowUp":
               e.preventDefault();
               setHighlightedIndex((prev) =>
                  prev > 0 ? prev - 1 : options.length - 1
               );
               break;
            case "Enter":
               e.preventDefault();
               if (options[highlightedIndex]) {
                  handleSelectOption(options[highlightedIndex]);
               }
               break;
            case "Escape":
               e.preventDefault();
               setOpen(false);
               break;
         }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
   }, [open, options, highlightedIndex, handleSelectOption]);

   // Scroll highlighted option into view
   React.useEffect(() => {
      if (open && optionsRef.current[highlightedIndex]) {
         optionsRef.current[highlightedIndex]?.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
         });
      }
   }, [highlightedIndex, open]);

   // Handle infinite scroll
   const handleScroll = React.useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
         const target = e.currentTarget;
         const isNearBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight < 50;
         if (isNearBottom && hasMore && !isLoadingMore && onLoadMore) {
            loadMoreOptions(searchQuery);
         }
      },
      [hasMore, isLoadingMore, onLoadMore, searchQuery, loadMoreOptions]
   );

   // Get selected options for display - use allLoadedOptions to maintain cache
   const selectedOptions = React.useMemo(() => {
      return allLoadedOptions.filter((opt) => value.includes(opt.value));
   }, [allLoadedOptions, value]);

   const defaultRenderTag = (option: InfiniteScrollOption, onRemove: () => void) => (
      <div
         key={option.value}
         className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
      >
         <span>{option.label}</span>
         <button
            type="button"
            onClick={(e) => {
               e.stopPropagation();
               onRemove();
            }}
            className="hover:text-primary/70"
         >
            <X className="h-3 w-3" />
         </button>
      </div>
   );

   const renderTagFn = renderTag || defaultRenderTag;

   return (
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
         <PopoverPrimitive.Trigger asChild disabled={disabled}>
            <div
               className={cn(
                  "relative cursor-pointer border focus-within:border-ring focus-within:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex w-full items-center justify-between gap-2 rounded-md bg-white px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-[3px] min-h-9",
                  disabled && "cursor-not-allowed opacity-50",
                  className
               )}
            >
               <button
                  ref={triggerRef}
                  type="button"
                  role="combobox"
                  aria-expanded={open}
                  aria-haspopup="listbox"
                  aria-disabled={disabled}
                  disabled={disabled}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  tabIndex={-1}
               />

               <div className="flex flex-wrap gap-1 flex-1">
                  {value.length > 0 ? (
                     selectedOptions.map((option) =>
                        renderTagFn(option, () => handleRemoveTag(option.value))
                     )
                  ) : (
                     <span className="text-muted-foreground">{placeholder}</span>
                  )}
               </div>

               <ChevronDown
                  className={cn(
                     "w-4 h-4 shrink-0 opacity-50 transition-transform pointer-events-none",
                     open && "rotate-180"
                  )}
               />
            </div>
         </PopoverPrimitive.Trigger>

         <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
               role="listbox"
               align="start"
               sideOffset={4}
               className={cn(
                  "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-(--radix-popover-trigger-width) rounded-md border shadow-md outline-none"
               )}
               onOpenAutoFocus={(e: Event) => {
                  e.preventDefault();
               }}
            >
               <div className="p-2 space-y-2">
                  {searchable && (
                     <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        disabled={disabled}
                        className="w-full px-2 py-1.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/50"
                     />
                  )}

                  <div
                     ref={scrollContainerRef}
                     className="max-h-[300px] overflow-y-auto space-y-0.5"
                     onScroll={handleScroll}
                  >
                     {options.length === 0 && !isLoadingMore ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                           {emptyMessage}
                        </div>
                     ) : (
                        options.map((option, index) => {
                           const isSelected = value.includes(option.value);
                           const isHighlighted = index === highlightedIndex;

                           return (
                              <div
                                 key={option.value}
                                 ref={(el) => {
                                    optionsRef.current[index] = el;
                                 }}
                                 role="option"
                                 aria-selected={isSelected}
                                 aria-disabled={option.disabled}
                                 data-highlighted={isHighlighted}
                                 onClick={() => handleSelectOption(option)}
                                 className={cn(
                                    "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none transition-colors",
                                    isHighlighted && "bg-accent text-accent-foreground",
                                    !isHighlighted && "hover:bg-accent/50",
                                    option.disabled &&
                                    "pointer-events-none opacity-50 cursor-not-allowed",
                                    isSelected && "pr-8"
                                 )}
                              >
                                 <div className="flex items-center gap-2 flex-1">
                                    {option.icon && <option.icon className="w-4 h-4" />}
                                    <span>{option.label}</span>
                                 </div>
                                 {isSelected && (
                                    <Check className="absolute right-2 w-4 h-4" />
                                 )}
                              </div>
                           );
                        })
                     )}

                     {isLoadingMore && (
                        <div className="py-2 text-center text-sm text-muted-foreground">
                           Loading...
                        </div>
                     )}
                  </div>
               </div>
            </PopoverPrimitive.Content>
         </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
   );
}
