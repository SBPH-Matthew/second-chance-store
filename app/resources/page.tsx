"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FiBook,
  FiShield,
  FiHelpCircle,
  FiShoppingBag,
  FiTruck,
  FiChevronRight,
  FiFileText,
  FiMessageCircle,
  FiUsers,
} from "react-icons/fi";

const resources = [
  {
    title: "Getting Started",
    description:
      "New to Second Chance? Learn how to buy, sell, and navigate our community marketplace.",
    icon: <FiBook className="w-6 h-6" />,
    link: "#",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Safety Center",
    description:
      "Guidance on how to trade safely, meet with buyers/sellers, and protect your information.",
    icon: <FiShield className="w-6 h-6" />,
    link: "/safety",
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Buying Guide",
    description:
      "Tips on finding the best deals, inspecting items, and making secure transactions.",
    icon: <FiShoppingBag className="w-6 h-6" />,
    link: "#",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Selling Guide",
    description:
      "How to create great listings, take better photos, and price your items competitively.",
    icon: <FiFileText className="w-6 h-6" />,
    link: "#",
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Logistics & Pickup",
    description:
      "Guidelines for coordinating item pickups and choosing safe meeting locations.",
    icon: <FiTruck className="w-6 h-6" />,
    link: "#",
    color: "bg-pink-50 text-pink-600",
  },
  {
    title: "Community Standards",
    description:
      "Our rules for maintaining a helpful, respectful, and safe community environment.",
    icon: <FiUsers className="w-6 h-6" />,
    link: "#",
    color: "bg-cyan-50 text-cyan-600",
  },
];

const faqs = [
  {
    question: "Is Second Chance free to use?",
    answer:
      "Yes! Listing items and browsing the marketplace is completely free. We also have many items listed for free by community members.",
  },
  {
    question: "How do I contact a seller?",
    answer:
      "You can use our built-in messaging system. Just click the 'Message' button on any listing to start a conversation.",
  },
  {
    question: "What should I do if I have a problem with a transaction?",
    answer:
      "We recommend first trying to resolve it directly with the other party. If that fails, you can report the listing or contact our support team.",
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-bg-light-blue pt-32 pb-20 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <span className="uppercase text-sm tracking-widest font-bold text-primary block mb-4">
              Resources & Help
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold font-poppins text-black mb-6 tracking-tight leading-tight">
              Everything you need to{" "}
              <span className="text-primary italic">thrive</span> in our
              community.
            </h1>
            <p className="text-gray-600 text-xl leading-relaxed max-w-2xl">
              Whether you're looking to declutter your home or find your next
              treasure, our guides and resources are here to help you every step
              of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className="group p-8 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-white flex flex-col h-full"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${resource.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {resource.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6 flex-grow">
                  {resource.description}
                </p>
                <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                  Read Guide <FiChevronRight className="ml-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-4xl font-bold text-black mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 mb-8">
                Can't find what you're looking for? Our support team is always
                here to help.
              </p>
              <button className="btn-primary rounded-full flex items-center gap-2">
                <FiHelpCircle /> Visit Help Center
              </button>
            </div>
            <div className="lg:w-2/3 space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <h4 className="text-lg font-bold text-black mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-24">
        <div className="container">
          <div className="bg-black rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Still need assistance?
              </h2>
              <p className="text-gray-400 text-lg mb-10">
                Our support team is available 24/7 to help you with any
                questions or concerns you might have.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                  <FiMessageCircle /> Chat with us
                </button>
                <button className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-10 py-4 rounded-full font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer showCTA={false} />
    </main>
  );
}
