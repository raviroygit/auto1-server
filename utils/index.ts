export const cleanData = (data: any) => {
  return data
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim();
};