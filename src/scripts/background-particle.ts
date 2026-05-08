import _ from "lodash";

type HexColor = `#${string}`;

type Figures = 'bubble' | 'line' | 'triangle';

type ParticleStateType = {
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    particles: Particle[];
    colors: HexColor[];
    max: number;
    stats: null;
}

const state: ParticleStateType = {
    max: 120,
    canvas: null,
    context: null,
    particles: [],
    stats: null,
    colors: ['#FF5507', '#070E14', '#67e241']
};

(window as any).debug = { state, color: state.colors };

class Particle {
    private id: number;
    private currentCanvas: HTMLCanvasElement;
    private readonly currentContext: CanvasRenderingContext2D | null;

    private readonly type: Figures;
    private inBounds: boolean;
    private coords: {
        x: number;
        y: number;
    };
    private velocity: {
        x: number;
        y: number;
    };
    private alpha: number;
    private readonly hex: HexColor;
    private color: string;
    private readonly strokeWidth: number;

    // Current Figure for bubble
    private readonly diameter: number | undefined;

    // Figure Line
    private angle: number | undefined;
    private readonly length: number | undefined;
    private readonly rotateSpeed: number | undefined;
    private readonly rotateClockwise: boolean | undefined;

    constructor (id = 0, canvas: HTMLCanvasElement) {
        this.id = id;
        this.currentCanvas = canvas;
        this.currentContext = this.currentCanvas.getContext('2d');
        this.type = this.randomizeType()
        this.inBounds = false
        this.coords = {
            x: Math.round(Math.random() * canvas.width),
            y: Math.round(Math.random() * canvas.height)
        }

        this.velocity = {
            x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.7),
            y: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.7)
        }

        this.alpha = 0.1
        this.hex = this.randomFromArray(state.colors) || '#000000';
        this.color = this.hexToRGBA(this.hex, this.alpha)
        this.strokeWidth = Math.random() * (Math.random() > 0.5 ? 1.5 : 2.5)

        switch(this.type) {
            case 'bubble':
                this.diameter = this.getCircleDiameter()
                break;
            case 'line':
                this.angle = Math.atan2(this.coords.y, this.coords.x)
                this.length = this.randomFromArray([5, 7, 3, 10])
                this.rotateSpeed = this.randomFromArray([10, 30, 60, 120])
                this.rotateClockwise = Math.random() < 0.5
                break;
            case 'triangle':
                this.angle = Math.atan2(this.coords.y, this.coords.x)
                this.length = this.randomFromArray([5, 7, 3, 10]);
                this.rotateSpeed = this.randomFromArray([10, 30, 60, 120])
                this.rotateClockwise = Math.random() < 0.5
        }
    }

    getCircleDiameter () {
        let diameter = 0
        while(diameter < 2) {
            diameter = (Math.random() * 7) * 2
        }
        return diameter
    }

    update () {
        if (this.alpha < 1) {
            this.alpha += 0.01
            this.color = this.hexToRGBA(this.hex, this.alpha)
        }

        this.coords.x += this.velocity.x
        this.coords.y += this.velocity.y

        if (this.type === 'line' || this.type === 'triangle') {
            if(!this.rotateSpeed || !this.angle) {
                return this.withinBounds();
            }
            const angle = Math.PI / this.rotateSpeed;
            this.angle += this.rotateClockwise ? -Math.abs(angle) : Math.abs(angle);
        }

        return this.withinBounds()
    }

    draw () {
        if(!this.currentContext) {
            return;
        }

        this.currentContext.lineWidth = this.strokeWidth
        this.currentContext.strokeStyle = this.color
        this.currentContext.save()

        switch (this.type) {
            case 'line':
                if(!this.angle || !this.length) {
                    break;
                }
                this.currentContext.translate(this.coords.x / 2, this.coords.y / 2)
                this.currentContext.rotate(this.angle)
                this.currentContext.beginPath()
                this.currentContext.moveTo(-this.length / 2, 0)
                this.currentContext.lineTo(this.length / 2, 0)
                break;
            case 'bubble':
                if(!this.diameter) {
                    break;
                }
                this.currentContext.beginPath()
                this.currentContext.arc(this.coords.x, this.coords.y, this.diameter, 0, Math.PI * 2, false)
                break;
            case 'triangle':
                if(!this.angle || !this.length) {
                    break;
                }

                this.currentContext.translate(this.coords.x / 2, this.coords.y / 2);
                this.currentContext.rotate(this.angle);

                this.currentContext.beginPath();
                this.currentContext.moveTo(0,  -this.length / 2);
                this.currentContext.lineTo(-this.length / 2, this.length / 2);
                this.currentContext.lineTo(this.length / 2, this.length / 2);
                this.currentContext.closePath();
                break;
        }

        this.currentContext.stroke()
        this.currentContext.restore()
    }

    withinBounds () {
        let boundX = (this.currentCanvas.width / 2 ) + 5;
        let boundY = (this.currentCanvas.height / 2) + 5;
        let x = this.coords.x / 2;
        let y = this.coords.y / 2;

        this.inBounds = !((x > boundX || x < 0 - 5) || (y > boundY || y < 0 - 5));

        return this.inBounds;
    }

    hexToRGBA (hex: HexColor, alpha: number) {
        const trimHex = (hex: HexColor) => {
            return hex.replace('#', '')
        }

        let red = parseInt(trimHex(hex).substring(0, 2), 16)
        let green = parseInt(trimHex(hex).substring(2, 4), 16)
        let blue = parseInt(trimHex(hex).substring(4, 6), 16)

        return `rgba(${red}, ${green}, ${blue}, ${alpha})`
    }

    randomFromArray<T> (arr: T[]) {
        return _.sample(_.shuffle(arr))
    }

    randomizeType () {
        let types = Array(3).fill('bubble')
        types.push('line')
        types.push('triangle')
        return this.randomFromArray(types)
    }
}

