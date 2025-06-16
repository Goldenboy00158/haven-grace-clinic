import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Calendar, User, MessageSquare } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ContactForm {
  name: string;
  phone: string;
  service: string;
  message: string;
  preferredDate: string;
  preferredTime: string;
}

interface Appointment {
  id: string;
  ...ContactForm;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    phone: '',
    service: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('clinic-appointments', []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new appointment
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save appointment
    setAppointments(prev => [newAppointment, ...prev]);
    
    // Show success message
    setIsSubmitted(true);
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      service: '',
      message: '',
      preferredDate: '',
      preferredTime: ''
    });

    // Hide success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Numbers",
      details: "0719307605 / 0725488740",
      subDetails: "Available 24/7 for emergencies",
      action: "tel:+254719307605"
    },
    {
      icon: Mail,
      title: "Email Address",
      details: "info@havengraceclinic.com",
      subDetails: "We'll respond within 24 hours",
      action: "mailto:info@havengraceclinic.com"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Zimmerman, Nairobi",
      subDetails: "Kenya",
      action: "https://maps.google.com"
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Mon-Fri: 8AM-6PM",
      subDetails: "Sat: 9AM-4PM | Sun: Emergency Only",
      action: null
    }
  ];

  const services = [
    "Family Planning",
    "Wound Dressing", 
    "Blood Pressure Monitoring",
    "Blood Sugar Monitoring",
    "Suturing Services",
    "Laboratory Services",
    "General Consultation",
    "Emergency Care"
  ];

  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
            Contact Us
          </div>
          <h2 className="text-4xl font-bold text-gray-900">
            Get in Touch with Haven Grace
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to take the next step in your healthcare journey? Contact us today to 
            schedule an appointment or learn more about our services.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
              <p className="text-gray-600 leading-relaxed">
                We're here to help and answer any questions you might have. 
                We look forward to hearing from you.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex space-x-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      {item.action ? (
                        <a 
                          href={item.action}
                          className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                        >
                          {item.details}
                        </a>
                      ) : (
                        <p className="text-gray-900">{item.details}</p>
                      )}
                      <p className="text-sm text-gray-600">{item.subDetails}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer">
              <div className="text-center space-y-2">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-gray-500 font-medium">Interactive Map</p>
                <p className="text-sm text-gray-400">Zimmerman, Nairobi</p>
                <p className="text-xs text-blue-600">Click to view in Google Maps</p>
              </div>
            </div>

            {/* Recent Appointments */}
            {appointments.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Appointments
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {appointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.name}</p>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                        <p className="text-xs text-gray-500">
                          {appointment.preferredDate} at {appointment.preferredTime}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                  Schedule an Appointment
                </h3>
                <p className="text-gray-600">Fill out the form below and we'll get back to you shortly.</p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <h4 className="text-xl font-semibold text-gray-900">Appointment Request Sent!</h4>
                  <p className="text-gray-600">
                    We'll contact you within 24 hours to confirm your appointment.
                    Your appointment ID is: <span className="font-mono text-blue-600">#{appointments[0]?.id}</span>
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Schedule Another Appointment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="0719307605"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Needed *
                    </label>
                    <select
                      id="service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        required
                        min={today}
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Preferred Time *
                      </label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        required
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="h-4 w-4 inline mr-1" />
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Please describe your symptoms or reason for visit..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>Schedule Appointment</span>
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-16 bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-red-900 mb-4">Medical Emergency?</h3>
          <p className="text-red-700 mb-6">
            If you're experiencing a medical emergency, please call 911 immediately or go to your nearest emergency room.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:911"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Call 911
            </a>
            <a
              href="tel:+254719307605"
              className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Emergency Hotline: 0719307605
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}