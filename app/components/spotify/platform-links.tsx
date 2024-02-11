import { ListenPlatformButton } from "./listen-platform-button";

export const ListenPlatformLinks = ({
  platforms,
}: {
  platforms: {
    name: string;
    url: string;
  }[];
}) => {
  return (
    <div className="flex gap-2 py-2">
      {platforms.map((props) => (
        <ListenPlatformButton key={props.url} {...props} />
      ))}
    </div>
  );
};
