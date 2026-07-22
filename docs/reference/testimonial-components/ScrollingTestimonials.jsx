// REFERENCE ONLY — not imported/shipped. See README.md in this folder.
// Needs: motion/react -> framer-motion, real DB data, --card-* tokens.
// Fit: marketing homepage (volume/infinite scroll). Blocked by no-fake-proof rule.

import { motion } from "motion/react";

const ScrollingTestimonials = () => {
  return (
    <div className="bg-slate-950 py-12">
      <div className="mb-8 px-4">
        <h3 className="text-slate-50 text-4xl font-semibold text-center">Testimonials</h3>
        <p className="text-center text-slate-300 text-sm mt-2 max-w-lg mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="p-4 overflow-x-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 w-24 z-10 bg-gradient-to-r from-slate-900 to-transparent" />
        <div className="flex items-center mb-4">
          <TestimonialList list={testimonials.top} duration={125} />
          <TestimonialList list={testimonials.top} duration={125} />
          <TestimonialList list={testimonials.top} duration={125} />
        </div>
        <div className="flex items-center mb-4">
          <TestimonialList list={testimonials.middle} duration={75} reverse />
          <TestimonialList list={testimonials.middle} duration={75} reverse />
          <TestimonialList list={testimonials.middle} duration={75} reverse />
        </div>
        <div className="flex items-center">
          <TestimonialList list={testimonials.bottom} duration={275} />
          <TestimonialList list={testimonials.bottom} duration={275} />
          <TestimonialList list={testimonials.bottom} duration={275} />
        </div>
        <div className="absolute top-0 bottom-0 right-0 w-24 z-10 bg-gradient-to-l from-slate-900 to-transparent" />
      </div>
    </div>
  );
};

const TestimonialList = ({ list, reverse = false, duration = 50 }) => {
  return (
    <motion.div
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      className="flex gap-4 px-2"
    >
      {list.map((t) => (
        <div key={t.id} className="shrink-0 w-[500px] grid grid-cols-[7rem,_1fr] rounded-lg overflow-hidden relative">
          <img src={t.img} className="w-full h-44 object-cover" />
          <div className="bg-slate-900 text-slate-50 p-4">
            <span className="block font-semibold text-lg mb-1">{t.name}</span>
            <span className="block mb-3 text-sm font-medium">{t.title}</span>
            <span className="block text-sm text-slate-300">{t.info}</span>
          </div>
          <span className="text-7xl absolute top-2 right-2 text-slate-700">"</span>
        </div>
      ))}
    </motion.div>
  );
};

// Placeholder data trimmed — original used 6 items x 3 rows of Unsplash faces.
// Real version pulls from testimonial portfolio_blocks.
const testimonials = {
  top: [{ id: 1, img: "", name: "Jen S.", title: "Founder of XYZ", info: "Lorem ipsum." }],
  middle: [{ id: 1, img: "", name: "Alex F.", title: "Founder of XYZ", info: "Lorem ipsum." }],
  bottom: [{ id: 1, img: "", name: "Danny G.", title: "Founder of XYZ", info: "Lorem ipsum." }],
};

export default ScrollingTestimonials;
