import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Head from 'next/head';

export async function getServerSideProps(context) {
  const apiURL = 'https://api.adviceslip.com/advice';

  const generateAdvice = async (apiURL) => {
    const adviceRes = await fetch(apiURL);
    return await adviceRes.json();
  };

  const advice = await generateAdvice(apiURL);

  return {
    props: {
      advice,
    },
  };
}

export default function Home({ advice }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    setIsRefreshing(false);
  }, [advice]);

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(advice.slip.advice)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Head>
        <title>Advice Generator</title>
        <meta
          property="og:url"
          content="https://advice-generator-saish.vercel.app/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Advice Generator" />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content="Get life-changing advice on every click!"
        />
        <meta
          property="og:image:alt"
          content="Advice generator on each click!"
        />
        <meta property="og:image" content={'preview.png'} />
      </Head>
      <main>
        <div className="card">
          <h1>ADVICE #{advice.slip.id}</h1>
          {isRefreshing ? (
            <p className="loading">Loading...</p>
          ) : (
            <p className="advice"> “{advice.slip.advice}”</p>
          )}
          <picture>
            <source
              media="(max-width: 1200px)"
              srcSet="pattern-divider-mobile.svg"
            />
            <img
              className="divider"
              alt="divider image"
              src="pattern-divider-desktop.svg"
            />
          </picture>
          <button className="dice-btn" onClick={() => refreshData()}>
            <img src="icon-dice.svg" alt="dice icon" />
          </button>
        </div>
        <button className="copy-btn" onClick={handleCopyClick}>
          <img src="copy.png" alt="Copy icon" width={24} height={24} />
          {isCopied ? 'Copied!' : 'Copy advice'}
        </button>
      </main>

      <Footer />
    </>
  );
}
