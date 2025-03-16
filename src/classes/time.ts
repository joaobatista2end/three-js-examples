import * as THREE from 'three';

class Time {
  private clock = new THREE.Clock();

  get deltaTime(): number {
    return this.clock.getDelta();
  }

  get elapsedTime(): number {
    return this.clock.getElapsedTime();
  }

  reset() {
    this.clock = new THREE.Clock();
  }
}

export const TimeService = new Time();