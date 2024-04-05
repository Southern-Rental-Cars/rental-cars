import Image, { type ImageProps } from 'next/image'

import { Container } from '@/components/Container'
import Logo from '@/images/trclogo2.png'
import VehicleList from '@/components/VehicleList'

const Home = async () => {
  return (
    <>
      <Container className="mt-9">
        <div className="mb-6 mt-24 flex w-full justify-center overflow-hidden rounded-lg">
          <Image src={Logo} alt="Texas Rental Cars" width={600} height={600} />
        </div>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Texas Rental Cars LLC is based in The Woodlands, Texas. We offer a
          wide range of vehicles for rent, delivery, and pick-up in the greater
          Houston area. We are a family-owned and operated business that
          provides exceptional customer service and competitive pricing. Our
          goal is to make your rental experience as easy and convenient as
          possible. We look forward to serving you!{' '}
        </p>
        <div className="mt-12"></div>

        <VehicleList />
      </Container>
    </>
  )
}

export default Home
