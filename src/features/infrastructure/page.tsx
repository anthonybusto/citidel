import { useDeacon, useDogs } from './hooks'
import { DeaconCard } from './components/deacon-card'
import { DogList } from './components/dog-list'
import { ErrorBanner } from '@/components/error-banner'

export function InfrastructurePage() {
  const deacon = useDeacon()
  const dogs = useDogs()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Infrastructure</h1>
      {deacon.error && <ErrorBanner message={(deacon.error as { message: string }).message} />}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deacon.data && <DeaconCard data={deacon.data.data} />}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Dogs</h2>
        {dogs.error && <ErrorBanner message={(dogs.error as { message: string }).message} />}
        <DogList dogs={dogs.data?.data ?? []} />
      </div>
    </div>
  )
}
