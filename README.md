# About this project

This app is a linguistic tool based on OpenAI API. It allows you to find synonyms in the French language for a given word or sentence. It is a work in progress, and it is not intended to be used in production.

## Demo

You can try the app [here](https://gravelfy.github.io/synonymes-ai/).

## How to use it

Just type some word and voilà! You will get a list of synonyms for the word you typed. You can also type a sentence, and the app will try to find French synonyms for each word in the sentence.

Every word is clickable, and you can click on it to get synonyms for this word.

## Tools used

The OpenAI model used is text-davinci-002.

This app is based on the OpenAI API [quickstart tutorial](https://beta.openai.com/docs/quickstart). It uses the [Next.js](https://nextjs.org/) framework with [React](https://reactjs.org/).

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd synonymes-ai
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems:

   ```bash
   $ cp .env.example .env
   ```

   On Windows:

   ```powershell
   $ copy .env.example .env
   ```

6. Add your [API key](https://beta.openai.com/account/api-keys) to the newly created `.env` file

7. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)! For the full context behind this app, check out the [tutorial](https://beta.openai.com/docs/quickstart).
