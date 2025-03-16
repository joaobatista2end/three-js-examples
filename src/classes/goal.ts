import * as THREE from 'three';

export class Goal {
    private readonly width: number;
    private readonly height: number;
    private readonly depth: number;
    private mesh: THREE.Group;

    constructor(position: THREE.Vector3, width: number = 4, height: number = 2, depth: number = 1) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.mesh = new THREE.Group();
        
        this.createGoalFrame();
        this.mesh.position.copy(position);
    }

    private createGoalFrame() {
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            side: THREE.DoubleSide 
        });

        // Posts (vertical bars)
        const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, this.height, 8);
        const leftPost = new THREE.Mesh(postGeometry, material);
        leftPost.position.set(-this.width/2, this.height/2, 0);
        
        const rightPost = new THREE.Mesh(postGeometry, material);
        rightPost.position.set(this.width/2, this.height/2, 0);

        // Crossbar (top bar)
        const crossbarGeometry = new THREE.CylinderGeometry(0.1, 0.1, this.width, 8);
        const crossbar = new THREE.Mesh(crossbarGeometry, material);
        crossbar.rotation.z = Math.PI/2;
        crossbar.position.set(0, this.height, 0);

        // Back supports
        const backPostLeft = new THREE.Mesh(postGeometry, material);
        backPostLeft.position.set(-this.width/2, this.height/2, -this.depth);
        
        const backPostRight = new THREE.Mesh(postGeometry, material);
        backPostRight.position.set(this.width/2, this.height/2, -this.depth);
        
        const backCrossbar = new THREE.Mesh(crossbarGeometry, material);
        backCrossbar.rotation.z = Math.PI/2;
        backCrossbar.position.set(0, this.height, -this.depth);

        // Top supports
        const topSupportGeometry = new THREE.CylinderGeometry(0.1, 0.1, this.depth, 8);
        const topSupportLeft = new THREE.Mesh(topSupportGeometry, material);
        topSupportLeft.rotation.x = Math.PI/2;
        topSupportLeft.position.set(-this.width/2, this.height, -this.depth/2);
        
        const topSupportRight = new THREE.Mesh(topSupportGeometry, material);
        topSupportRight.rotation.x = Math.PI/2;
        topSupportRight.position.set(this.width/2, this.height, -this.depth/2);

        // Add all parts to the goal mesh
        this.mesh.add(
            leftPost, rightPost, crossbar,
            backPostLeft, backPostRight, backCrossbar,
            topSupportLeft, topSupportRight
        );

        // Configure shadows
        this.mesh.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }

    public getMesh(): THREE.Group {
        return this.mesh;
    }

    public checkGoal(ballPosition: THREE.Vector3): boolean {
        const localBallPos = ballPosition.clone().sub(this.mesh.position);
        return (
            Math.abs(localBallPos.x) < this.width/2 &&
            localBallPos.y < this.height &&
            Math.abs(localBallPos.z) < this.depth/2
        );
    }
}
