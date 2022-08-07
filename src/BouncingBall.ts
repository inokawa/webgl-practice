// Helper class to encapsulate the the bouncing ball behavior.
export class BouncingBall {
  private gravity: number;
  position: [number, number, number];
  private H0: number;
  private V0: number;
  private VF: number;
  private HF: number;
  private bouncingTime: number;
  private BOUNCINESS: number;
  color: [number, number, number, number];

  constructor(gravity: number) {
    this.gravity = gravity;
    this.position = generatePosition();

    this.H0 = this.position[1];
    this.V0 = 0;
    this.VF = Math.sqrt(2 * gravity * this.H0);
    this.HF = 0;

    this.bouncingTime = 0;
    this.BOUNCINESS = Math.random() + 0.5;

    this.color = [Math.random(), Math.random(), Math.random(), 1];
  }

  update(time: number) {
    const gravity = this.gravity;
    const t = time - this.bouncingTime;
    const h = this.H0 + this.V0 * t - 0.5 * gravity * t * t;

    if (h <= 0) {
      this.bouncingTime = time;
      this.V0 = this.VF * this.BOUNCINESS;
      this.HF = (this.V0 * this.V0) / (2 * gravity);
      this.VF = Math.sqrt(2 * gravity * this.HF);
      this.H0 = 0;
    } else {
      this.position[1] = h;
    }
  }
}

// Generate a random position
function generatePosition(): [number, number, number] {
  return [
    Math.floor(Math.random() * 50) - Math.floor(Math.random() * 50),
    Math.floor(Math.random() * 30) + 50,
    Math.floor(Math.random() * 50),
  ];
}
