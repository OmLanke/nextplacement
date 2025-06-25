import localFont from "next/font/local"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"

const firaSans = localFont({
  src: [
    {
      path: "../fonts/Fira-sans/FiraSans-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/Fira-sans/FiraSans-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
})

const marcellus = localFont({
  src: "../fonts/Marcellus/Marcellus-Regular.ttf",
  variable: "--font-marcellus",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${firaSans.variable} ${marcellus.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
