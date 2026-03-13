interface Props {
  agentName: string;
  headline: string;
  primaryColor: string;
}

export function HeroSection({ agentName, headline, primaryColor }: Props) {
  return (
    <div
      className="relative py-24 px-4 text-center text-white"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{headline}</h1>
        <p className="text-xl opacity-90 mb-8">with {agentName}</p>
        <a
          href="#contact"
          className="inline-block bg-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          style={{ color: primaryColor }}
        >
          Contact Me
        </a>
      </div>
    </div>
  );
}
