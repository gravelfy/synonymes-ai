import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

import styles from './index.module.css';

export default function Home() {
  const NB_SYN_COLUMNS = 5;
  const [queryInput, setQueryInput] = useState('');
  const [queryString, setQueryString] = useState('');
  const [result, setResult] = useState('');
  const [elements, setElements] = useState([]);
  const [animIndex, setAnimIndex] = useState(-1);
  const [fetchInProgress, setFetchInProgress] = useState(false);

  const timeoutRef = useRef(setTimeout);

  const queryInputRef = useRef(null);

  function updateQuery(el) {
    // setQueryString((queryString) => el);
    setQueryString(el);
  }

  useEffect(() => {
    queryInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (queryString.trim().length != 0) {
      executeQuery();
      document.getElementById('result').style.visibility = 'visible';
    } else {
      document.getElementById('result').style.visibility = 'hidden';
    }
  }, [queryString]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      animateDots(animIndex);
      setAnimIndex(animIndex + 1);
    }, 500);
  }, [animIndex]);

  useEffect(() => {
    if (fetchInProgress) {
      setAnimIndex(0);
      setElements([]);
    } else {
      clearTimeout(timeoutRef.current);
      document.getElementById('dots').innerHTML = '';
      queryInputRef.current.focus();
    }
  }, [fetchInProgress]);

  async function executeQuery() {
    try {
      setFetchInProgress(true);
      console.log('query: ' + queryString);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: queryString }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        setFetchInProgress(false);
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result);
      setElements(data.elements);
      setQueryInput('');
      setFetchInProgress(false);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  // write a function that creates an animation of 3 dots characters flashing at 500 ms intervals
  function animateDots() {
    let dots = document.getElementById('dots');
    let dotsText = dots.innerHTML;
    if (dotsText.length === 3) {
      dots.innerHTML = '';
    } else {
      dots.innerHTML += '.';
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    updateQuery(queryInput);
  }

  return (
    <div>
      <Head>
        <title>Synonymes</title>
        <link rel="icon" href="/dog.png" />
      </Head>
      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon} /> */}
        <h3>Synonymes</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="query"
            ref={queryInputRef}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
          <input type="submit" value="Trouver" />
        </form>
        <div className={styles.result} id="result">
          <div className={styles.query}>
            Synonymes de: {queryString}
            <div className={styles.dots} id="dots"></div>
          </div>
          <div className={styles.synonymes}>
            {elements.map((item, index) => (
              <div key={index.toString()}>
                <a
                  key={index.toString()}
                  onClick={() => {
                    updateQuery(item);
                  }}
                >
                  {item}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.credit}>2023 François Y. Gravel</div>
      </main>
    </div>
  );
}
