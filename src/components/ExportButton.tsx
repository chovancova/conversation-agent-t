import { useState } from 'react'
import { Export, FileText, Code, FilePng, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Conversation } from '@/lib/types'
import { exportAsText, exportAsMarkdown, exportAsPNG } from '@/lib/exportUtils'

type ExportButtonProps = {
  conversation: Conversation
  agentNames: Record<string, string>
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function ExportButton({ 
  conversation, 
  agentNames, 
  variant = 'outline',
  size = 'sm',
  className 
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportText = () => {
    try {
      exportAsText(conversation, agentNames)
      toast.success('Copied to clipboard', {
        description: 'Conversation exported as text',
        icon: <Check size={16} weight="bold" className="text-green-500" />
      })
    } catch (error) {
      toast.error('Export failed')
    }
  }

  const handleExportMarkdown = () => {
    try {
      exportAsMarkdown(conversation, agentNames)
      toast.success('Downloaded', {
        description: 'Conversation exported as Markdown',
        icon: <Check size={16} weight="bold" className="text-green-500" />
      })
    } catch (error) {
      toast.error('Export failed')
    }
  }

  const handleExportPNG = async () => {
    setIsExporting(true)
    try {
      await exportAsPNG(conversation, agentNames)
      toast.success('Downloaded', {
        description: 'Conversation exported as image',
        icon: <Check size={16} weight="bold" className="text-green-500" />
      })
    } catch (error) {
      toast.error('Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={isExporting}
        >
          <Export size={16} weight="bold" />
          {size !== 'icon' && <span className="ml-1.5">Export</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportText}>
          <FileText size={16} className="mr-2" weight="duotone" />
          Copy as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportMarkdown}>
          <Code size={16} className="mr-2" weight="duotone" />
          Download Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPNG} disabled={isExporting}>
          <FilePng size={16} className="mr-2" weight="duotone" />
          Download Image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
