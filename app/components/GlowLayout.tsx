"use client";

import React from "react";

export default function GlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .glass-card-fixed {
          background: rgba(255, 255, 255, 0.03) !important;
          backdrop-filter: blur(25px) !important;
          -webkit-backdrop-filter: blur(25px) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .gym-dark-glow-intense {
          background-color: #000000 !important;
          background-image: 
            radial-gradient(circle at 15% 20%, rgba(0, 102, 255, 0.35) 0%, transparent 55%),
            radial-gradient(circle at 85% 70%, rgba(0, 180, 216, 0.25) 0%, transparent 60%) !important;
          background-attachment: fixed;
        }
      `,
        }}
      />
      <main className="gym-dark-glow-intense relative flex min-h-screen text-white overflow-hidden">
        {children}
      </main>
    </>
  );
}
