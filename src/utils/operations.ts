export const degrees = (degrees: number) => {
  let radians = (degrees * Math.PI) / 180;
  while (radians > Math.PI) radians -= 2 * Math.PI;
  while (radians < -Math.PI) radians += 2 * Math.PI;

  return radians;
};
