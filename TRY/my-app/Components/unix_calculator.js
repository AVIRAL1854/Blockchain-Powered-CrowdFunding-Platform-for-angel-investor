const EpochConverter = {
  /**
   * Converts a human-readable date to a Unix epoch timestamp in seconds.
   * @param {number} year - The year (e.g., 2024).
   * @param {number} month - The month (1-12).
   * @param {number} date - The day of the month (1-31).
   * @param {number} hour - The hour (0-23).
   * @param {number} minute - The minute (0-59).
   * @param {number} second - The second (0-59).
   * @returns {number} - Unix epoch timestamp in seconds.
   */
  toTimestamp: (year, month, date, hour = 0, minute = 0, second = 0) => {
    // Create a UTC Date object
    const targetDate = new Date(
      Date.UTC(year, month - 1, date, hour, minute, second)
    ); // Month is 0-indexed in JS
    // Convert to Unix timestamp (seconds)
    return Math.floor(targetDate.getTime() / 1000);
  },

  /**
   * Converts a Unix epoch timestamp (in seconds) to a human-readable date.
   * @param {number} timestamp - Unix epoch timestamp in seconds.
   * @returns {string} - Human-readable date in 'YYYY-MM-DD HH:mm:ss' format (UTC).
   */
  fromTimestamp: (timestamp) => {
    // Create a Date object from the timestamp (convert seconds to milliseconds)
    const date = new Date(timestamp * 1000);
    // Format the date as 'YYYY-MM-DD HH:mm:ss' (UTC)
    return date.toISOString().replace("T", " ").substring(0, 19); // Trim milliseconds and 'Z'
  },
};

export default EpochConverter;
