import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function wrap(
  path: ReactNode,
  { className, ...props }: IconProps,
) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {path}
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return wrap(
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>,
    props,
  );
}

export function IconMenu(props: IconProps) {
  return wrap(
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </>,
    props,
  );
}

export function IconClose(props: IconProps) {
  return wrap(
    <>
      <path d="M18 6 6 18M6 6l12 12" />
    </>,
    props,
  );
}

export function IconHome(props: IconProps) {
  return wrap(
    <>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>,
    props,
  );
}

export function IconForum(props: IconProps) {
  return wrap(
    <>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </>,
    props,
  );
}

export function IconBook(props: IconProps) {
  return wrap(
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>,
    props,
  );
}

export function IconGroups(props: IconProps) {
  return wrap(
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>,
    props,
  );
}

export function IconSettings(props: IconProps) {
  return wrap(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </>,
    props,
  );
}

export function IconChevronUp(props: IconProps) {
  return wrap(<path d="m18 15-6-6-6 6" />, props);
}

export function IconChevronDown(props: IconProps) {
  return wrap(<path d="m6 9 6 6 6-6" />, props);
}

export function IconChat(props: IconProps) {
  return wrap(
    <>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </>,
    props,
  );
}

export function IconBell(props: IconProps) {
  return wrap(
    <>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>,
    props,
  );
}

export function IconEdit(props: IconProps) {
  return wrap(
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>,
    props,
  );
}

export function IconMegaphone(props: IconProps) {
  return wrap(
    <>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </>,
    props,
  );
}

export function IconSparkles(props: IconProps) {
  return wrap(
    <>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
    </>,
    props,
  );
}

export function IconTrendingUp(props: IconProps) {
  return wrap(
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>,
    props,
  );
}

export function IconLibrary(props: IconProps) {
  return wrap(
    <>
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 6v14" />
      <path d="M4 6v14" />
    </>,
    props,
  );
}

export function IconHeartHandshake(props: IconProps) {
  return wrap(
    <>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </>,
    props,
  );
}
