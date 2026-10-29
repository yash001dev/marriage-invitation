import type { ElementType, HTMLAttributes } from "react";
import { isBlank } from "@/lib/utils";

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  html?: string | null;
};

/**
 * Renders a line of text from the config (which may contain <br>).
 * An empty value renders nothing, so deleting a line in the config makes it
 * vanish rather than leaving a gap.
 */
export default function Html({ as: Tag = "p", html, ...rest }: Props) {
  if (isBlank(html)) return null;
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html as string }} />;
}

/** the  —✦—  divider used under every heading */
export function Rule({ reveal = true }: { reveal?: boolean }) {
  return (
    <div className={reveal ? "rule reveal" : "rule"} aria-hidden="true">
      <i />
      <span>&#10022;</span>
      <i />
    </div>
  );
}
