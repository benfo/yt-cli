export function normalize(
  value: string | undefined,
  maxLength: number
): string {
  if (value == null) return "";

  let normalizedValue: string = value
    ? value
        .trim()
        .toLowerCase()
        .replace(/([^a-zA-Z]+)/gi, "-")
    : "";

  return clamp(normalizedValue, maxLength, "-");
}

export function clamp(
  value: string,
  length: number,
  separator: string
): string {
  if (value.length <= length) return value;

  while (value.length > length) {
    const index = value.lastIndexOf(separator);
    if (index < 1) {
      value = value.substr(0, length);
      break;
    }

    value = value.substr(0, index);
  }
  return value;
}
