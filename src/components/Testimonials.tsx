import testimonials from '../data/testimonials.json';

interface Testimonial {
  name: string;
  review: string;
  date: string;
  platform: string;
}

const testimonialsData: Testimonial[] = testimonials;

export default function Testimonials() {
  return (
    <>
      <h2 className="text-5xl md:text-5xl font-bold tracking-wide dark:text-[#d9ab69] mb-8 text-center">
        Testimonials
      </h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-10">
          {testimonialsData.map((item, index) => (
            <div
              className="flex-shrink-0 bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-80 h-110"
              key={index}
            >
              <h3 className="text-md md:text-lg tracking-wide mb-4 text-zinc-500">
                {item.name}
              </h3>
              <p className="text-black text-md md:text-lg tracking-wide mb-2">
                {item.review}
              </p>
              <p className="text-zinc-400 text-sm">
                {item.date} - {item.platform}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
