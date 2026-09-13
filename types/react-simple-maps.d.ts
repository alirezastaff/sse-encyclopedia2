declare module "react-simple-maps" {
  import type { ComponentType, ReactNode } from "react";

  type MapComponentProps = Record<string, unknown> & {
    children?: ReactNode | ((props: { geographies: never[] }) => ReactNode);
  };

  export const ComposableMap: ComponentType<MapComponentProps>;
  export const Geographies: ComponentType<MapComponentProps>;
  export const Geography: ComponentType<MapComponentProps>;
  export const Marker: ComponentType<MapComponentProps>;
  export const ZoomableGroup: ComponentType<MapComponentProps>;
}