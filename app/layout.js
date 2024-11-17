import localFont from "next/font/local";
import "./globals.css";
import Layout from "./components/Layout";
import { fetchBlogs } from "../services/firebaseService";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


async function getBlogs() {
  try {
    const blogs = await fetchBlogs();
    return blogs[0].items;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
}

export const metadata = {
  title: "Gözde Erdem",
  description: "Gözde Erdem'in kişisel blog sitesi.",
  keywords: ["Gözde Erdem", "Traveller", "Blog", "Blogger"],
  authors: [{ name: "Gözde Erdem" }],
  creator: "Gözde Erdem",
  publisher: "Gözde Erdem",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.gerdem.net"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.gerdem.net",
    title: "Gözde Erdem",
    description: "Gözde Erdem'in kişisel blog sitesi.",
    siteName: "Gözde Erdem",
    images: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/gerdem-cef21.firebasestorage.app/o/images%2F269683835_789918312407120_1333846745095901890_n.jpg?alt=media&token=809d2292-8315-4607-b1b5-bbe48ee814e2",
        width: 1200,
        height: 630,
        alt: "Gözde Erdem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gözde Erdem",
    description: "Gözde Erdem'in kişisel blog sitesi.",
    creator: "@gozdeerdem",
    images: ["https://firebasestorage.googleapis.com/v0/b/gerdem-cef21.firebasestorage.app/o/images%2F269683835_789918312407120_1333846745095901890_n.jpg?alt=media&token=809d2292-8315-4607-b1b5-bbe48ee814e2"],
  },
};


export default async function RootLayout({ children }) {
  const blogs = await getBlogs();

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="KAQsStAuRRQPS5KM45TzogX9JSv9REVYUQcOzcIdkOs" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <Layout blogs={blogs}>
          {children}
        </Layout>
      </body>
    </html>
  );
}
