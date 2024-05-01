import { metadata } from './VehicleList' // Import metadata
import VehicleList from '@/app/vehicles/VehicleList'
import { Container } from '@/components/Container'

const VehiclePage = () => {
  return (
    <Container className="mt-9">
      <VehicleList />
    </Container>
  )
}

export default VehiclePage
export { metadata } // Export metadata for SEO
