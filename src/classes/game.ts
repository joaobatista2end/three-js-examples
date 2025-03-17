import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Ball } from './ball';
import { Player } from './player';
import { SoccerField } from './soccerfield';

export class Game {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private soccerField: SoccerField;
    private ball: Ball;
    private player: Player;
    private keys: { [key: string]: boolean } = {};
    private boundHandleKeyDown: (event: KeyboardEvent) => void;
    private boundHandleKeyUp: (event: KeyboardEvent) => void;
    private boundHandleResize: () => void;
    
    constructor(container: HTMLElement) {
        // Initialize event handlers
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.boundHandleKeyUp = this.handleKeyUp.bind(this);
        this.boundHandleResize = this.onWindowResize.bind(this);

        // Initialize scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Sky blue background
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 30, 20);
        this.camera.lookAt(0, 0, 0);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);
        
        // Setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);
        
        // Create soccer field
        this.soccerField = new SoccerField();
        this.scene.add(this.soccerField.getMesh());
        
        // Create ball
        this.ball = new Ball();
        this.ball.onLoad(() => {
            this.ball.setPosition(0, 0.2, 0);
            this.scene.add(this.ball.getMesh());
        });

        // Create player
        this.player = new Player();
        this.player.setPosition(-5, 0);
        this.scene.add(this.player.getMesh());
        
        // Setup input handlers
        this.setupInputHandlers();
        
        // Handle window resize
        window.addEventListener('resize', this.boundHandleResize);
    }
    
    private setupInputHandlers(): void {
        window.addEventListener('keydown', this.boundHandleKeyDown);
        window.addEventListener('keyup', this.boundHandleKeyUp);
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this.keys[event.code] = true;
        
        if (event.code === 'Space' && !event.repeat) {
            this.player.startKick();
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        this.keys[event.code] = false;
        
        if (event.code === 'Space') {
            this.player.endKick(this.ball);
        }
    }
    
    private handleInput(): void {
        const direction = new THREE.Vector2(0, 0);
        
        if (this.keys['KeyW'] || this.keys['ArrowUp']) direction.y -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) direction.y += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) direction.x -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) direction.x += 1;
        
        if (direction.lengthSq() > 0) {
            this.player.move(direction);
        }
    }
    
    private onWindowResize(): void {
        const container = this.renderer.domElement.parentElement;
        if (!container) return;
        
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    public update(): void {
        this.handleInput();
        
        // Update game objects
        this.ball.update();
        this.player.update(this.ball);
        
        // Check for goals
        const goalMessage = this.soccerField.checkGoals(this.ball.getPosition());
        if (goalMessage) {
            console.log(goalMessage);
            // Reset ball position after goal
            this.ball.setPosition(0, 0.2, 0);
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    public dispose(): void {
        window.removeEventListener('resize', this.boundHandleResize);
        window.removeEventListener('keydown', this.boundHandleKeyDown);
        window.removeEventListener('keyup', this.boundHandleKeyUp);
        this.renderer.dispose();
        this.controls.dispose();
    }
}