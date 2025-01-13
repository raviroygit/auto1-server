import axios from "axios";

export const sendSessionMessage = (waid: string, messageText: string) => {
  return new Promise(async (resolve, reject) => {
    const url =
      "https://live-mt-server.wati.io/389151/api/v1/sendSessionMessage/" + waid;
    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NmQ4YjZjNi1jNjM0LTQ5ZTctODA0MC0zOGRkM2IzY2RiNzIiLCJ1bmlxdWVfbmFtZSI6InJhdmlAa292aWwuYWkiLCJuYW1laWQiOiJyYXZpQGtvdmlsLmFpIiwiZW1haWwiOiJyYXZpQGtvdmlsLmFpIiwiYXV0aF90aW1lIjoiMDEvMDYvMjAyNSAxMDoxNzowNyIsInRlbmFudF9pZCI6IjM4OTE1MSIsImRiX25hbWUiOiJtdC1wcm9kLVRlbmFudHMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJERVZFTE9QRVIiLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.XvLWD1l_iCEQPKbiOx062FkSr4A4amotLC3O3oDIMsU";

    try {
      const response = await axios.post(
        `${url}?messageText=${encodeURIComponent(messageText)}`,
        null,
        {
          headers: {
            Accept: "*/*",
            Authorization: token,
          },
        }
      );
      resolve(response.data);
    } catch (error) {
      console.error("Error:", error);
      reject(error);
    }
  });
};
