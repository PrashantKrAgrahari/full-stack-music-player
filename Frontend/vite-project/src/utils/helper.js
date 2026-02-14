export const formatTime = (seconds) => {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return "00:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  // padStart(2, '0') ensures "3" becomes "03" and "5" becomes "05"
  const mm = String(minutes).padStart(2, '0');
  const ss = String(remainingSeconds).padStart(2, '0');
  
  // Use the colon (:) here
  return `${mm}:${ss}`; 
};