import React from 'react';
import { motion } from 'motion/react';
import { FaStar } from 'react-icons/fa';
import img1 from './../assets/img1pro.png';
import img2 from './../assets/img2pro.png';
import img3 from './../assets/img3pro.jpg';

const Testimonials = () => {
  const testimonials = [
    { 
      name: "Naqeeb Khan", 
      location: "Bangalore, India", 
      image: img1, 
      testimonial: "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!" 
    },
    { 
      name: "Farhan Khan", 
      location: "Kolar, India", 
      image: img2, 
      testimonial: "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!" 
    },
    { 
      name: "Jabeen Khan", 
      location: "Hubali, India", 
      image: img3, 
      testimonial: "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!" 
    },
  ];

  return (
    <div className='py-16 px-4 md:px-8 lg:px-16 xl:px-32 bg-white'>
      
      <h2 className='font-bold text-3xl text-center text-[#0066CC] mb-4'>
        What our customers say
      </h2>
      <p className='font-medium text-xl text-center text-gray-800 mb-12'>
        Discover why travelers choose stayVenture for their luxury accommodations around the world
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-[#f5f5f5] p-3 md:p-6 rounded-2xl shadow-lg hover:-translate-y-1 transition-all duration-500 border border-gray-300"
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <img className="w-12 h-12 rounded-full object-cover" src={testimonial.image} alt={testimonial.name} />
              <div>
                <p className="text-xl font-semibold text-black">{testimonial.name}</p>
                <p className="text-gray-600">{testimonial.location}</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-1 mt-4 text-[#FFD700]">
              {Array(5).fill(0).map((_, idx) => (
                <FaStar key={idx} />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-700 max-w-[90%] mt-4 font-light">
              "{testimonial.testimonial}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
