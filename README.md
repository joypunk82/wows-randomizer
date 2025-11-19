# WoWS Randomizer# sv



A web application that helps World of Warships players choose which ship to play by randomly selecting from their port. Built with SvelteKit 5 and deployed on Vercel.Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).



## Features## Creating a project



- 🔐 **Wargaming.net OAuth** - Securely sign in with your Wargaming.net accountIf you're seeing this, you've probably already done this step. Congrats!

- 🚢 **Ship Port Display** - View all ships you own in your port

- 🎯 **Advanced Filtering** - Filter ships by nation, tier, and ship type```sh

- 🎲 **Random Selection** - Let fate decide which ship to play# create a new project in the current directory

- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSSnpx sv create

- 🔒 **Secure Sessions** - HTTP-only cookies for secure token storage

# create a new project in my-app

## Prerequisitesnpx sv create my-app

```

- Node.js 18+ installed

- A Wargaming.net Application ID ([Get one here](https://developers.wargaming.net/applications/))## Developing

- npm or pnpm package manager

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

## Local Development Setup

```sh

1. **Clone the repository**npm run dev

   ```bash

   git clone <your-repo-url># or start the server and open the app in a new browser tab

   cd wows-randomizernpm run dev -- --open

   ``````



2. **Install dependencies**## Building

   ```bash

   npm installTo create a production version of your app:

   ```

```sh

3. **Configure environment variables**npm run build

   ```

   Copy `.env.example` to `.env`:

   ```bashYou can preview the production build with `npm run preview`.

   cp .env.example .env

   ```> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

   
   Edit `.env` and add your credentials:
   ```env
   WARGAMING_APP_ID=your_application_id_here
   SESSION_SECRET=generate_a_random_secret_string_here
   ```
   
   **Important**: Generate a secure random string for `SESSION_SECRET` in production. You can use:
   ```bash
   openssl rand -base64 32
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment to Vercel

### First-time Setup

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Configure environment variables:
     - `WARGAMING_APP_ID` - Your Wargaming Application ID
     - `SESSION_SECRET` - A secure random string
   - Click "Deploy"

### Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `WARGAMING_APP_ID` | Your Wargaming.net Application ID | `your_app_id_here` |
| `SESSION_SECRET` | Random secret for session encryption | `<generate-random-string>` |

### Updating Your Deployment

Simply push changes to your GitHub repository:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically rebuild and redeploy your application.

## Wargaming.net Application Setup

1. Go to [Wargaming Developer Portal](https://developers.wargaming.net/)
2. Sign in with your Wargaming.net account
3. Create a new application
4. Add your callback URL:
   - Local: `http://localhost:5173/auth/callback`
   - Production: `https://your-domain.vercel.app/auth/callback`
5. Copy your Application ID

## Project Structure

```
wows-randomizer/
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable Svelte components
│   │   │   ├── ShipCard.svelte
│   │   │   ├── FilterSelect.svelte
│   │   │   └── DiceButton.svelte
│   │   └── server/              # Server-side utilities
│   │       ├── session.ts       # Session management
│   │       └── wargaming.ts     # Wargaming API client
│   └── routes/
│       ├── +layout.svelte       # Root layout
│       ├── +layout.server.ts    # Server-side layout data
│       ├── +page.svelte         # Home page
│       ├── auth/
│       │   ├── login/           # OAuth login redirect
│       │   ├── callback/        # OAuth callback handler
│       │   └── logout/          # Logout handler
│       └── ships/
│           ├── +page.server.ts  # Ships data loader
│           └── +page.svelte     # Ships display & filter page
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example environment variables
└── svelte.config.js             # SvelteKit configuration
```

## Technologies Used

- **[SvelteKit 5](https://svelte.dev/)** - Web framework with Svelte 5 runes
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Vercel](https://vercel.com/)** - Hosting and deployment
- **[Wargaming.net API](https://developers.wargaming.net/)** - Player data

## API Documentation

This application uses the following Wargaming.net API endpoints:

- **Authentication**: `/wows/auth/login/` - OAuth login
- **Account Info**: `/wows/account/info/` - Get player account details
- **Ship Stats**: `/wows/ships/stats/` - Get ships owned by player
- **Encyclopedia**: `/wows/encyclopedia/ships/` - Get ship details

[View full API documentation](https://developers.wargaming.net/reference/all/wows/)

## Security Notes

- The `.env` file is gitignored and never committed to the repository
- OAuth tokens are stored in HTTP-only cookies (not accessible via JavaScript)
- Session data is encrypted before being stored in cookies
- All API requests use the server-side only - tokens never exposed to the client

## Contributing

This is a personal project, but suggestions and bug reports are welcome! Feel free to open an issue.

## License

MIT License - feel free to use this project for your own purposes.

## Disclaimer

This is a fan-made tool and is not affiliated with or endorsed by Wargaming.net.
