type QualifierIdentifier = {
  readonly qualifier: string;
  readonly identifier: string;
};

export function parseUrlPath(urlPath: string): QualifierIdentifier[] {
  const cleanPath = urlPath.split("?")[0];
  const segments = cleanPath.split("/").filter((segment) => segment.length > 0);

  const result: QualifierIdentifier[] = [];

  for (let i = 0; i < segments.length; i += 2) {
    const qualifier = segments[i];
    const identifier = segments[i + 1];

    if (qualifier && identifier) {
      result.push({
        qualifier: segments[i],
        identifier: segments[i + 1],
      });
    }
  }

  return result;
}
