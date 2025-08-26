import React from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";
interface AppFeatureSectionProps {
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  reverseLayout?: boolean;
  priority?: boolean;
}

export const AppFeatureSection: React.FC<AppFeatureSectionProps> = ({
  title,
  subtitle,
  description,
  imageSrc,
  reverseLayout = false,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const contentOrder = reverseLayout ? "md:order-last" : "";

  return (
    <motion.section
      className="bg-gray-50 py-16 md:py-24 font-inter"
      initial="hidden"
      whileInView="show"
      variants={containerVariants}
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="container mx-auto px-4" id="next-section-id">
        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-12`}
        >
          {/* Text Content */}
          <motion.div
            className={`w-full md:w-1/2 ${contentOrder}`}
            variants={itemVariants}
          >
            <p className="text-sm font-semibold text-rose-500 uppercase tracking-widest mb-4">
              {subtitle}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              {title}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">{description}</p>
          </motion.div>

          {/* Image/Mockup */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center p-8 md:p-12 relative"
            variants={itemVariants}
          >
            <NextImage
              src={imageSrc}
              alt={title}
              width={600} // ✅ Much larger base size
              height={400} // ✅ Better aspect ratio
              quality={95}
              priority={true} // ✅ Higher quality
              className="relative z-10 w-full max-w-sm md:max-w-md h-auto rounded-xl shadow-2xl"
            />
            {/* Background Blob/Shape */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-lg bg-rose-200 rounded-3xl z-0 -rotate-6"></div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
