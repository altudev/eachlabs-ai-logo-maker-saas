"use client"

import { useRef, useState, useCallback, memo } from "react"
import { cn } from "@/lib/utils"

// Extended sample logos with more variety - monochrome style
const sampleLogos = [
  { id: 1, name: "TechFlow", icon: "T" },
  { id: 2, name: "Spark", icon: "S" },
  { id: 3, name: "Nexus", icon: "N" },
  { id: 4, name: "Pulse", icon: "P" },
  { id: 5, name: "Nova", icon: "✦" },
  { id: 6, name: "Apex", icon: "A" },
  { id: 7, name: "Drift", icon: "D" },
  { id: 8, name: "Bloom", icon: "B" },
  { id: 9, name: "Orbit", icon: "O" },
  { id: 10, name: "Flux", icon: "F" },
  { id: 11, name: "Zenith", icon: "Z" },
  { id: 12, name: "Prism", icon: "◇" },
  { id: 13, name: "Wave", icon: "W" },
  { id: 14, name: "Helix", icon: "H" },
  { id: 15, name: "Echo", icon: "E" },
  { id: 16, name: "Vertex", icon: "V" },
  { id: 17, name: "Luna", icon: "L" },
  { id: 18, name: "Atlas", icon: "△" },
  { id: 19, name: "Cipher", icon: "C" },
  { id: 20, name: "Metro", icon: "M" },
]

interface LogoCardProps {
  logo: typeof sampleLogos[0]
}

const LogoCard = memo(function LogoCard({ logo }: LogoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform({ rotateX: y * -15, rotateY: x * 15 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTransform({ rotateX: 0, rotateY: 0 })
  }, [])

  return (
    <div
      ref={cardRef}
      className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ perspective: "800px" }}
    >
      <div
        className={cn(
          "w-full h-full rounded-2xl",
          "bg-foreground/[0.03]",
          "border border-foreground/[0.08]",
          "flex items-center justify-center",
          "transition-colors duration-200",
          isHovered && "bg-foreground/[0.06] border-foreground/[0.15]"
        )}
        style={{
          transform: `rotateX(${isHovered ? transform.rotateX : 0}deg) rotateY(${isHovered ? transform.rotateY : 0}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out",
          willChange: isHovered ? "transform" : "auto",
        }}
      >
        {/* Logo Icon - monochrome */}
        <div
          className={cn(
            "w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl",
            "bg-gradient-to-br from-foreground/10 to-foreground/5",
            "border border-foreground/10",
            "flex items-center justify-center",
            "text-foreground/70 font-semibold text-xl md:text-2xl",
            "transition-colors duration-200",
            isHovered && "from-primary/20 to-primary/10 border-primary/20 text-primary"
          )}
          style={{
            transform: `translateZ(${isHovered ? 20 : 0}px)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          {logo.icon}
        </div>

        {/* Subtle shine effect on hover */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-foreground/[0.03] to-transparent"
          />
        )}
      </div>
    </div>
  )
})

interface CarouselColumnProps {
  logos: typeof sampleLogos
  direction: "up" | "down"
  speed?: number
}

const CarouselColumn = memo(function CarouselColumn({ logos, direction, speed = 25 }: CarouselColumnProps) {
  const [isPaused, setIsPaused] = useState(false)
  const columnRef = useRef<HTMLDivElement>(null)

  // Triple the logos for seamless loop
  const tripledLogos = [...logos, ...logos, ...logos]

  // Calculate total height for animation
  const itemHeight = 128 + 16 // lg:h-32 (128px) + gap-4 (16px)
  const totalHeight = logos.length * itemHeight

  return (
    <div
      className="relative h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={columnRef}
        className="flex flex-col gap-3 md:gap-4"
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {tripledLogos.map((logo, index) => (
          <LogoCard key={`${logo.id}-${index}`} logo={logo} />
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll-up {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, -${totalHeight}px, 0); }
        }
        @keyframes scroll-down {
          0% { transform: translate3d(0, -${totalHeight}px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
      `}</style>
    </div>
  )
})

export function LogoCarousel() {
  // Split logos into 5 columns
  const column1 = sampleLogos.slice(0, 4)
  const column2 = sampleLogos.slice(4, 8)
  const column3 = sampleLogos.slice(8, 12)
  const column4 = sampleLogos.slice(12, 16)
  const column5 = sampleLogos.slice(16, 20)

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main carousel container with rotation */}
      <div
        className="flex gap-3 md:gap-4 justify-center items-center"
        style={{
          transform: "rotate(5deg) translateY(-20px)",
          transformOrigin: "center center",
        }}
      >
        <div className="hidden sm:block">
          <CarouselColumn logos={column1} direction="down" speed={35} />
        </div>
        <CarouselColumn logos={column2} direction="up" speed={28} />
        <CarouselColumn logos={column3} direction="down" speed={32} />
        <CarouselColumn logos={column4} direction="up" speed={26} />
        <div className="hidden md:block">
          <CarouselColumn logos={column5} direction="down" speed={30} />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />

      {/* Left fade */}
      <div className="absolute top-0 left-0 bottom-0 w-16 md:w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />

      {/* Right fade */}
      <div className="absolute top-0 right-0 bottom-0 w-12 md:w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
    </div>
  )
}
