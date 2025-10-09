import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ServicePlanetProps {
  name: string;
  description: string;
  color: string;
  size: number;
  position: [number, number]; // [x, y] as percentages
  delay: number;
  index: number;
  isMobile: boolean;
}

// Hook to detect mobile viewport
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

const services = [
  {
    name: 'In-house Tools',
    description: 'Custom solutions built for your specific workflow needs',
    color: '#7ee3ff', // neon color from theme
    size: 120,
    position: [25, 20] as [number, number],
    mobilePosition: [50, 15] as [number, number],
    delay: 0.1,
  },
  {
    name: 'Web Development',
    description: 'Responsive, modern web applications with cutting-edge technology',
    color: '#99f6e4', // accent color from theme
    size: 150,
    position: [65, 40] as [number, number],
    mobilePosition: [50, 35] as [number, number],
    delay: 0.3,
  },
  {
    name: 'Mobile App Development',
    description: 'Native and cross-platform mobile experiences',
    color: 'rgba(126, 227, 255, 0.8)', // neon with transparency
    size: 130,
    position: [30, 60] as [number, number],
    mobilePosition: [50, 55] as [number, number],
    delay: 0.5,
  },
  {
    name: 'Ecosystems',
    description: 'Integrated platforms that connect all your digital touchpoints',
    color: 'rgba(153, 246, 228, 0.8)', // accent with transparency
    size: 160,
    position: [70, 80] as [number, number],
    mobilePosition: [50, 75] as [number, number],
    delay: 0.7,
  },
];

function ServicePlanet({ name, description, color, size, position, delay, index, isMobile }: ServicePlanetProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  
  // Get position based on device type
  const serviceData = services[index];
  const [x, y] = isMobile ? serviceData.mobilePosition : position;
  
  // Adjust size for mobile
  const planetSize = isMobile ? size * 0.8 : size;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: planetSize,
        height: planetSize,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, delay }}
    >
      <motion.div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsTapped(!isTapped)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Planet */}
        <div 
          className="rounded-full relative overflow-hidden"
          style={{ 
            width: planetSize, 
            height: planetSize, 
            background: `radial-gradient(circle at 30% 30%, ${color}, rgba(5, 7, 11, 0.8))`,
            boxShadow: `0 0 40px ${color.replace(')', ', 0.4)')}`,
            border: `1px solid ${color.replace(')', ', 0.6)')}`,
          }}
        >
          {/* Planet surface details */}
          <div className="absolute inset-0 opacity-30" 
               style={{ 
                 background: `repeating-conic-gradient(from ${index * 45}deg, transparent 0deg 5deg, rgba(255,255,255,0.1) 5deg 10deg)`,
                 animation: `spin ${20 + index * 5}s linear infinite`,
               }} 
          />
          
          {/* Planet ring for some planets */}
          {index % 2 === 0 && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[30%] opacity-40"
                 style={{
                   background: `linear-gradient(90deg, transparent 0%, ${color} 20%, ${color} 80%, transparent 100%)`,
                   transform: `translate(-50%, -50%) rotate(${index * 30}deg)`,
                   borderRadius: '100%',
                 }}
            />
          )}
        </div>
        
        {/* Service info on hover/tap */}
        <motion.div 
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full mb-2 p-3 rounded-lg glass text-white text-center z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isMobile ? (isTapped ? 1 : 0) : (isHovered ? 1 : 0), 
            y: isMobile ? (isTapped ? 0 : 10) : (isHovered ? 0 : 10) 
          }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'rgba(5, 7, 11, 0.85)',
            border: `1px solid ${color.replace(')', ', 0.4)')}`,
            boxShadow: `0 0 20px ${color.replace(')', ', 0.25)')}`,
            fontFamily: '"Share Tech Mono","Rajdhani","Orbitron",monospace',
            width: isMobile ? '180px' : 'max-content',
            maxWidth: isMobile ? '180px' : '220px',
          }}
        >
          <div className="text-xs tracking-[0.45em] uppercase" style={{ color }}>{name}</div>
          <div className="text-xs mt-1 text-white/70 font-light">{description}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function CelestialScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax effect for background stars
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  
  return (
    <div 
      ref={containerRef}
      className="relative min-h-[200vh] overflow-hidden bg-gradient-to-b from-[#030915] via-[#041020] to-[#040a14]"
    >
      {/* Background stars with parallax effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(126,227,255,0.1),rgba(5,7,11,0)_70%)]" />
        {Array.from({ length: isMobile ? 50 : 100 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const opacity = Math.random() * 0.7 + 0.3;
          const animationDuration = Math.random() * 3 + 2;
          
          return (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: size,
                height: size,
                left: `${x}%`,
                top: `${y}%`,
                opacity,
                animation: `twinkle ${animationDuration}s ease-in-out infinite alternate`,
                boxShadow: size > 2 ? `0 0 ${size * 2}px rgba(126, 227, 255, 0.8)` : 'none',
              }}
            />
          );
        })}
      </motion.div>
      
      {/* Section title */}
      <div className="relative pt-32 pb-16 text-center z-10 px-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/5 px-4 py-1 text-[0.68rem] tracking-[0.4em] uppercase text-cyan-100/70" style={{fontFamily:'"Share Tech Mono","Rajdhani","Orbitron",monospace'}}>
          <span className="h-1 w-1 rounded-full bg-cyan-200/80 shadow-[0_0_10px_rgba(126,227,255,0.7)]" aria-hidden="true"/>
          Our Services
        </span>
        <h2 className="mt-6 text-[clamp(1.5rem,3vw,2.8rem)] font-light leading-tight tracking-[0.05em] text-white/95 max-w-3xl mx-auto" style={{fontFamily:'"Michroma","Orbitron","Rajdhani",sans-serif'}}>
          Explore our celestial ecosystem of services
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed text-white/70" style={{fontFamily:'"Rajdhani","Share Tech Mono","Orbitron",sans-serif'}}>
          Navigate through our core offerings, each represented by a unique celestial body in the CaveBeat universe
        </p>
      </div>
      
      {/* Planets container */}
      <div className="relative h-[150vh] w-full">
        {services.map((service, index) => (
          <ServicePlanet
            key={service.name}
            {...service}
            index={index}
            isMobile={isMobile}
          />
        ))}
      </div>
      
      {/* Animation keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}