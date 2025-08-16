export const exponentialBackoff = async(fn, maxRetries = 3, baseDelay = 1000)=> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (error.status === 429 && i < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
          console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
  }