import * as THREE from 'three';
import type { Ball } from './ball';
import { TimeService } from './time';

export class Player {
    private readonly SPEED = 1; // Further reduced speed for better control
    private readonly MAX_KICK_FORCE = 15;
    private readonly MIN_KICK_FORCE = 3;
    private readonly FRICTION = 0.9;
    private readonly KICK_DISTANCE = 2; // Maximum distance to kick the ball
    private readonly FIELD_WIDTH = 30;
    private readonly FIELD_HEIGHT = 20;
    private readonly FIELD_MARGIN = 1; // Margin from field edges
    private readonly COLLISION_FORCE = 0.05; // Reduced collision force
    private readonly PLAYER_RADIUS = 0.5; // Radius for collision detection
    
    private velocity: THREE.Vector3;
    private mesh: THREE.Group;
    private container: THREE.Object3D;
    private isKicking: boolean = false;
    private kickStartTime: number = 0;
    
    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.container = new THREE.Object3D();
        
        // Create player mesh as a cone
        this.mesh = new THREE.Group();
        
        // Body (cone)
        const bodyGeometry = new THREE.ConeGeometry(0.5, 1.5, 32);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        
        // Rotate to make the point face up (default cone points up already)
        
        this.mesh.add(body);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        this.container.add(this.mesh);
    }

    update(ball: Ball): void {
        // Apply friction
        this.velocity.multiplyScalar(this.FRICTION);
        
        // Calculate new position based on velocity
        const deltaMove = this.velocity.clone().multiplyScalar(TimeService.deltaTime);
        let newPosition = this.container.position.clone().add(deltaMove);
        
        // Clamp position within field boundaries
        newPosition.x = Math.max(-(this.FIELD_WIDTH/2 - this.FIELD_MARGIN), Math.min(this.FIELD_WIDTH/2 - this.FIELD_MARGIN, newPosition.x));
        newPosition.z = Math.max(-(this.FIELD_HEIGHT/2 - this.FIELD_MARGIN), Math.min(this.FIELD_HEIGHT/2 - this.FIELD_MARGIN, newPosition.z));
        
        // Apply movement
        this.container.position.copy(newPosition);

        // Check collision with ball
        const ballPos = ball.getPosition();
        const playerPos = this.getPosition();
        const distance = new THREE.Vector2(ballPos.x - playerPos.x, ballPos.z - playerPos.z).length();
        
        if (distance < this.PLAYER_RADIUS + 0.2) {
            const direction = new THREE.Vector2(
                ballPos.x - playerPos.x,
                ballPos.z - playerPos.z
            ).normalize();
            
            const collisionForce = Math.min(this.velocity.length() * this.COLLISION_FORCE, 2);
            ball.addToVelocity(direction.multiplyScalar(collisionForce));
        }
    }
    
    move(direction: THREE.Vector2) {
        const normalizedDirection = direction.clone().normalize();
        this.velocity.x += normalizedDirection.x * this.SPEED;
        this.velocity.z += normalizedDirection.y * this.SPEED;
        
        // Rotate player to face movement direction
        if (direction.lengthSq() > 0) {
            const angle = Math.atan2(direction.x, direction.y);
            this.container.rotation.y = angle;
        }
    }

    startKick() {
        if (!this.isKicking) {
            this.isKicking = true;
            this.kickStartTime = TimeService.elapsedTime;
        }
    }

    endKick(ball: Ball) {
        if (this.isKicking) {
            const ballPos = ball.getPosition();
            const playerPos = this.getPosition();
            const distance = new THREE.Vector2(ballPos.x - playerPos.x, ballPos.z - playerPos.z).length();
            
            if (distance <= this.KICK_DISTANCE) {
                const holdTime = TimeService.elapsedTime - this.kickStartTime;
                const kickForce = Math.min(
                    this.MIN_KICK_FORCE + (holdTime * 10),
                    this.MAX_KICK_FORCE
                );
                
                const direction = new THREE.Vector2(
                    ballPos.x - playerPos.x,
                    ballPos.z - playerPos.z
                ).normalize();
                
                ball.addToVelocity(direction.multiplyScalar(kickForce));
                
                // No animation after kicking
            }
            
            this.isKicking = false;
        }
    }
    
    public getMesh(): THREE.Object3D {
        return this.container;
    }
    
    public getPosition(): THREE.Vector3 {
        return this.container.position.clone();
    }
    
    public setPosition(x: number, z: number): void {
        this.container.position.set(x, 0, z);
        this.velocity.set(0, 0, 0);
    }
}
