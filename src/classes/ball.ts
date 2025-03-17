import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export class Ball {
    private readonly FRICTION = 0.9;
    private readonly ROTATION_FACTOR = 5; // How much the ball rotates based on velocity
    private velocity: THREE.Vector3;
    private container: THREE.Object3D;
    private loaded: boolean = false;
    private onLoadCallback?: () => void;

    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.container = new THREE.Object3D();
        this.loadBallModel();
    }

    private loadBallModel(): void {
        const objLoader = new OBJLoader();
        objLoader.load(
            '/src/assets/ball.obj',
            (object) => {
                object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        if (!child.material) {
                            child.material = new THREE.MeshStandardMaterial({ 
                                color: 0xffffff 
                            });
                        }
                    }
                });
                
                object.scale.set(0.2, 0.2, 0.2);
                this.container.add(object);
                this.loaded = true;
                if (this.onLoadCallback) {
                    this.onLoadCallback();
                }
            },
         
        );
    }
    
    update(): void {
        this.velocity.multiplyScalar(this.FRICTION);
        
        const deltaMove = this.velocity.clone();
        const newPosition = this.container.position.clone().add(deltaMove);
        this.container.position.copy(newPosition);

        if (this.velocity.lengthSq() > 0.0001) {
            const speed = this.velocity.length();
            const rotationAxis = new THREE.Vector3(-this.velocity.z, 0, this.velocity.x).normalize();
            this.container.rotateOnAxis(rotationAxis, speed * this.ROTATION_FACTOR);
        }
    }
    
    public getMesh(): THREE.Object3D {
        return this.container;
    }
    
    public getPosition(): THREE.Vector3 {
        return this.container.position.clone();
    }
    
    public setPosition(x: number, y: number, z: number): void {
        this.container.position.set(x, y, z);
        this.velocity.set(0, 0, 0);
    }
    
    public addToVelocity(force: THREE.Vector2): void {
        this.velocity.x += force.x;
        this.velocity.z += force.y;
    }

    public onLoad(callback: () => void): void {
        if (this.loaded) {
            callback();
        } else {
            this.onLoadCallback = callback;
        }
    }
}