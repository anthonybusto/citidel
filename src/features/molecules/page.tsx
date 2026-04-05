import { useState } from 'react'
import { useFormulaList, useFormulaShow } from './hooks'
import { ErrorBanner } from '@/components/error-banner'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MoleculesPage() {
  const formulas = useFormulaList()
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null)
  const formulaDetail = useFormulaShow(selectedFormula)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Molecules & Formulas</h1>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Formula Catalog</h2>
        {formulas.error && <ErrorBanner message={(formulas.error as { message: string }).message} />}
        {formulas.data?.data.length === 0 && <p className="text-sm text-muted-foreground">No formulas</p>}
        {formulas.data && formulas.data.data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Steps</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formulas.data.data.map((f) => (
                <TableRow key={f.name} className="cursor-pointer" onClick={() => setSelectedFormula(f.name)}>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell className="text-muted-foreground">{f.description ?? '—'}</TableCell>
                  <TableCell>{f.type ? <Badge variant="outline">{f.type}</Badge> : '—'}</TableCell>
                  <TableCell>{f.steps?.length ?? 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {selectedFormula && formulaDetail.data && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{formulaDetail.data.data.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formulaDetail.data.data.description && (
              <p className="text-sm text-muted-foreground">{formulaDetail.data.data.description}</p>
            )}
            {formulaDetail.data.data.steps && formulaDetail.data.data.steps.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Steps</h4>
                {formulaDetail.data.data.steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{step.id}</span>
                    <span>{step.title}</span>
                    {step.needs && step.needs.length > 0 && (
                      <span className="text-xs text-muted-foreground">needs: {step.needs.join(', ')}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
