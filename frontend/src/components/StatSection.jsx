// src/components/StatSection.jsx
export function StatSection() {
  const stats = [
    { label: "Active MoUs", value: "120+", icon: "📄" },
    { label: "Global Partners", value: "45", icon: "🌍" },
    { label: "Regional Reach", value: "EA-ROAD", icon: "📡" },
    { label: "Years of Excellence", value: "10+", icon: "✨" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="group p-8 rounded-3xl border border-gray-50 hover:border-rp-gold hover:shadow-2xl hover:shadow-rp-blue/5 transition-all duration-500">
              <div className="text-3xl mb-4">{stat.icon}</div>
              <div className="text-4xl font-black text-rp-blue tracking-tighter group-hover:scale-110 transition-transform origin-left">
                {stat.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// src/components/RegionalFocus.jsx
export function RegionalFocus() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
          {/* Decorative Radar/Map Element */}
          <div className="aspect-square rounded-full border-2 border-dashed border-blue-100 animate-[spin_60s_linear_infinite] p-12">
            <div className="w-full h-full rounded-full bg-linear-to-tr from-rp-blue/5 to-rp-gold/10 flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center rotate-12">
                <span className="text-rp-blue font-black text-xl">EA-ROAD</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-1 lg:order-2 space-y-6">
          <h2 className="text-4xl font-black text-rp-slate leading-tight uppercase tracking-tighter">
            Regional Integration & <br />
            <span className="text-rp-gold">Coordination</span>
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            As a key coordinator for the **East Africa Regional Office of Astronomy for Development (EA-ROAD)**, 
            RP-LEO manages regional projects, fundraising, and capacity-building initiatives 
            across the sector.
          </p>
          <ul className="space-y-4">
            {['Regional Project Management', 'Strategic Fundraising', 'International Astronomy Coordination'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-rp-slate uppercase tracking-wide">
                <div className="w-2 h-2 bg-rp-gold rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}