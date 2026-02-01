'use client'

import { useState, useMemo } from 'react'
import { Check, Search } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Input } from '@workspace/ui/components/input'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@workspace/ui/components/tooltip'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// Import all custom icons from icons.tsx
import {
  UsersIcon,
  SettingsIcon,
  SearchIcon,
  AgentIcon,
  ApiIcon,
  ConditionalIcon,
  AirplaneIcon,
  WorkIcon,
  WorkflowIcon,
  WarnIcon,
  UploadIcon,
  TrashIcon,
  StudentIcon,
  SignalIcon,
  SectionIcon,
  ReminderIcon,
  DatabaseIcon,
  CrateIcon,
  CookieIcon,
  ErrorIcon,
  ChromeIcon,
  CalendarIcon,
  MessagesIcon,
  NotificationsIcon,
  MailIcon,
  CodeIcon,
  ChartBarIcon,
  AtomIcon,
  ElevatorIcon,
  DollarIcon,
  CreditCardIcon,
  BoatIcon,
  CancelIcon,
  BankIcon,
  AmbulanceIcon,
  ComponentIcon,
  BrightIcon,
  CrewAIIcon,
  HubspotIcon,
  SalesforceIcon,
  FirecrawlIcon,
  JinaAIIcon,
  TranslateIcon,
  SlackIcon,
  GithubIcon,
  SerperIcon,
  TavilyIcon,
  ConnectIcon,
  YouTubeIcon,
  PerplexityIcon,
  NotionIcon,
  GmailIcon,
  GoogleDriveIcon,
  xAIIcon,
  xIcon,
  GoogleSheetsIcon,
  S3Icon,
  GoogleIcon,
  DiscordIcon,
  CrunchbaseIcon,
  InputIcon,
  StartIcon,
  PineconeIcon,
  OpenAIIcon,
  ExaAIIcon,
  RedditIcon,
  AirtableIcon,
  GoogleDocsIcon,
  GoogleCalendarIcon,
  SupabaseIcon,
  WhatsAppIcon,
  StripeIcon,
  EyeIcon,
  ConfluenceIcon,
  TwilioIcon,
  TypeformIcon,
  DocumentIcon,
  MistralIcon,
  BrainIcon,
  StagehandIcon,
  BrowserUseIcon,
  Mem0Icon,
  ElevenLabsIcon,
  LinkupIcon,
  JiraIcon,
  LinearIcon,
  TelegramIcon,
  ClayIcon,
  MicrosoftIcon,
  MicrosoftTeamsIcon,
  OutlookIcon,
  MicrosoftExcelIcon,
  PackageSearchIcon,
  HuggingFaceIcon,
  ResponseIcon,
  AnthropicIcon,
  AzureIcon,
  GroqIcon,
  DeepseekIcon,
  GeminiIcon,
  CerebrasIcon,
  OllamaIcon,
  WealthboxIcon,
  WebhookIcon,
  ScheduleIcon,
  QdrantIcon,
  ArxivIcon,
  WikipediaIcon,
  HunterIOIcon,
  MicrosoftOneDriveIcon,
  MicrosoftSharepointIcon,
  MicrosoftPlannerIcon,
  TrendingUpIcon,
  TargetIcon,
  LightbulbIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  CheckIcon as CustomCheckIcon,
  Spinner,
} from '@workspace/ui/components/icons'

interface IconsSectionProps {
  componentId: string | null
}

