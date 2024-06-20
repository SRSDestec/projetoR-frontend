import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";

export type ExternalLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export default function({ href, ...rest }: ExternalLinkProps): React.ReactElement {
	return (
		<Link
			target="_blank"
			{...rest}
			href={href}
			onPress={async (event) => {
				// Prevent the default behavior of linking to the default browser on native.
				event.preventDefault();
				// Open the link in an in-app browser.
				await openBrowserAsync(href);
			}}
		/>
	);
}
