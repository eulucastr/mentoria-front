export const getExpiryTimestamp = (minutes: number): Date => {
  const currentTime = new Date();
  const expiryTime = new Date(currentTime.getTime() + minutes * 60 * 1000);
  return expiryTime;
}