export const stringfyBody=(prompt:string)=>{
    return JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a retail conversation analysis expert. Always return valid JSON with complete data structures. Focus on accurate speaker identification and engagement metrics.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 2000, // Limit tokens to reduce cost and improve reliability
      });
}