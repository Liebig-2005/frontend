export default function About() {
  const team = [
    "Jayaprakash S",
    "Vinaya Kumara Liebig K G",
    "Naveen Raj A",
    "Nizamudeen K",
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pt-20 relative overflow-hidden">
      <div className="container mx-auto px-6 py-10 relative z-10 max-w-3xl">

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text 
        bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 mb-8 text-center">
          About This Project
        </h1>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/50 shadow-2xl">

          {/* Description */}
          <p className="text-gray-800 text-lg leading-relaxed mb-8 text-center font-medium">
            This platform is designed to support farmers with AI-powered crop
            assistance, disease detection, weather insights, market prices,
            and personalized agricultural recommendations.
          </p>

          {/* Team Heading */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Our Team
          </h2>

          {/* Team Cards */}
          <div className="grid grid-cols-1 gap-4">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="backdrop-blur-xl bg-white/60 border border-white/50 
                p-4 rounded-2xl shadow-md text-center font-semibold text-gray-800"
              >
                {member}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
