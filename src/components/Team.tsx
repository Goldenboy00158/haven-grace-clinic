import React from 'react';
import { Award, Clock, MapPin } from 'lucide-react';

export default function Team() {
  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Chief Medical Officer & Cardiologist",
      experience: "15+ Years Experience",
      education: "MD - Harvard Medical School",
      image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400",
      achievements: ["Board Certified Cardiologist", "Fellow of American College of Cardiology", "Published Researcher"]
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      experience: "12+ Years Experience",
      education: "MD - Johns Hopkins University",
      image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400",
      achievements: ["Board Certified Neurologist", "Stroke Center Director", "Research Publications"]
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      experience: "10+ Years Experience",
      education: "MD - Stanford Medical School",
      image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400",
      achievements: ["Board Certified Pediatrician", "Child Development Specialist", "Community Health Advocate"]
    },
    {
      name: "Dr. David Thompson",
      specialty: "Orthopedic Surgeon",
      experience: "18+ Years Experience",
      education: "MD - Mayo Clinic",
      image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400",
      achievements: ["Board Certified Orthopedic Surgeon", "Sports Medicine Expert", "Minimally Invasive Surgery"]
    }
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
            Our Medical Team
          </div>
          <h2 className="text-4xl font-bold text-gray-900">
            Meet Our Expert Physicians
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our experienced medical professionals are dedicated to providing exceptional care 
            with compassion, expertise, and the latest medical advancements.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-600 font-semibold">{doctor.specialty}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{doctor.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>{doctor.education}</span>
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Achievements:</h4>
                  <ul className="space-y-1">
                    {doctor.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs text-gray-600">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button className="w-full bg-gray-100 hover:bg-blue-600 text-gray-700 hover:text-white py-3 rounded-lg font-medium transition-all duration-300 text-sm">
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Meet Our Team?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Schedule your appointment today and experience personalized healthcare 
              from our dedicated medical professionals.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}