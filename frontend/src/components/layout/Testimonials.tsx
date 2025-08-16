import React from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";
// Sample data for testimonials
const testimonials = [
  {
    name: "Ellen Broji",
    affiliation: "Student at Protick Academy",
    text: "I love this app, it’s really help to get focus on my study, I usually get distraction by my phone, like watchin youtube, tiktok, and instagram",
    highlighted: true,
    image: "https://placehold.co/100x100/A05160/ffffff?text=EB",
  },
  {
    name: "Mike Pontaski",
    affiliation: "Student at Apple Academy",
    text: "I love this app, it’s really help to get focus on my study, I usually get distraction by my phone, like watchin youtube, tiktok, and instagram",
    highlighted: false,
    image: "https://placehold.co/100x100/5091B0/ffffff?text=MP",
  },
  {
    name: "Calista Cath",
    affiliation: "Student at UPB",
    text: "I love this app, it’s really help to get focus on my study, I usually get distraction by my phone, like watchin youtube, tiktok, and instagram",
    highlighted: false,
    image: "https://placehold.co/100x100/B09150/ffffff?text=CC",
  },
  {
    name: "Lucas Jeck",
    affiliation: "Student at Unpad",
    text: "I love this app, it’s really help to get focus on my study, I usually get distraction by my phone, like watchin youtube, tiktok, and instagram",
    highlighted: false,
    image: "https://placehold.co/100x100/70B050/ffffff?text=LJ",
  },
  {
    name: "Catherine Mic",
    affiliation: "Student at Unbir",
    text: "I love this app, it’s really help to get focus on my study, I usually get distraction by my phone, like watchin youtube, tiktok, and instagram",
    highlighted: false,
    image: "https://placehold.co/100x100/A08090/ffffff?text=CM",
  },
  {
    name: "Brisia July",
    affiliation: "Student at Harvard",
    text: "I love this app, it’s really help to get focus on my study, I usually get distraction by my phone, like watchin youtube, tiktok, and instagram",
    highlighted: false,
    image: "https://placehold.co/100x100/50B091/ffffff?text=BJ",
  },
  {
    name: "Jokie Munt",
    affiliation: "Student at Binus University",
    text: "I love this app, it’s really help to get focus on my study, I usually get distraction by my phone, like watchin youtube, tiktok, and instagram",
    highlighted: false,
    image: "https://placehold.co/100x100/9150B0/ffffff?text=JM",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const TestimonialSection = () => {
  return (
    <section className="bg-gray-50 py-16 md:py-24 font-inter">
      <div className="container mx-auto px-4 text-center">
        {/* Section Heading */}
        <motion.p
          className="text-sm font-semibold text-rose-500 uppercase tracking-widest mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
        >
          Testimonial
        </motion.p>
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8 }}
        >
          What students say <br /> about us
        </motion.h2>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-3xl shadow-lg transition-all duration-300 transform hover:-translate-y-2
                          ${
                            testimonial.highlighted
                              ? "bg-rose-500 text-white"
                              : "bg-white text-gray-800"
                          }`}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <NextImage
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={20}
                  height={20}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p
                    className={`text-xs ${
                      testimonial.highlighted
                        ? "text-rose-200"
                        : "text-gray-500"
                    }`}
                  >
                    {testimonial.affiliation}
                  </p>
                </div>
              </div>
              <p
                className={`text-sm ${
                  testimonial.highlighted ? "text-white" : "text-gray-600"
                }`}
              >
                {testimonial.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
