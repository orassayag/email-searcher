# Contributing

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Everyone is welcome to contribute to this project. Contributing doesn't just mean submitting pull requests—there are many different ways for you to get involved, including answering questions, reporting issues, improving documentation, or suggesting new features.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:
1. Check if the issue already exists in the [GitHub Issues](https://github.com/orassayag/email-searcher/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Your environment details (OS, Node version, browser)

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the code style guidelines below
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

### Code Style Guidelines

This project uses:
- **JavaScript (ES6+)** with React
- **ESLint** for code quality
- **Less** for styling

Before submitting:
```bash
# Install dependencies
npm install

# Check for linting errors
npm run lint

# Build to ensure no errors
npm run build

# Test the application
npm start
```

### Coding Standards

1. **Component structure**: Follow existing patterns for React components
2. **State management**: Use Redux with Redux-Saga for side effects
3. **Error handling**: All errors should be handled gracefully with user-friendly messages
4. **Naming conventions**: Use clear, descriptive names for variables, functions, and components
5. **File organization**: Keep files organized by feature/domain
6. **Comments**: Add comments for complex logic and business rules

### Project Structure

When adding new features:
1. Create components in `src/components/` organized by feature
2. Add Redux actions in `src/store/actions/`
3. Add Redux reducers in `src/store/reducers/`
4. Add Redux-Saga logic in `src/store/sagas/`
5. Update API routes in `src/api/routes/` if needed
6. Add utility functions in `src/utils/`
7. Define types and enums in `src/enums/` and `src/models/`

### Adding New Features

When adding new features:
1. Ensure the feature aligns with the project's goals
2. Create appropriate models in `src/models/`
3. Add business logic in sagas or utilities
4. Update translations in `src/translate/`
5. Add proper error handling
6. Test thoroughly across different browsers
7. Update documentation if needed

### Working with Firebase

This project uses Firebase for hosting:
1. Ensure you have Firebase CLI installed
2. Test deployments locally before pushing
3. Follow Firebase best practices

### Browser Compatibility

Test your changes across:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Questions or Need Help?

Please feel free to contact me with any question, comment, pull-request, issue, or any other thing you have in mind.

* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag

Thank you for contributing! 🙏
