import * as THREE from 'three';
import { TimeService } from './time';

export class Ball {
    private readonly FRICTION = 0.9;
    private velocity: THREE.Vector3;
    private mesh: THREE.Mesh;
    private container: THREE.Object3D;

    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.container = new THREE.Object3D();
        
        // Create ball mesh
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.position.y = 0.2;
        
        this.container.add(this.mesh);
    }
    
    update() {
        // Apply friction
        this.velocity.multiplyScalar(this.FRICTION);
        
        // Update position
        const deltaMove = this.velocity.clone().multiplyScalar(TimeService.deltaTime);
        const newPosition = this.container.position.clone().add(deltaMove);
        this.container.position.copy(newPosition);
    }
    
    public getMesh(): THREE.Object3D {
        return this.container;
    }
    
    public getPosition(): THREE.Vector2 {
        return new THREE.Vector2(this.container.position.x, this.container.position.z);
    }
    
    public setPosition(x: number, z: number): void {
        this.container.position.set(x, 0, z);
        this.velocity.set(0, 0, 0);
    }
    
    public addToVelocity(force: THREE.Vector2): void {
        this.velocity.x += force.x;
        this.velocity.z += force.y;
    }
}