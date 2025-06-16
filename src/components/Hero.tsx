import React from 'react';
import { ArrowRight, Shield, Heart, Users, Pill, Calendar, Phone } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-32 pb-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Health,
                <span className="text-blue-600 block">Our Priority</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience compassionate, comprehensive healthcare at Haven Grace Clinic. 
                Our dedicated team of medical professionals provides exceptional care, 
                specialized services, and on-site pharmacy for you and your family.
              </p>
            </div>

            {/* Service Highlights */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Services:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Family Planning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Wound Dressing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">BP Monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-gray-700">Blood Sugar Tests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <span className="text-gray-700">Suturing Services</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">On-Site Pharmacy</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('#contact')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Schedule Appointment</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scrollToSection('#services')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
              >
                View Services
              </button>
            </div>

            {/* Quick Contact */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="tel:+15551234567"
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Call Now</span>
              </a>
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600">Emergency? Call us 24/7</p>
                <p className="font-semibold text-gray-900">(555) 123-4567</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-7 w-7 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">15+</div>
                <div className="text-xs text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-7 w-7 text-green-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">10K+</div>
                <div className="text-xs text-gray-600">Patients Served</div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-7 w-7 text-purple-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">20+</div>
                <div className="text-xs text-gray-600">Medical Staff</div>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Pill className="h-7 w-7 text-indigo-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">119</div>
                <div className="text-xs text-gray-600">Medications</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Medical professionals at Haven Grace Clinic"
                className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
              />
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white p-6 rounded-xl shadow-lg z-20 transform rotate-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Emergency Care</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white p-6 rounded-xl shadow-lg z-20 transform -rotate-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Patient Satisfaction</div>
              </div>
            </div>
            <div className="absolute top-1/2 -left-6 bg-white p-4 rounded-xl shadow-lg z-20 transform -rotate-6">
              <div className="text-center">
                <Pill className="h-8 w-8 text-indigo-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">On-Site Pharmacy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}