import React from 'react';
import { Award, Users, Clock, Shield } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Award,
      title: "Excellence in Care",
      description: "Board-certified physicians providing the highest standard of medical care with personalized treatment plans."
    },
    {
      icon: Users,
      title: "Experienced Team",
      description: "Our multidisciplinary team brings decades of combined experience in various medical specialties."
    },
    {
      icon: Clock,
      title: "Convenient Hours",
      description: "Extended hours and weekend availability to accommodate your busy schedule and urgent care needs."
    },
    {
      icon: Shield,
      title: "Advanced Technology",
      description: "State-of-the-art medical equipment and technology for accurate diagnosis and effective treatment."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/4021769/pexels-photo-4021769.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Modern medical facility interior"
              className="rounded-2xl shadow-xl w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-2xl"></div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                About Haven Grace Clinic
              </div>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Committed to Your 
                <span className="text-blue-600 block">Health & Wellness</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                For over 15 years, Haven Grace Clinic has been a trusted healthcare provider 
                in our community. We combine cutting-edge medical technology with compassionate 
                care to deliver exceptional health services for patients of all ages.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is to provide comprehensive, accessible, and personalized healthcare 
                that empowers our patients to live healthier, happier lives.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="space-y-3">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}