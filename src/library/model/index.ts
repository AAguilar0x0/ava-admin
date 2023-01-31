/* eslint-disable @typescript-eslint/no-explicit-any */
type TOptions = {
  strip?: boolean;
  cleanMeta?: boolean;
};

export type ValidRecord = Record<string, any>;

export default function RecordToType<T>(
  record: ValidRecord,
  defaultValues: T,
  options?: TOptions
): T {
  const data: Partial<T> = options?.strip ? {} : { ...defaultValues };
  Object.entries(defaultValues as ValidRecord).map(([key]) => {
    if ((!(options && options.cleanMeta) || key.charAt(0) !== '_') && key in record) {
      data[key as keyof T] = record[key];
    }
  });

  return data as T;
}
