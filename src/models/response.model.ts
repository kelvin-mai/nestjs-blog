export type ResponseObject<K extends string, T> = {
  [P in K]: T;
};
