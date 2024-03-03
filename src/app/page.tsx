import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import image1 from '@/images/vehicles/car1.jpg'
import image2 from '@/images/vehicles/car2.jpg'
import image3 from '@/images/vehicles/car3.jpg'
import image4 from '@/images/vehicles/car4.jpg'
import image5 from '@/images/vehicles/car5.jpg'

const SocialLink = ({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) => (
  <Link className="group -m-1 p-1" {...props}>
    <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
  </Link>
)

const Photos = () => {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {[image1, image2, image3, image4, image5].map((image, imageIndex) => (
          <div
            key={image.src}
            className={clsx(
              'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800',
              rotations[imageIndex % rotations.length],
            )}
          >
            <Image
              src={image}
              alt=""
              sizes="(min-width: 640px) 18rem, 11rem"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const Home = async () => {
  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Welcome to Texas Rental Cars
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            Texas Rental Cars is a car rental company located in The Woodlands,
            Texas. We offer a wide range of vehicles for rent, including cars,
            trucks, and vans.
          </p>
        </div>
      </Container>
      <Photos />
    </>
  )
}

export default Home
