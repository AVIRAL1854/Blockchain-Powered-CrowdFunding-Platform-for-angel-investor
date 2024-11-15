// Define the target date: November 8, 2024, at 00:00:00 UTC
const targetDate = new Date(Date.UTC(2024, 10, 8, 0, 0, 0));

// Calculate Unix timestamp (in seconds)
const timestamp = Math.floor(targetDate.getTime() / 1000);

console.log(timestamp); // Output: 1731024000
export default timestamp;