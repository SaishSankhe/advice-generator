import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

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

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    setIsRefreshing(false);
  }, [advice]);

  return (
    <>
      <main>
        <div className="card">
          <h1>ADVICE #{advice.slip.id}</h1>
          {isRefreshing ? (
            <p className="loading">Loading...</p>
          ) : (
            <p className="advice"> “{advice.slip.advice} ”</p>
          )}
          <img
            className="divider"
            alt="divider"
            src="pattern-divider-desktop.svg"
          />
          <button className="dice-btn" onClick={() => refreshData()}>
            <img src="icon-dice.svg" alt="dice icon" />
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
