// extract image id from spotify url
// example url: https://i.scdn.co/image/ab67616d0000b273f84fea0f903316b4b3973aa3
export const extractImageId = (url: string) => {
  const id = url.split("/").pop();

  return id;
};
