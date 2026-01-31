import { useState } from "react";
import { CaretDown, Check, X } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { Language, LANGUAGES } from "../types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";

interface StepLanguageProps {
  value?: Language[];
  onChange: (languages: Language[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function StepLanguage({ value = [], onChange, onContinue, onBack }: StepLanguageProps) {
  const [open, setOpen] = useState(false);
  
  const selectedLanguages = LANGUAGES.filter(l => value.includes(l.id));

  const toggleLanguage = (languageId: Language) => {
    if (value.includes(languageId)) {
      onChange(value.filter(id => id !== languageId));
    } else {
      onChange([...value, languageId]);
    }
  };

  const removeLanguage = (languageId: Language) => {
    onChange(value.filter(id => id !== languageId));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center justify-center size-2 rounded-full bg-red-500" />
        <span className="text-xs text-muted-foreground font-medium">Step 2</span>
        <span className="text-xs text-muted-foreground">Step 2 of 5</span>
      </div>
      
      <h2 className="text-lg font-semibold text-foreground mb-2">Choose Your Languages</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Select the languages of your articles/posts to target your audience.
      </p>

      {/* Language Selector */}
      <div className="space-y-4 p-4 rounded-xl bg-muted">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-12 bg-background border-border rounded-xl"
            >
              <span className="text-muted-foreground">
                {selectedLanguages.length === 0 
                  ? "Select languages..." 
                  : `${selectedLanguages.length} language${selectedLanguages.length > 1 ? 's' : ''} selected`
                }
              </span>
              <CaretDown className="size-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandList>
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {LANGUAGES.map((language) => {
                    const isSelected = value.includes(language.id);
                    return (
                      <CommandItem
                        key={language.id}
                        value={language.label}
                        onSelect={() => toggleLanguage(language.id)}
                        className="cursor-pointer"
                      >
                        <div className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}>
                          <Check className="size-3" />
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <span>{language.flag}</span>
                          <span>{language.label}</span>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected Languages */}
        {selectedLanguages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map((language) => (
              <Badge
                key={language.id}
                variant="secondary"
                className="gap-1.5 pl-2 pr-1 py-1.5 bg-background"
              >
                <span>{language.flag}</span>
                <span>{language.label}</span>
                <button
                  type="button"
                  onClick={() => removeLanguage(language.id)}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {selectedLanguages.length > 0 && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Check className="size-3 text-green-600" />
            {selectedLanguages.length} language{selectedLanguages.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>
    </div>
  );
}