// Define all custom icons with their names
const CUSTOM_ICONS = [
  { name: 'UsersIcon', component: UsersIcon, category: 'UI' },
  { name: 'SettingsIcon', component: SettingsIcon, category: 'UI' },
  { name: 'SearchIcon', component: SearchIcon, category: 'UI' },
  { name: 'AgentIcon', component: AgentIcon, category: 'AI' },
  { name: 'ApiIcon', component: ApiIcon, category: 'Development' },
  { name: 'ConditionalIcon', component: ConditionalIcon, category: 'Development' },
  { name: 'AirplaneIcon', component: AirplaneIcon, category: 'Travel' },
  { name: 'WorkIcon', component: WorkIcon, category: 'Business' },
  { name: 'WorkflowIcon', component: WorkflowIcon, category: 'Development' },
  { name: 'WarnIcon', component: WarnIcon, category: 'Status' },
  { name: 'UploadIcon', component: UploadIcon, category: 'UI' },
  { name: 'TrashIcon', component: TrashIcon, category: 'UI' },
  { name: 'StudentIcon', component: StudentIcon, category: 'People' },
  { name: 'SignalIcon', component: SignalIcon, category: 'Status' },
  { name: 'SectionIcon', component: SectionIcon, category: 'UI' },
  { name: 'ReminderIcon', component: ReminderIcon, category: 'UI' },
  { name: 'DatabaseIcon', component: DatabaseIcon, category: 'Development' },
  { name: 'CrateIcon', component: CrateIcon, category: 'Objects' },
  { name: 'CookieIcon', component: CookieIcon, category: 'Objects' },
  { name: 'ErrorIcon', component: ErrorIcon, category: 'Status' },
  { name: 'ChromeIcon', component: ChromeIcon, category: 'Brands' },
  { name: 'CalendarIcon', component: CalendarIcon, category: 'UI' },
  { name: 'MessagesIcon', component: MessagesIcon, category: 'Communication' },
  { name: 'NotificationsIcon', component: NotificationsIcon, category: 'UI' },
  { name: 'MailIcon', component: MailIcon, category: 'Communication' },
  { name: 'CodeIcon', component: CodeIcon, category: 'Development' },
  { name: 'ChartBarIcon', component: ChartBarIcon, category: 'Charts' },
  { name: 'AtomIcon', component: AtomIcon, category: 'Science' },
  { name: 'ElevatorIcon', component: ElevatorIcon, category: 'Objects' },
  { name: 'DollarIcon', component: DollarIcon, category: 'Finance' },
  { name: 'CreditCardIcon', component: CreditCardIcon, category: 'Finance' },
  { name: 'BoatIcon', component: BoatIcon, category: 'Travel' },
  { name: 'CancelIcon', component: CancelIcon, category: 'UI' },
  { name: 'BankIcon', component: BankIcon, category: 'Finance' },
  { name: 'AmbulanceIcon', component: AmbulanceIcon, category: 'Medical' },
  { name: 'ComponentIcon', component: ComponentIcon, category: 'Development' },
  { name: 'BrightIcon', component: BrightIcon, category: 'UI' },
  { name: 'CrewAIIcon', component: CrewAIIcon, category: 'AI' },
  { name: 'HubspotIcon', component: HubspotIcon, category: 'Brands' },
  { name: 'SalesforceIcon', component: SalesforceIcon, category: 'Brands' },
  { name: 'FirecrawlIcon', component: FirecrawlIcon, category: 'AI' },
  { name: 'JinaAIIcon', component: JinaAIIcon, category: 'AI' },
  { name: 'TranslateIcon', component: TranslateIcon, category: 'UI' },
  { name: 'SlackIcon', component: SlackIcon, category: 'Brands' },
  { name: 'GithubIcon', component: GithubIcon, category: 'Brands' },
  { name: 'SerperIcon', component: SerperIcon, category: 'AI' },
  { name: 'TavilyIcon', component: TavilyIcon, category: 'AI' },
  { name: 'ConnectIcon', component: ConnectIcon, category: 'UI' },
  { name: 'YouTubeIcon', component: YouTubeIcon, category: 'Brands' },
  { name: 'PerplexityIcon', component: PerplexityIcon, category: 'AI' },
  { name: 'NotionIcon', component: NotionIcon, category: 'Brands' },
  { name: 'GmailIcon', component: GmailIcon, category: 'Brands' },
  { name: 'GoogleDriveIcon', component: GoogleDriveIcon, category: 'Brands' },
  { name: 'xAIIcon', component: xAIIcon, category: 'AI' },
  { name: 'xIcon', component: xIcon, category: 'Brands' },
  { name: 'GoogleSheetsIcon', component: GoogleSheetsIcon, category: 'Brands' },
  { name: 'S3Icon', component: S3Icon, category: 'Brands' },
  { name: 'GoogleIcon', component: GoogleIcon, category: 'Brands' },
  { name: 'DiscordIcon', component: DiscordIcon, category: 'Brands' },
  { name: 'CrunchbaseIcon', component: CrunchbaseIcon, category: 'Brands' },
  { name: 'InputIcon', component: InputIcon, category: 'UI' },
  { name: 'StartIcon', component: StartIcon, category: 'UI' },
  { name: 'PineconeIcon', component: PineconeIcon, category: 'AI' },
  { name: 'OpenAIIcon', component: OpenAIIcon, category: 'AI' },
  { name: 'ExaAIIcon', component: ExaAIIcon, category: 'AI' },
  { name: 'RedditIcon', component: RedditIcon, category: 'Brands' },
  { name: 'AirtableIcon', component: AirtableIcon, category: 'Brands' },
  { name: 'GoogleDocsIcon', component: GoogleDocsIcon, category: 'Brands' },
  { name: 'GoogleCalendarIcon', component: GoogleCalendarIcon, category: 'Brands' },
  { name: 'SupabaseIcon', component: SupabaseIcon, category: 'Brands' },
  { name: 'WhatsAppIcon', component: WhatsAppIcon, category: 'Brands' },
  { name: 'StripeIcon', component: StripeIcon, category: 'Brands' },
  { name: 'EyeIcon', component: EyeIcon, category: 'UI' },
  { name: 'ConfluenceIcon', component: ConfluenceIcon, category: 'Brands' },
  { name: 'TwilioIcon', component: TwilioIcon, category: 'Brands' },
  { name: 'TypeformIcon', component: TypeformIcon, category: 'Brands' },
  { name: 'DocumentIcon', component: DocumentIcon, category: 'UI' },
  { name: 'MistralIcon', component: MistralIcon, category: 'AI' },
  { name: 'BrainIcon', component: BrainIcon, category: 'AI' },
  { name: 'StagehandIcon', component: StagehandIcon, category: 'AI' },
  { name: 'BrowserUseIcon', component: BrowserUseIcon, category: 'AI' },
  { name: 'Mem0Icon', component: Mem0Icon, category: 'AI' },
  { name: 'ElevenLabsIcon', component: ElevenLabsIcon, category: 'AI' },
  { name: 'LinkupIcon', component: LinkupIcon, category: 'AI' },
  { name: 'JiraIcon', component: JiraIcon, category: 'Brands' },
  { name: 'LinearIcon', component: LinearIcon, category: 'Brands' },
  { name: 'TelegramIcon', component: TelegramIcon, category: 'Brands' },
  { name: 'ClayIcon', component: ClayIcon, category: 'Brands' },
  { name: 'MicrosoftIcon', component: MicrosoftIcon, category: 'Brands' },
  { name: 'MicrosoftTeamsIcon', component: MicrosoftTeamsIcon, category: 'Brands' },
  { name: 'OutlookIcon', component: OutlookIcon, category: 'Brands' },
  { name: 'MicrosoftExcelIcon', component: MicrosoftExcelIcon, category: 'Brands' },
  { name: 'PackageSearchIcon', component: PackageSearchIcon, category: 'UI' },
  { name: 'HuggingFaceIcon', component: HuggingFaceIcon, category: 'AI' },
  { name: 'ResponseIcon', component: ResponseIcon, category: 'AI' },
  { name: 'AnthropicIcon', component: AnthropicIcon, category: 'AI' },
  { name: 'AzureIcon', component: AzureIcon, category: 'Brands' },
  { name: 'GroqIcon', component: GroqIcon, category: 'AI' },
  { name: 'DeepseekIcon', component: DeepseekIcon, category: 'AI' },
  { name: 'GeminiIcon', component: GeminiIcon, category: 'AI' },
  { name: 'CerebrasIcon', component: CerebrasIcon, category: 'AI' },
  { name: 'OllamaIcon', component: OllamaIcon, category: 'AI' },
  { name: 'WealthboxIcon', component: WealthboxIcon, category: 'Brands' },
  { name: 'WebhookIcon', component: WebhookIcon, category: 'Development' },
  { name: 'ScheduleIcon', component: ScheduleIcon, category: 'UI' },
  { name: 'QdrantIcon', component: QdrantIcon, category: 'AI' },
  { name: 'ArxivIcon', component: ArxivIcon, category: 'Brands' },
  { name: 'WikipediaIcon', component: WikipediaIcon, category: 'Brands' },
  { name: 'HunterIOIcon', component: HunterIOIcon, category: 'Brands' },
  { name: 'MicrosoftOneDriveIcon', component: MicrosoftOneDriveIcon, category: 'Brands' },
  { name: 'MicrosoftSharepointIcon', component: MicrosoftSharepointIcon, category: 'Brands' },
  { name: 'MicrosoftPlannerIcon', component: MicrosoftPlannerIcon, category: 'Brands' },
  { name: 'TrendingUpIcon', component: TrendingUpIcon, category: 'Charts' },
  { name: 'TargetIcon', component: TargetIcon, category: 'UI' },
  { name: 'LightbulbIcon', component: LightbulbIcon, category: 'UI' },
  { name: 'MapPinIcon', component: MapPinIcon, category: 'UI' },
  { name: 'ClockIcon', component: ClockIcon, category: 'UI' },
  { name: 'StarIcon', component: StarIcon, category: 'UI' },
  { name: 'CheckIcon', component: CustomCheckIcon, category: 'UI' },
]

