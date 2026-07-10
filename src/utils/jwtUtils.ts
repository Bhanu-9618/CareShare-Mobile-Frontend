const atob = (input: string = '') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = input.replace(/=+$/, '');
  let output = '';

  if (str.length % 4 == 1) {
    throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (let bc = 0, bs = 0, buffer, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }

  return output;
};

export const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    

    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    

    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
      }
      base64 += new Array(5 - pad).join('=');
    }
    

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};
