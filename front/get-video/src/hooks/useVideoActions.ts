'use client'

export const useVideoActions = () => {
  async function downloadVideo(url: string) {
    const response = await fetch(`http://localhost:8080/download?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This allows cookies to be sent with the request
    });

    return response.blob();
  }

  return {
    downloadVideo
  };
};
