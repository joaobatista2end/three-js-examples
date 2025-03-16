import * as THREE from 'three';
import type { Ball } from './ball';
import { TimeService } from './time';

export class Player {
    private readonly SPEED = 5;
    private readonly FORCE = 10;
    private readonly FRICTION = 0.9;
    
    private velocity: THREE.Vector3;
    private mesh: THREE.Group;
    private container: THREE.Object3D;
    
    constructor(color: number = 0xff0000) {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.container = new THREE.Object3D();
        
        // Create player mesh
        this.mesh = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 32);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffdead });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.1;
        
        this.mesh.add(body, head);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
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
    
    move(direction: THREE.Vector2) {
        const normalizedDirection = direction.clone().normalize();
        this.velocity.x += normalizedDirection.x * this.SPEED;
        this.velocity.z += normalizedDirection.y * this.SPEED;
    }

    kick(ball: Ball) {
        const ballPos = ball.getPosition();
        const playerPos = this.getPosition();
        const direction = ballPos.clone().sub(playerPos).normalize();
        ball.addToVelocity(direction.multiplyScalar(this.FORCE));
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
}