const updateCanvasSize = (canvas: HTMLCanvasElement) => {
    if(!canvas || !canvas.parentElement) {
        return;
    }
    canvas.width = canvas.parentElement.offsetWidth * 2
    canvas.height = canvas.parentElement.offsetHeight * 2
    canvas.style.width = canvas.parentElement.offsetWidth + 'px'
    canvas.style.height = canvas.parentElement.offsetHeight + 'px'
}

let pids = 0
const generate = (canvas: HTMLCanvasElement) => {
    if(state.particles.length < state.max) {
        for(let i = state.particles.length; i < state.max; i++) {
            state.particles.push(new Particle(pids++, canvas))
        }
    }
}

const update = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    if(state.particles.length < state.max - 5) {
        generate(canvas)
    }

    state.particles = state.particles.filter(particle => particle.update())

    // Render the canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
    state.particles.forEach(particle => particle.draw())

    // DO IT AGAIN!
    requestAnimationFrame(() => update(canvas, context));
}

// inicio
const init = () => {
    const canvasElement: HTMLCanvasElement | null = document.querySelector('#canvas-particles');
    if(!canvasElement) {
        return console.error('No se encontró el canvas de destino');
    }
    const context: CanvasRenderingContext2D | null = canvasElement.getContext('2d')
    if(!context) {
        return console.error('No se encontró el contexto de destino');
    }

    state.canvas = canvasElement;
    state.context = context;
    updateCanvasSize(canvasElement);
    generate(canvasElement);
    update(canvasElement, context);

    const refreshButton = document.querySelector('#refresh-button');
    const logButton = document.querySelector("#log-button")

    if(refreshButton) {
        refreshButton.addEventListener('click', (event) =>{
            event.preventDefault();
            if(!state.canvas) {
                return;
            }
            state.particles = [];
            state.context?.clearRect(0,0, state.canvas.width, state.canvas.height);
        })
    }

    if(logButton) {
        logButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log(state.particles);
        })
    }

    window.addEventListener('resize', () => updateCanvasSize(canvasElement));
}

document.addEventListener('DOMContentLoaded', () => init())