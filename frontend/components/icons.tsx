import type { ReactNode } from "react";

/**
 * ไอคอนทั้งหมดของโปรเจกต์
 * ทุกตัวใช้ currentColor → สีตามข้อความของปุ่มที่ครอบอยู่ ไม่ต้องส่ง prop สี
 */

type IconProps = {
  size?: number;
  className?: string;
};

function Icon({ size = 20, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M10 4.5h4a1 1 0 0 1 1 1V7H9V5.5a1 1 0 0 1 1-1z" />
      <path d="M6.5 7l.8 12a1.8 1.8 0 0 0 1.8 1.7h5.8a1.8 1.8 0 0 0 1.8-1.7l.8-12" />
      <path d="M10.2 11v6" />
      <path d="M13.8 11v6" />
    </Icon>
  );
}
