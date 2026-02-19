import { FileText, Download, FileSpreadsheet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { DisputeRefundCase, CaseTimelineEvent } from '@/types/dispute-refund-case'

export interface ExportCasePDFandCSVProps {
  caseData: DisputeRefundCase
  timelineEvents?: CaseTimelineEvent[]
  onExportPDF?: () => void
  onExportCSV?: () => void
  isExporting?: boolean
}

/** Build a simple CSV string for the case and timeline. */
function buildCaseCSV(
  caseData: DisputeRefundCase,
  timelineEvents: CaseTimelineEvent[]
): string {
  const headers = [
    'Case ID',
    'Title',
    'Status',
    'Description',
    'Created',
    'Updated',
  ]
  const caseRow = [
    caseData.id,
    caseData.title,
    caseData.status,
    caseData.description ?? '',
    caseData.created_at,
    caseData.updated_at,
  ]
  const escape = (v: string) =>
    /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
  const csvRows: string[] = [
    headers.map(escape).join(','),
    caseRow.map((c) => escape(String(c))).join(','),
  ]
  if (timelineEvents.length > 0) {
    csvRows.push('')
    csvRows.push('Timeline Event ID,Type,Body,Created,Author')
    timelineEvents.forEach((e) => {
      csvRows.push(
        [e.id, e.type, e.body, e.created_at, e.author_label ?? '']
          .map(escape)
          .join(',')
      )
    })
  }
  return csvRows.join('\n')
}

/** Trigger download of a blob as a file. */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ExportCasePDFandCSV({
  caseData,
  timelineEvents = [],
  onExportPDF,
  onExportCSV,
  isExporting,
}: ExportCasePDFandCSVProps) {
  const handleExportCSV = () => {
    if (onExportCSV) {
      onExportCSV()
      return
    }
    const csv = buildCaseCSV(caseData, timelineEvents)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const filename = `case-${caseData.id.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.csv`
    downloadBlob(blob, filename)
  }

  return (
    <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5" />
          Export case
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Download case summary and timeline as PDF or CSV
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {onExportPDF ? (
          <Button
            variant="default"
            size="sm"
            onClick={onExportPDF}
            disabled={isExporting}
            className="hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="opacity-70"
            title="PDF export requires server-side generation"
          >
            <Download className="h-4 w-4" />
            Export PDF (server)
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          disabled={isExporting}
          className="hover:scale-[1.02] active:scale-[0.98]"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export CSV
        </Button>
      </CardContent>
    </Card>
  )
}
