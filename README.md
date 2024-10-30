## Install TypeScript

```Bash
npm install -g typescript
```

Next, we need to instructor the Typescript compiler on how it should behave. We do so through a configuration file called `tsconfig.json` (in the root of our project). Simply run the following command to generate this file with default configurations:

```Bash
tsc --init
```

## Compiling TypeScript to JavaScript

Compile spedific file:

```Bash
tsc app.ts
```

Compile whole project:

```Bash
tsc app.ts
```

`tsconfig.json` file:

```Bash
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "outDir": "./dist"
    }
}
```

`outDir`: Specifies the output directory for the compiled JavaScript files

## Configure GitHub strategy

Create a GitHub Application:

1. Go to https://github.com/settings/applications/new
2. Fill in the application name, homepage URL (eg. http://127.0.0.1:8000), and authorization callback URL (eg. http://127.0.0.1:8000/auth/github/callback).
3. Click "Create application".
4. Note down the Client ID and Client Secret provided.

Update your `githubStrategy.ts` file with `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with the actual values from your GitHub application:

```TypeScript
// middleware\passportStrategies\githubStrategy.ts
...
const githubStrategy: GitHubStrategy = new GitHubStrategy(
  {
    clientID: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    callbackURL: "http://127.0.0.1:8000/auth/github/callback",
    passReqToCallback: true,
  },
);
...

```