// SVG icons from public/icons folder - organized by category
const SVG_ICONS = [
  // AI Providers
  { name: 'openai', path: '/icons/openai.svg', category: 'AI Providers' },
  { name: 'anthropic', path: '/icons/anthropic.svg', category: 'AI Providers' },
  { name: 'gemini', path: '/icons/gemini.svg', category: 'AI Providers' },
  { name: 'deepseek', path: '/icons/deepseek.svg', category: 'AI Providers' },
  { name: 'mistral', path: '/icons/mistral.svg', category: 'AI Providers' },
  { name: 'groq', path: '/icons/groq.svg', category: 'AI Providers' },
  { name: 'cerebras', path: '/icons/cerebras.svg', category: 'AI Providers' },
  { name: 'ollama', path: '/icons/ollama.svg', category: 'AI Providers' },
  { name: 'xai', path: '/icons/xai.svg', category: 'AI Providers' },
  { name: 'perplexity', path: '/icons/perplexity.svg', category: 'AI Providers' },
  { name: 'huggingface', path: '/icons/huggingface.svg', category: 'AI Providers' },
  { name: 'together', path: '/icons/together.svg', category: 'AI Providers' },
  { name: 'vertexai', path: '/icons/vertexai.svg', category: 'AI Providers' },
  { name: 'workersai', path: '/icons/workersai.svg', category: 'AI Providers' },
  { name: 'zhipu', path: '/icons/zhipu.svg', category: 'AI Providers' },
  { name: 'yi', path: '/icons/yi.svg', category: 'AI Providers' },
  { name: 'wenxin', path: '/icons/wenxin.svg', category: 'AI Providers' },
  { name: 'yuanbao', path: '/icons/yuanbao.svg', category: 'AI Providers' },
  { name: 'voyage', path: '/icons/voyage.svg', category: 'AI Providers' },
  { name: 'upstage', path: '/icons/upstage.svg', category: 'AI Providers' },
  { name: 'xinference', path: '/icons/xinference.svg', category: 'AI Providers' },
  { name: 'vllm', path: '/icons/vllm.svg', category: 'AI Providers' },
  
  // AI Tools
  { name: 'windsurf', path: '/icons/windsurf.svg', category: 'AI Tools' },
  { name: 'v0', path: '/icons/v0.svg', category: 'AI Tools' },
  { name: 'trae', path: '/icons/trae.svg', category: 'AI Tools' },
  { name: 'youmind', path: '/icons/youmind.svg', category: 'AI Tools' },
  { name: 'zai', path: '/icons/zai.svg', category: 'AI Tools' },
  { name: 'viggle', path: '/icons/viggle.svg', category: 'AI Tools' },
  { name: 'vidu', path: '/icons/vidu.svg', category: 'AI Tools' },
  { name: 'udio', path: '/icons/udio.svg', category: 'AI Tools' },
  { name: 'tripo', path: '/icons/tripo.svg', category: 'AI Tools' },
  { name: 'turix', path: '/icons/turix.svg', category: 'AI Tools' },
  { name: 'tiangong', path: '/icons/tiangong.svg', category: 'AI Tools' },
  { name: 'topazlabs', path: '/icons/topazlabs.svg', category: 'AI Tools' },
  
  // Cloud & Infrastructure
  { name: 'vercel', path: '/icons/vercel.svg', category: 'Cloud' },
  { name: 'zeabur', path: '/icons/zeabur.svg', category: 'Cloud' },
  { name: 'volcengine', path: '/icons/volcengine.svg', category: 'Cloud' },
  { name: 'tencent', path: '/icons/tencent.svg', category: 'Cloud' },
  { name: 'tencentcloud', path: '/icons/tencentcloud.svg', category: 'Cloud' },
  { name: 'unstructured', path: '/icons/unstructured.svg', category: 'Cloud' },
  { name: 'vectorizerai', path: '/icons/vectorizerai.svg', category: 'Cloud' },
  { name: 'submodel', path: '/icons/submodel.svg', category: 'Cloud' },
  { name: 'tii', path: '/icons/tii.svg', category: 'Cloud' },
  { name: 'xuanyuan', path: '/icons/xuanyuan.svg', category: 'Cloud' },
  { name: 'zeroone', path: '/icons/zeroone.svg', category: 'Cloud' },
  
  // Integrations
  { name: 'zapier', path: '/icons/zapier.svg', category: 'Integrations' },
  { name: 'youtube', path: '/icons/youtube.svg', category: 'Social' },
  { name: 'tiktok', path: '/icons/tiktok.svg', category: 'Social' },
  { name: 'yandex', path: '/icons/yandex.svg', category: 'Search' },
]

