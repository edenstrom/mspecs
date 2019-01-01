export const isNotNull = <T>(input: T | null | undefined): input is T =>
  !!input;
