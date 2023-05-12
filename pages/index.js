import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

import styles from './index.module.css';

export default function Home() {
  const NB_SYN_COLUMNS = 5;
  const [queryInput, setQueryInput] = useState('');
  const [queryString, setQueryString] = useState('');

  const [emptyInputError, setEmptyInputError] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [elements, setElements] = useState([]);
  const [animIndex, setAnimIndex] = useState(-1);
  const [fetchInProgress, setFetchInProgress] = useState(false);

  const timeoutRef = useRef(setTimeout);

  const queryInputRef = useRef(null);

  function updateQuery(el) {
    setQueryString(el);
  }

  useEffect(() => {
    queryInputRef.current.focus();
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    if (emptyInputError) {
      document.getElementById('error').style.visibility = 'visible';
      document.getElementById('queryInput').style.border = '3px solid red';
    } else {
      document.getElementById('error').style.visibility = 'hidden';
      document.getElementById('queryInput').style.border = '1px solid #ccc';
    }
  }, [emptyInputError]);

  useEffect(() => {
    if (pageLoaded) executeQuery();

    if (queryString.trim().length != 0) {
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

      setElements(data.elements);
      setQueryInput('');
      setFetchInProgress(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function animateDots() {
    let dots = document.getElementById('dots');
    let dotsText = dots.innerHTML;
    if (dotsText.length === 3) {
      dots.innerHTML = '';
    } else {
      dots.innerHTML += '.';
    }
  }

  function onChange(event) {
    setQueryInput(event.target.value);
    if (event.target.value.length > 0) {
      setEmptyInputError(false);
    }
  }
  function onSubmit(event) {
    event.preventDefault();
    if (queryInput.trim().length == 0) {
      setEmptyInputError(true);
      return;
    } else {
      setEmptyInputError(false);
      updateQuery(queryInput);
    }
  }

  return (
    <div>
      <Head>
        <title>Synonymes</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <main className={styles.main}>
        <h1>Synonymes</h1>
        <div className={styles.error} id="error">
          Entrer un mot ou un expression
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="query"
            ref={queryInputRef}
            value={queryInput}
            id="queryInput"
            onChange={(e) => {
              onChange(e);
            }}
          />
          <input type="submit" value="" />
        </form>
        <div className={styles.result} id="result">
          <div className={styles.query}>
            Synonymes de: {queryString}
            <div className={styles.dots} id="dots"></div>
          </div>
          <div className={styles.synonymes}>
            {elements.map((item, index) => (
              <div className={styles.column}>
                <div className={styles.itemcontainer} key={index.toString()}>
                  <a
                    key={index.toString()}
                    onClick={() => {
                      updateQuery(item);
                    }}
                  >
                    {item}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.credit}>
          2023 François Y. Gravel - Fabriqué avec: OpenAI API, React & Next.js -
          Repo:{' '}
          <a href="https://github.com/gravelfy/synonymes-ai">
            https://github.com/gravelfy/synonymes-ai
          </a>
        </div>
      </main>
    </div>
  );
}
