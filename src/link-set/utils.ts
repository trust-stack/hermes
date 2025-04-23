import {parseUrlPath} from "../link-resolver/utils";

export type LinkSet = {
  readonly qualifier: string;
  readonly identifier: string;
  readonly childLinkSets: LinkSet[];
};

export function urlToLinkSet(url: string): LinkSet {
  const segments = parseUrlPath(url);

  if (segments.length === 0) {
    throw new Error(
      "Invalid URL: must contain at least one qualifier/identifier pair"
    );
  }

  // Get the first segment as the root LinkSet
  const [root, ...rest] = segments;

  // If there are more segments, recursively build child LinkSets
  const remainingPath =
    rest.length > 0
      ? rest
          .map((segment) => `/${segment.qualifier}/${segment.identifier}`)
          .join("")
      : "";

  // Create the LinkSet with children if they exist
  return {
    qualifier: root.qualifier,
    identifier: root.identifier,
    childLinkSets: remainingPath ? [urlToLinkSet(remainingPath)] : [],
  };
}

export function linkSetToUrl(linkSet: LinkSet): string {
  // Start with the root qualifier/identifier pair
  let url = `/${linkSet.qualifier}/${linkSet.identifier}`;

  // Recursively append child LinkSets if they exist
  if (linkSet.childLinkSets.length > 0) {
    url += linkSetToUrl(linkSet.childLinkSets[0]);
  }

  return url;
}
