'use client'

import testimonials from '../data/testimonials.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FadeIn, FadeInStagger } from '@/components/FadeIn';

interface Testimonial {
  name: string;
  review: string;
  date: string;
  platform: string;
}

const testimonialsData: Testimonial[] = testimonials;

export default function Testimonials() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-serif font-bold tracking-tight text-navy-800 sm:text-4xl">
          Trusted by Travelers
        </h2>
        <p className="mt-2 text-lg leading-8 text-zinc-600">
          See what our clients have to say about their journey with Southern Rental Cars.
        </p>
      </div>
      
      <FadeInStagger className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {testimonialsData.map((item, index) => (
          <FadeIn
            key={index}
            className="flex flex-col justify-between bg-white p-8 shadow-sm ring-1 ring-zinc-200 rounded-2xl transition-shadow hover:shadow-lg"
          >
            <div>
              <div className="flex gap-x-1 text-gold-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="text-zinc-700 leading-relaxed">
                "{item.review}"
              </blockquote>
            </div>
            <div className="mt-8 border-t border-zinc-100 pt-6">
              <div className="text-sm font-semibold text-navy-900">{item.name}</div>
              <div className="mt-1 text-xs text-zinc-500">
                {item.date} via {item.platform}
              </div>
            </div>
          </FadeIn>
        ))}
      </FadeInStagger>
    </div>
  );
}