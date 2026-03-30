# Instructions

## Setup Instructions

1. Open the project in your IDE (VSCode recommended)
2. Navigate to the project directory:
   ```bash
   cd email-searcher
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

### Application Settings

1. Open `email-searcher/src/settings/application/settings.development.js` for development settings
2. Configure the settings according to your needs:
   - `apiBaseURL`: Your Firebase/API server base URL
   - Other environment-specific configurations

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firebase Hosting
3. Configure Firebase:
   ```bash
   firebase login
   firebase init
   ```
4. Update `.firebaserc` with your project ID

## Running the Application

### Development Mode
Runs the app in development mode with hot reloading:
```bash
npm start
```

**What happens:**
- Opens [http://localhost:3000](http://localhost:3000) in your browser
- Page reloads automatically when you make changes
- Lint errors appear in the console

### Production Build
Creates an optimized production build:
```bash
npm run build
```

**Output:**
- Builds the app to the `build/` folder
- Minifies and optimizes for best performance
- Includes hashes in filenames for cache busting

### Running Tests
Launches the test runner in interactive watch mode:
```bash
npm test
```

## Project Structure

### Main Directories

```
email-searcher/
├── config/              # Webpack and build configurations
├── public/              # Static files (index.html, manifest, icons)
├── scripts/             # Build and start scripts
├── src/
│   ├── api/            # API integration and routes
│   ├── components/     # React components
│   │   ├── Email/      # Email display components
│   │   ├── Navigation/ # Header and footer
│   │   ├── Search/     # Search-related components
│   │   ├── UI/         # Reusable UI components
│   │   ├── UserAuthentication/ # Auth components
│   │   └── UserEmails/ # User email management
│   ├── containers/     # Container components
│   ├── enums/          # Enumerations and constants
│   ├── hoc/            # Higher-order components
│   ├── models/         # Data models and PropTypes
│   ├── routes/         # Application routing
│   ├── settings/       # Application settings
│   ├── store/          # Redux store configuration
│   │   ├── actions/    # Redux actions
│   │   ├── reducers/   # Redux reducers
│   │   └── sagas/      # Redux-Saga side effects
│   ├── translate/      # Internationalization
│   └── utils/          # Utility functions
└── package.json
```

### Key Files

- `src/index.js` - Application entry point
- `src/routes/routes.js` - Route definitions
- `src/store/` - Redux store, actions, reducers, and sagas
- `src/settings/application/settings.js` - Environment-based settings

## Features Overview

### Search Functionality

The application provides email search capabilities:
- Search by keywords
- Filter by domains
- Advanced search options (URLs, keys)
- Multiple search modes
- Results pagination
- Add emails to personal collection

### User Authentication

User authentication features:
- User registration
- User login
- Authentication state management
- Protected routes for authenticated users

### User Email Management

Manage saved emails:
- View saved emails
- Delete emails from collection
- Track email metadata
- Email count statistics

### State Management

The application uses Redux with Redux-Saga:
- **Actions**: Define action types and action creators
- **Reducers**: Handle state updates
- **Sagas**: Manage side effects (API calls, async operations)

## Development Workflow

### Making Changes

1. **Components**: Create new components in appropriate folders
2. **State**: Add actions, reducers, and sagas for state management
3. **Styling**: Use Less files co-located with components
4. **API**: Add new API routes in `src/api/routes/`

### Testing Changes

1. Start the development server: `npm start`
2. Make your changes
3. Verify in browser at [http://localhost:3000](http://localhost:3000)
4. Check console for errors
5. Test across different screen sizes

### Building for Production

1. Run the build command:
   ```bash
   npm run build
   ```
2. Test the production build locally:
   ```bash
   npx serve -s build
   ```
3. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Firebase Deployment

### Initial Setup

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (already configured):
   ```bash
   firebase init
   ```

### Deploying

```bash
# Build the application
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

## Environment Configuration

The application supports multiple environments:
- **Development**: `settings.development.js`
- **Production**: `settings.production.js`
- **Test**: `settings.test.js`

Environment is automatically detected based on `NODE_ENV`.

## Troubleshooting

### Common Issues

**Port already in use:**
- Change the port in `config/webpackDevServer.config.js` or kill the process using port 3000

**Build fails:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf build`

**Firebase deployment fails:**
- Verify you're logged in: `firebase login`
- Check Firebase project configuration: `.firebaserc`

## Notes

- The application requires an active Firebase project for hosting
- API endpoints need to be configured in settings files
- All browser console errors should be addressed
- Test in multiple browsers before deploying
- Keep dependencies updated for security patches

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag
