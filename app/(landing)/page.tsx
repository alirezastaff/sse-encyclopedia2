"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Tanha:wght@700;800;900&display=swap');

        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          min-height: 100%;
          background: #061a24;
          font-family: "Vazirmatn", Tahoma, Arial, sans-serif;
        }

        body {
          min-height: 100vh;
        }

        a {
          text-decoration: none;
        }
      `}</style>

      <main className="landing-page">
        <div className="top-right-tag">IDEAS / PEOPLE / SUSTAINABLE FUTURES</div>
        <div className="vertical-tag">SOCIAL AND SOLIDARITY ECONOMY</div>

        <section className="glass-panel" aria-label="Landing page">
          <div className="left-group">
            <div className="logo-wrap" aria-label="Brand logo">
              <img src="/logow.png" alt="Social and Solidarity Economy logo" />
            </div>

            <div className="title-block">
              <h1>
                Social and Solidarity
                <span>Economy</span>
              </h1>
              <div className="subtitle">Knowledge platform</div>
            </div>
          </div>

          <div className="divider" aria-hidden="true" />

          <div className="actions" aria-label="Language selection">
            <Link href="/fa" className="lang-btn lang-btn-fa" dir="rtl">
              <span className="lang-text">فارسی</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/en" className="lang-btn lang-btn-en" dir="ltr">
              <span className="lang-text">English</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <div className="bottom-tag">KNOWLEDGE BUILDS<br />A MORE JUST ECONOMY</div>
        <div className="bottom-right" aria-hidden="true">
          <div className="ring ring-outer" />
          <div className="ring ring-inner" />
        </div>
      </main>

      <style jsx>{`
        .landing-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 64px 48px 52px;
          background:
            linear-gradient(180deg, rgba(4, 17, 25, 0.1), rgba(4, 17, 25, 0.28)),
            url('/bg.png') center center / cover no-repeat;
          overflow: hidden;
        }

        .landing-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 18%, rgba(255, 242, 170, 0.85), rgba(255, 242, 170, 0.18) 16%, rgba(255, 242, 170, 0) 30%),
            linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.16));
          pointer-events: none;
        }

        .landing-page::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.12) 100%);
          pointer-events: none;
        }

        .top-right-tag,
        .vertical-tag,
        .bottom-tag {
          position: absolute;
          z-index: 2;
          color: rgba(255,255,255,0.82);
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .top-right-tag {
          top: 28px;
          right: 52px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .vertical-tag {
          left: 18px;
          top: 50%;
          transform: translateY(-50%) rotate(-90deg);
          transform-origin: center;
          font-size: 10px;
          letter-spacing: 0.38em;
          white-space: nowrap;
          opacity: 0.9;
        }

        .glass-panel {
          position: relative;
          z-index: 3;
          width: min(1040px, 58vw);
          min-height: 285px;
          display: grid;
          grid-template-columns: 2.1fr 0.12fr 0.7fr;
          align-items: center;
          gap: 18px;
          padding: 24px 34px 22px 28px;
          border-radius: 34px;
          border: 1.3px solid rgba(255,255,255,0.78);
          background: rgba(128, 145, 156, 0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
        }

        .left-group {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 18px;
          min-height: 210px;
          padding: 6px 0 4px;
        }

        .logo-wrap {
          width: 102px;
          height: 102px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 12px;
        }

        .logo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 0 12px rgba(255,255,255,0.15));
        }

        .title-block {
          color: rgba(255,255,255,0.96);
          text-align: left;
          min-width: 0;
        }

        .title-block h1 {
          margin: 0;
          font-size: clamp(2.9rem, 2.8vw, 4.2rem);
          line-height: 0.9;
          letter-spacing: -0.08em;
          font-weight: 700;
          color: rgba(255,255,255,0.96);
        }

        .title-block h1 span {
          display: block;
        }

        .subtitle {
          margin-top: 18px;
          font-size: clamp(1.7rem, 1.5vw, 2.4rem);
          line-height: 1.2;
          letter-spacing: -0.05em;
          color: rgba(255,255,255,0.78);
          font-weight: 400;
        }

        .divider {
          width: 1px;
          height: 76%;
          background: rgba(255,255,255,0.54);
          margin: 0 auto;
        }

        .actions {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          min-height: 180px;
          padding-left: 8px;
        }

        .lang-btn {
          width: min(214px, 100%);
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 18px 0 22px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.72);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.96);
          text-decoration: none;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
        }

        .lang-btn:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.9);
        }

        .lang-btn-fa {
          direction: rtl;
          font-family: "Vazirmatn", Tahoma, sans-serif;
        }

        .lang-btn-en {
          direction: ltr;
          font-family: "Vazirmatn", Tahoma, sans-serif;
        }

        .lang-text {
          font-size: 17px;
          font-weight: 500;
          line-height: 1;
          letter-spacing: 0.01em;
        }

        .arrow {
          font-size: 30px;
          line-height: 1;
          opacity: 0.92;
          font-weight: 300;
        }

        .bottom-tag {
          left: 42px;
          bottom: 28px;
          font-size: 10px;
          line-height: 1.7;
          letter-spacing: 0.3em;
          font-weight: 500;
          color: rgba(255,255,255,0.78);
        }

        .bottom-right {
          position: absolute;
          right: 40px;
          bottom: 22px;
          z-index: 2;
          width: 90px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .ring {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          border: 1.5px solid rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.02);
        }

        .ring-inner {
          width: 18px;
          height: 18px;
          border-width: 1.2px;
        }

        @media (max-width: 1280px) {
          .glass-panel {
            width: min(980px, 62vw);
          }
        }

        @media (max-width: 980px) {
          .landing-page {
            padding: 120px 18px 52px;
          }

          .top-right-tag {
            top: 18px;
            right: 18px;
            font-size: 9px;
            letter-spacing: 0.12em;
          }

          .vertical-tag {
            display: none;
          }

          .glass-panel {
            width: min(760px, 92vw);
            display: flex;
            flex-direction: column;
            gap: 18px;
            padding: 28px 18px 20px;
            border-radius: 26px;
          }

          .left-group {
            flex-direction: column;
            text-align: center;
            width: 100%;
            min-height: unset;
            gap: 10px;
          }

          .logo-wrap {
            margin-left: 0;
            width: 94px;
            height: 94px;
          }

          .title-block {
            text-align: center;
          }

          .title-block h1 {
            font-size: clamp(2.4rem, 8vw, 3.2rem);
          }

          .subtitle {
            font-size: clamp(1.4rem, 5vw, 1.9rem);
          }

          .divider {
            width: 100%;
            height: 1px;
            margin: 0;
          }

          .actions {
            width: 100%;
            padding-left: 0;
            min-height: unset;
          }

          .lang-btn {
            width: min(260px, 86%);
          }

          .bottom-tag {
            left: 18px;
            bottom: 18px;
            font-size: 8px;
            letter-spacing: 0.2em;
          }

          .bottom-right {
            right: 18px;
            bottom: 12px;
            transform: scale(0.84);
          }
        }
      `}</style>
    </>
  );
}


