'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  SearchIcon,
  ImageIcon,
  FilmIcon,
  AudioLinesIcon,
  CheckCircle2Icon,
  Loader2Icon,
  FolderIcon,
  FileTextIcon,
} from 'lucide-react';


import { useMediaUploadContext } from '@/contexts/media-upload-context';
import type { ProjectAssetDto, ProjectAssetMediaType } from '@/lib/shcmea/types/asset';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@/lib/utils';

// ============================================================
// TYPES
// ============================================================

export interface AssetPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAsset: (asset: ProjectAssetDto) => void;
  /**
   * Filter by asset type (optional)
   * If not provided, shows all types with tabs
   */
  filterType?: 'IMAGE' | 'VIDEO' | 'AUDIO';
}

// ============================================================
// ASSET TYPE CONFIG
// ============================================================

const TYPE_CONFIG: Record<
  ProjectAssetMediaType,
  {
    icon: React.ReactNode;
    label: string;
    accept: string[];
  }
> = {
  IMAGE: {
    icon: <ImageIcon className="size-4" />,
    label: 'Images',
    accept: ['image/*'],
  },
  VIDEO: {
    icon: <FilmIcon className="size-4" />,
    label: 'Videos',
    accept: ['video/*'],
  },
  AUDIO: {
    icon: <AudioLinesIcon className="size-4" />,
    label: 'Audio',
    accept: ['audio/*'],
  },
  DOCUMENT: {
    icon: <FileTextIcon className="size-4" />,
    label: 'Documents',
    accept: ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'],
  },
};

// ============================================================
// COMPONENT
// ============================================================

export function AssetPickerModal({
  open,
  onOpenChange,
  onSelectAsset,
  filterType,
}: AssetPickerModalProps) {
  const { projectId } = useMediaUploadContext();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedAsset, setSelectedAsset] = React.useState<ProjectAssetDto | null>(null);
  const [activeTab, setActiveTab] = React.useState<ProjectAssetMediaType | 'ALL'>(
    filterType || 'ALL'
  );
  const [assets, setAssets] = React.useState<ProjectAssetDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch assets when modal opens or filters change
  React.useEffect(() => {
    if (open && projectId) {
      setIsLoading(true);
      // Simulate loading - in a real app this would fetch from API
      const timer = setTimeout(() => {
        setAssets([]); // No assets in mock mode
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, projectId, activeTab, searchQuery]);

  // Reset selection when modal closes
  React.useEffect(() => {
    if (!open) {
      setSelectedAsset(null);
      setSearchQuery('');
    }
  }, [open]);

  const handleSelect = () => {
    if (selectedAsset) {
      onSelectAsset(selectedAsset);
      onOpenChange(false);
    }
  };

  // Filter types to show based on filterType prop
  const availableTypes: (ProjectAssetMediaType | 'ALL')[] = filterType
    ? [filterType]
    : ['ALL', 'IMAGE', 'VIDEO', 'AUDIO'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select from Assets</DialogTitle>
          <DialogDescription>
            Choose an asset from your project library
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tabs (if no filter type) */}
        {!filterType && (
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ProjectAssetMediaType | 'ALL')}
          >
            <TabsList className="w-full">
              {availableTypes.map((type) => (
                <TabsTrigger key={type} value={type} className="flex-1">
                  {type === 'ALL' ? (
                    <>
                      <FolderIcon className="size-4 mr-1.5" />
                      All
                    </>
                  ) : (
                    <>
                      {TYPE_CONFIG[type].icon}
                      <span className="ml-1.5">{TYPE_CONFIG[type].label}</span>
                    </>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Asset Grid */}
        <ScrollArea className="flex-1 min-h-0 -mx-6 px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderIcon className="size-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? 'No assets match your search'
                  : 'No assets found in this project'}
              </p>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-primary"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-2">
              {assets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  isSelected={selectedAsset?.id === asset.id}
                  onSelect={() => setSelectedAsset(asset)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {selectedAsset ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-green-500" />
                {selectedAsset.name}
              </span>
            ) : (
              'Select an asset to insert'
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedAsset}>
              Insert Asset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// ASSET CARD
// ============================================================

function AssetCard({
  asset,
  isSelected,
  onSelect,
}: {
  asset: ProjectAssetDto;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const thumbnailUrl = asset.thumbnailUrl || asset.cdnUrl;
  const isImage = asset.type === 'IMAGE';
  const isVideo = asset.type === 'VIDEO';
  const isAudio = asset.type === 'AUDIO';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
        'hover:ring-2 hover:ring-primary/50',
        isSelected
          ? 'border-primary ring-2 ring-primary'
          : 'border-border hover:border-primary/50'
      )}
    >
      {/* Thumbnail/Preview */}
      {isImage && thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={asset.altText || asset.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 33vw, 25vw"
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-muted/50">
          {isVideo && <FilmIcon className="size-8 text-muted-foreground" />}
          {isAudio && <AudioLinesIcon className="size-8 text-muted-foreground" />}
          {!isVideo && !isAudio && (
            <ImageIcon className="size-8 text-muted-foreground" />
          )}
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 bg-primary rounded-full p-0.5">
          <CheckCircle2Icon className="size-4 text-primary-foreground" />
        </div>
      )}

      {/* Name overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="text-xs text-white truncate">{asset.name}</p>
      </div>
    </button>
  );
}

