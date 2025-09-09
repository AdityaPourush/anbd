'use client';

import { useEffect, useRef, useState } from 'react';
import Sections from './Sections';

// Helper functions
const PI2 = Math.PI * 2;
const random = (min: number, max: number) => Math.random() * (max - min + 1) + min | 0;
const timestamp = () => new Date().getTime();

interface Point {
  x: number;
  y: number;
}

class Firework {
  dead: boolean;
  offsprings: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  shade: number;
  history: Point[];
  madeChilds: boolean;

  constructor(x: number, y: number, targetX: number, targetY: number, shade: number, offsprings: number) {
    this.dead = false;
    this.offsprings = offsprings;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.shade = shade;
    this.history = [];
    this.madeChilds = false;
  }

  update(delta: number, ctx: CanvasRenderingContext2D, birthday: Birthday) {
    if (this.dead) return;

    const xDiff = this.targetX - this.x;
    const yDiff = this.targetY - this.y;
    
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      this.x += xDiff * 2 * delta;
      this.y += yDiff * 2 * delta;

      this.history.push({
        x: this.x,
        y: this.y
      });

      if (this.history.length > 20) this.history.shift();
    } else {
      if (this.offsprings && !this.madeChilds) {
        const babies = this.offsprings / 2;
        for (let i = 0; i < babies; i++) {
          const targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0;
          const targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0;

          birthday.fireworks.push(new Firework(
            this.x, this.y, targetX, targetY, this.shade, 0
          ));
        }
      }
      this.madeChilds = true;
      this.history.shift();
    }
    
    if (this.history.length === 0) {
      this.dead = true;
    } else if (this.offsprings) {
      for (let i = 0; this.history.length > i; i++) {
        const point = this.history[i];
        ctx.beginPath();
        ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)';
        ctx.arc(point.x, point.y, 1, 0, PI2, false);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)';
      ctx.arc(this.x, this.y, 1, 0, PI2, false);
      ctx.fill();
    }
  }
}

class Birthday {
  width!: number;
  height!: number;
  spawnA!: number;
  spawnB!: number;
  spawnC!: number;
  spawnD!: number;
  fireworks: Firework[];
  counter: number;

  constructor() {
    this.fireworks = [];
    this.counter = 0;
    this.resize();
  }
  
  resize() {
    this.width = window.innerWidth;
    const center = this.width / 2 | 0;
    this.spawnA = center - center / 4 | 0;
    this.spawnB = center + center / 4 | 0;
    
    this.height = window.innerHeight;
    this.spawnC = this.height * .1;
    this.spawnD = this.height * .5;
  }
  
  onClick(evt: MouseEvent | TouchEvent) {
    let x: number, y: number;
    
    if ('touches' in evt) {
      x = evt.touches[0].pageX;
      y = evt.touches[0].pageY;
    } else {
      x = (evt as MouseEvent).clientX;
      y = (evt as MouseEvent).clientY;
    }
     
    const count = random(3, 5);
    for (let i = 0; i < count; i++) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        x,
        y,
        random(0, 260),
        random(30, 110)
      ));
    }
          
    this.counter = -1;
  }
  
  update(delta: number, ctx: CanvasRenderingContext2D) {
    ctx.globalCompositeOperation = 'hard-light';
    ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalCompositeOperation = 'lighter';
    for (const firework of this.fireworks) {
      firework.update(delta, ctx, this);
    }

    this.counter += delta * 3;
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        random(0, this.width),
        random(this.spawnC, this.spawnD),
        random(0, 360),
        random(30, 110)
      ));
      this.counter = 0;
    }

    if (this.fireworks.length > 1000) {
      this.fireworks = this.fireworks.filter(firework => !firework.dead);
    }
  }
}


const Wishing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let then = timestamp();
    const birthday = new Birthday();

    const handleResize = () => {
      birthday.resize();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleClick = (evt: MouseEvent | TouchEvent) => {
      birthday.onClick(evt);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick);

    handleResize();

    let animationFrameId: number;

    const loop = () => {
      const now = timestamp();
      const delta = (now - then) / 1000;
      then = now;

      birthday.update(delta, ctx);
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Hide scroll prompt after 5 seconds
    const scrollPromptTimer = setTimeout(() => {
      setShowScrollPrompt(false);
    }, 5000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
      clearTimeout(scrollPromptTimer);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fireworks Canvas */}
      <div className="relative w-full h-screen">
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0 w-full h-full"
        />
        
        {/* Birthday Message */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-500 font-extrabold text-5xl md:text-7xl drop-shadow-lg mb-2 px-9 pb-2 select-none">
             Happy Birthday 
          </h1>
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-pink-500 font-extrabold text-4xl md:text-6xl drop-shadow-lg select-none pb-2 font-stretch-extra-expanded">
            Anisha
          </h2>
        </div>

        {/* Scroll Down Prompt */}
        {showScrollPrompt && (
          <div className="absolute bottom-8 right-8 z-20 animate-bounce">
            <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishing;