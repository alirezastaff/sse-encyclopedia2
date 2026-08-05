"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const isFa = pathname.startsWith("/fa");
  const base = isFa ? "/fa" : "/en";
  const { data: session, status } = useSession();

  return (
    <header className="header">
      <div>
        {isFa ? "دانشنامه پژوهشی" : "Research Encyclopedia"}
      </div>

      <nav className="nav">
        <ul>
          <li>
            <Link href={base}>{isFa ? "خانه" : "Home"}</Link>
          </li>
          <li>
            <Link href="/profile">{isFa ? "حاشیه نگاری" : "Marginal Notes"}</Link>
          </li>
          {status === "authenticated" ? (
            <>
              <li>
                <Link href="/profile">{isFa ? "پروفایل" : "Profile"}</Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: base })}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    font: "inherit",
                    padding: 0,
                  }}
                >
                  {isFa ? "خروج" : "Sign out"}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">{isFa ? "ورود" : "Login"}</Link>
              </li>
              <li>
                <Link href="/register">{isFa ? "ثبت نام" : "Register"}</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div>
        {isFa ? (
          <Link href={pathname.replace("/fa", "/en")}>EN</Link>
        ) : (
          <Link href={pathname.replace("/en", "/fa")}>FA</Link>
        )}
      </div>
    </header>
  );
}