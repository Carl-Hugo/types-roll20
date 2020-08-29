# types-roll20

Roll20 type definition

## NPM

I may publish the definition files on the public registry at some points, until then, I've created a roll20 feed on my MyGet account.
All my roll20 stuff are accessible there: [https://www.myget.org/F/roll20/npm/](https://www.myget.org/F/roll20/npm/).

> RSS Feed: [https://www.myget.org/RSS/roll20](https://www.myget.org/RSS/roll20)

## Install

You can create a `.npmrc` file at the root of your project to use MyGet feed. Set the content to:

```
registry="https://www.myget.org/F/roll20/npm/"
```

Then you can:

```bash
npm i @types/roll20 --save-dev
```
