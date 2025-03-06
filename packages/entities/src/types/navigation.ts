interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}

type IconType = (props: IconBaseProps) => React.ReactNode;

export type SidebarItem = {
  label: string;
  Icon: IconType;
  path: string;
};
