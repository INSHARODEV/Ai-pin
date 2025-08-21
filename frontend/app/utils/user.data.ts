export const userData = (encodedPart: string) => {
    console.log('encodedPart',encodedPart)
    try {
        // Split the JWT and get only the payload (middle part)

       // Convert Base64Url to standard Base64
      const base64 = encodedPart.replace(/-/g, '+').replace(/_/g, '/');
      
      // Add padding if needed
      const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4);
      
      // Decode the Base64 string
      const decoded = window.atob(paddedBase64);
      
      // Handle UTF-8 characters
      const jsonPayload = decodeURIComponent(decoded.split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      
      return JSON.parse(jsonPayload).payload.user;
    } catch (error:any) {
      throw new Error('Invalid JWT payload: ' + error.message);
    }
  }