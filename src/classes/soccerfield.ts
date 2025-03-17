import * as THREE from 'three';
import { degrees } from '../utils/operations';
import { Goal } from './goal';

export class SoccerField {
  private group: THREE.Group;
  private goals: Goal[];

  constructor() {
    this.group = new THREE.Group();
    this.goals = [];
    this.createField();
    this.createLines();
    this.createGoals();
  }

  private createField() {
    // Create the field plane
    const geometry = new THREE.PlaneGeometry(30, 20);
    const material = new THREE.MeshPhongMaterial({
      color: 0x2e7d32,
      side: THREE.DoubleSide
    });

    const field = new THREE.Mesh(geometry, material);
    field.rotation.x = -Math.PI / 2;
    field.receiveShadow = true;
    this.group.add(field);
  }

  private createLines() {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    // Field outline
    const outlineGeometry = new THREE.BufferGeometry();
    const outlineVertices = new Float32Array([
      -15, 0.01, -10,  // Start at top-left corner
      15, 0.01, -10,   // Top line
      15, 0.01, 10,    // Right line
      -15, 0.01, 10,   // Bottom line
      -15, 0.01, -10   // Left line back to start
    ]);
    outlineGeometry.setAttribute('position', new THREE.BufferAttribute(outlineVertices, 3));
    const outline = new THREE.Line(outlineGeometry, lineMaterial);
    this.group.add(outline);

    // Center line
    const centerLineGeometry = new THREE.BufferGeometry();
    const centerLineVertices = new Float32Array([
      0, 0.01, -10,
      0, 0.01, 10
    ]);
    centerLineGeometry.setAttribute('position', new THREE.BufferAttribute(centerLineVertices, 3));
    const centerLine = new THREE.Line(centerLineGeometry, lineMaterial);
    this.group.add(centerLine);

    // Center circle
    const circlePoints = [];
    const segments = 32;
    const radius = 3;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      circlePoints.push(
        Math.cos(theta) * radius,
        0.01,
        Math.sin(theta) * radius
      );
    }
    const circleGeometry = new THREE.BufferGeometry();
    circleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(circlePoints, 3));
    const circle = new THREE.Line(circleGeometry, lineMaterial);
    this.group.add(circle);
  }

  private createGoals() {
    // Create goals on both sides
    const goalLeft = new Goal(new THREE.Vector3(-14.5, 0, 0));
    const goalRight = new Goal(new THREE.Vector3(14.5, 0, 0));
    
    // Rotate goals to face each other
    goalLeft.getMesh().rotation.y = degrees(-90); // Rotate left goal 90 degrees counterclockwise
    goalRight.getMesh().rotation.y = degrees(90);  // Rotate right goal 90 degrees clockwise
    
    // Add goals to the list and to the scene
    this.goals.push(goalLeft, goalRight);
    this.group.add(goalLeft.getMesh());
    this.group.add(goalRight.getMesh());
  }

  public getMesh(): THREE.Group {
    return this.group;
  }

  public checkGoals(ballPosition: THREE.Vector3): string {
    if (this.goals[0].checkGoal(ballPosition)) {
      return 'Gol para o time da direita!';
    } else if (this.goals[1].checkGoal(ballPosition)) {
      return 'Gol para o time da esquerda!';
    }
    return '';
  }
}
