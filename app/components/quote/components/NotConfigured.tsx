import { BrandLogo } from './Primitives'
import { useCompany } from '../CompanyContext'

// Shown when a company's slug resolves (it's a real, active company) but
// they haven't published a Quote Workflow yet (Settings → Quote Workflow
// in work.wk) — deliberately NOT a fallback to any hardcoded industry
// content. A company that hasn't configured their own questions must never
// see another industry's template (e.g. a security company seeing
// cleaning-specific steps).
export function NotConfiguredScreen() {
    const company = useCompany()
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <BrandLogo name={company.name} logoUrl={company.logo} size="md" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {company.name} hasn&apos;t set up online quote requests yet.
                {company.phone ? ` Please call ${company.phone} instead.` : ' Please check back soon.'}
            </p>
        </div>
    )
}
