import Head from 'next/head';
import { useEffect, useState } from 'react';

import styles from './index.module.css';

export default function Home() {
  const NB_SYN_COLUMNS = 5;
  const [queryInput, setQueryInput] = useState('');
  const [queryString, setQueryString] = useState('');
  const [result, setResult] = useState();
  const [elements, setElements] = useState([]);
  const [synLines, setSynLines] = useState(0);
  const [fetchInProgress, setFetchInProgress] = useState(false);

  function updateQuery(el) {
    // setQueryString((queryString) => el);
    setQueryString(el);
  }

  useEffect(() => {
    /* it will be called when queues did update */
    if (queryString.trim().length != 0) {
      executeQuery();
    }
  }, [queryString]);#

  useEffect(() => {
    /* it will be called when queues did update */
    console.log('elements: ' + elements);
    elements.length > 0
      ? setSynLines(elements.length / NB_SYN_COLUMNS)
      : setSynLines(0);
    console.log('synLines: ' + synLines);
  }, [elements]);

  useEffect(() => {
    /* it will be called when queues did update */
    console.log('synLines: ' + synLines);
  }, [synLines]);

  useEffect(() => {
    /* it will be called when queues did update */
    if (fetchInProgress) {
      setElements([]);
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
        <img src="/dog.png" className={styles.icon} />
        <h3>Synonymes</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="query"
            placeholder="Entrer un mot ou une expression."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
          <input type="submit" value="Trouver des synonymes" />
        </form>
        <div className={styles.result}>
          <div className={styles.query}>Synonymes de: {queryString}</div>
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
      </main>
    </div>
  );
}