// Get unique categories
const CUSTOM_CATEGORIES = [...new Set(CUSTOM_ICONS.map(i => i.category))].sort()
const SVG_CATEGORIES = [...new Set(SVG_ICONS.map(i => i.category))].sort()

export function IconsSection({ componentId }: IconsSectionProps) {
  return (
    <div className="space-y-12">
      <div id="custom-icons" className="scroll-mt-8">
        <CustomIconsSection />
      </div>
      <div id="svg-icons" className="scroll-mt-8">
        <SvgIconsSection />
      </div>
    </div>
  )
}

// ============================================================
// Custom Icons Section (React Components)
// ============================================================

function CustomIconsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null)

  const filteredIcons = useMemo(() => {
    return CUSTOM_ICONS.filter(icon => {
      const matchesSearch = searchQuery === '' || 
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || icon.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const copyImport = (iconName: string) => {
    const code = `import { ${iconName} } from '@/components/ui/icons'`
    navigator.clipboard.writeText(code)
    setCopiedIcon(iconName)
    setTimeout(() => setCopiedIcon(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-semibold">Custom Icons</h2>
          <Badge variant="outline" className="text-xs">
            {CUSTOM_ICONS.length} icons
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Custom React icon components from <code className="text-xs bg-muted px-1 py-0.5 rounded">@/components/ui/icons</code>. 
          Click any icon to copy its import statement.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {CUSTOM_CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Icons Grid */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-polar-700 dark:bg-polar-900">
        <TooltipProvider>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
            {filteredIcons.map(({ name, component: Icon, category }) => (
              <Tooltip key={name}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => copyImport(name)}
                    className={cn(
                      'group relative flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-transparent',
                      'hover:border-gray-200 hover:bg-gray-50 dark:hover:border-polar-600 dark:hover:bg-polar-800',
                      'transition-all duration-150',
                      copiedIcon === name && 'border-green-500 bg-green-50 dark:bg-green-950'
                    )}
                  >
                    {copiedIcon === name ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    )}
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {name.replace('Icon', '')}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="text-center">
                    <p className="font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">{category}</p>
                    <p className="text-xs text-muted-foreground mt-1">Click to copy import</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {filteredIcons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">No icons match your search</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Usage Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Usage</h3>
        <div className="rounded-lg border border-gray-200 bg-gray-950 p-4 dark:border-polar-700">
          <pre className="text-sm text-gray-300">
            <code>{`// Import the icon you need
import { OpenAIIcon, SlackIcon, GoogleIcon } from '@/components/ui/icons'

// Use in your component
<OpenAIIcon className="h-5 w-5" />
<SlackIcon className="h-6 w-6 text-[#4A154B]" />
<GoogleIcon className="h-4 w-4" />`}</code>
          </pre>
        </div>
      </div>

      {/* Spinner Component */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Spinner Component</h3>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-polar-700 dark:bg-polar-900">
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner />
              <span className="text-sm text-muted-foreground">Default</span>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-950 p-4 flex-1 dark:border-polar-700">
              <pre className="text-sm text-gray-300">
                <code>{`import { Spinner } from '@/components/ui/icons'

<Spinner />`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// SVG Icons Section (Public Assets)
// ============================================================

function SvgIconsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null)

  const filteredIcons = useMemo(() => {
    return SVG_ICONS.filter(icon => {
      const matchesSearch = searchQuery === '' || 
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || icon.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const copyPath = (path: string, name: string) => {
    navigator.clipboard.writeText(path)
    setCopiedIcon(name)
    setTimeout(() => setCopiedIcon(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-semibold">SVG Icons</h2>
          <Badge variant="outline" className="text-xs">
            {SVG_ICONS.length}+ icons
          </Badge>
        </div>
        <p className="text-muted-foreground">
          SVG icon assets from <code className="text-xs bg-muted px-1 py-0.5 rounded">/public/icons/</code>. 
          Click any icon to copy its path. Many icons have color and text variants available.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search SVG icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {SVG_CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Icons Grid */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-polar-700 dark:bg-polar-900">
        <TooltipProvider>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
            {filteredIcons.map(({ name, path, category }) => (
              <Tooltip key={name}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => copyPath(path, name)}
                    className={cn(
                      'group relative flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-transparent',
                      'hover:border-gray-200 hover:bg-gray-50 dark:hover:border-polar-600 dark:hover:bg-polar-800',
                      'transition-all duration-150',
                      copiedIcon === name && 'border-green-500 bg-green-50 dark:bg-green-950'
                    )}
                  >
                    {copiedIcon === name ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="relative h-5 w-5">
                        <Image
                          src={path}
                          alt={name}
                          fill
                          className="object-contain dark:invert"
                        />
                      </div>
                    )}
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {name}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="text-center">
                    <p className="font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">{category}</p>
                    <p className="text-xs text-muted-foreground mt-1">Click to copy path</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {filteredIcons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">No icons match your search</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Icon Variants Info */}
      <div className="rounded-xl border border-gray-200 bg-muted/30 p-6 dark:border-polar-700">
        <h4 className="font-medium mb-3">Icon Variants</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Many icons have multiple variants available in the <code className="text-xs bg-muted px-1 py-0.5 rounded">/public/icons/</code> folder:
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-background p-4 border">
            <p className="font-medium text-sm mb-1">Default</p>
            <code className="text-xs text-muted-foreground">/icons/openai.svg</code>
          </div>
          <div className="rounded-lg bg-background p-4 border">
            <p className="font-medium text-sm mb-1">Color Variant</p>
            <code className="text-xs text-muted-foreground">/icons/openai-color.svg</code>
          </div>
          <div className="rounded-lg bg-background p-4 border">
            <p className="font-medium text-sm mb-1">Text Variant</p>
            <code className="text-xs text-muted-foreground">/icons/openai-text.svg</code>
          </div>
        </div>
      </div>

      {/* Usage Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Usage with Next.js Image</h3>
        <div className="rounded-lg border border-gray-200 bg-gray-950 p-4 dark:border-polar-700">
          <pre className="text-sm text-gray-300">
            <code>{`import Image from 'next/image'

// Basic usage
<Image
  src="/icons/openai.svg"
  alt="OpenAI"
  width={24}
  height={24}
/>

// With dark mode invert
<div className="relative h-6 w-6">
  <Image
    src="/icons/openai.svg"
    alt="OpenAI"
    fill
    className="object-contain dark:invert"
  />
</div>

// Color variant (no invert needed)
<Image
  src="/icons/openai-color.svg"
  alt="OpenAI"
  width={24}
  height={24}
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

