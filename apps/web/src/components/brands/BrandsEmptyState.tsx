import { Button } from "@workspace/ui/components/button";
import { Plus, BriefcaseBusinessIcon, type LucideIcon } from "lucide-react";

interface BrandsEmptyStateProps {
  /** The icon to display in the empty state */
  icon?: LucideIcon;
  /** The heading text */
  title?: string;
  /** The description text */
  description: string;
  /** The button text */
  buttonText?: string;
  /** Callback when the create button is clicked */
  onCreateBrand: () => void;
}

/**
 * BrandsEmptyState Component
 * 
 * A reusable empty state card for brand pages.
 * Displays a centered card with an icon, title, description, and action button.
 * 
 * @component
 */
export function BrandsEmptyState({
  icon: Icon = BriefcaseBusinessIcon,
  title = "No brands yet",
  description,
  buttonText = "Create Brand",
  onCreateBrand,
}: BrandsEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col min-w-0 full-w">
      <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
        <div className="text-gray-300 dark:text-gray-600">
          <Icon className="h-12 w-12" />
        </div>
        <div className="flex flex-col items-center gap-y-6">
          <div className="flex flex-col items-center gap-y-2">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
              {description}
            </p>
          </div>
          <Button onClick={onCreateBrand} className="rounded-2xl gap-2">
            <Plus className="h-4 w-4" />
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
