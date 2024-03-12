type Nullable<T> = T | null | undefined;

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
