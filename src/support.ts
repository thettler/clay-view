export const mapObject = (obj: { [key: string]: any }, callback: (value: any, key: string) => any) => {
  const newObj: { [key: string]: any } = {};

  Object.keys(obj).forEach((key: string) => {
    newObj[key] = callback(obj[key], key);
  });

  return newObj;
};

export const mapObjectWithKey = (obj: { [key: string]: any }, callback: (value: any, key: string) => any) => {
  let newObj: { [key: string]: any } = {};

  Object.keys(obj).forEach((key: string) => {
    newObj = { ...newObj, ...callback(obj[key], key) };
  });

  return newObj;
};
