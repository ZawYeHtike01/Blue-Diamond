import React from "react";

type Feature = {
  title: string;
  description: string;
  image: string;
  position: "left" | "right";
  rotate: string;
};

const FEATURES: Feature[] = [
  {
    title: "コミュニケーションが良い",
    description: "メンバー同士がよく話し合い、\n協力して活動できます。",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
    position: "left",
    rotate: "-rotate-[12deg]",
  },
  {
    title: "プロ意識が高い",
    description: "責任感を持ち、\n真面目に練習や演奏に取り組みます。",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600",
    position: "right",
    rotate: "rotate-[12deg]",
  },
  {
    title: "良いイメージがある",
    description: "学校やバンドの\n良い印象を与えることができます。",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600",
    position: "left",
    rotate: "-rotate-[12deg]",
  },
];

const PaperClip = () => {
  return (
    <div className="absolute -top-5 -left-2 z-20 h-12 w-7 rotate-[-15deg]">
      <div className="absolute left-2 top-0 h-11 w-4 rounded-full border-2 border-white" />
      <div className="absolute left-4 top-2 h-8 w-3 rounded-full border-2 border-white border-b-transparent" />
    </div>
  );
};

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const isLeft = feature.position === "left";

  return (
    <div
      className={`
        relative flex w-full items-center
        ${isLeft ? "justify-start" : "justify-end"}
      `}
    >
      {/* Image */}
      <div
        className={`
          relative z-10
          ${isLeft ? "order-1" : "order-2"}
        `}
      >
        <div
          className={`
            relative
            h-[145px] w-[115px]
            overflow-visible
            ${feature.rotate}
          `}
        >
          <PaperClip />

          <img
            src={feature.image}
            alt=""
            className="
              h-full
              w-full
              rounded-[18px]
              object-cover
              shadow-lg
            "
          />
        </div>
      </div>

      {/* Text */}
      <div
        className={`
          ${isLeft ? "order-2 ml-12" : "order-1 mr-12 text-right"}
          max-w-[280px]
        `}
      >
        <h3
          className="
            text-[23px]
            font-bold
            leading-tight
            tracking-wide
            text-white
          "
        >
          {feature.title}
        </h3>

        <p
          className="
            mt-7
            whitespace-pre-line
            text-[12px]
            leading-[1.8]
            text-neutral-500
          "
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
};

const CommunicationSection: React.FC = () => {
  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-black
        px-6
        py-20
      "
    >
      <div className="mx-auto max-w-[450px]">
        <div className="flex flex-col gap-[115px]">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunicationSection;