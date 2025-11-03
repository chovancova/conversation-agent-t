# Contributing to Multi-Agent Tester

Thank you for your interest in contributing to Multi-Agent Tester! This document provides guidelines and information for contributors.

## ⚠️ Important: Proprietary License Notice

**This repository is under a proprietary license.** The source code is publicly viewable for review purposes only.

By contributing to this project, you acknowledge and agree that:
- Your contributions become part of the proprietary codebase
- The copyright holder retains all rights to your contributions
- Your contributions do not grant you any usage rights to the software
- You assign all intellectual property rights of your contributions to the copyright holder

If you do not agree with these terms, please do not contribute to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow:

- **Be respectful** and considerate in your communication
- **Be collaborative** and helpful to other contributors
- **Be patient** with new contributors and maintainers
- **Focus on the project** and avoid personal attacks
- **Accept constructive criticism** gracefully

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git for version control
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Finding Issues to Work On

1. Check the [Issues](https://github.com/chovancova/conversation-agent-t/issues) page
2. Look for issues labeled:
   - `good first issue` - Great for newcomers
   - `help wanted` - Community contributions welcome
   - `bug` - Bug fixes needed
   - `enhancement` - New features or improvements

3. Comment on the issue to let maintainers know you're working on it

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/conversation-agent-t.git
cd conversation-agent-t

# Add upstream remote
git remote add upstream https://github.com/chovancova/conversation-agent-t.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## How to Contribute

### Types of Contributions

1. **Bug Fixes** - Fix issues and improve stability
2. **Features** - Add new functionality
3. **Documentation** - Improve README, guides, or code comments
4. **Testing** - Add tests for existing features
5. **Performance** - Optimize code and reduce bundle size
6. **Security** - Enhance security features

### Before You Start

1. **Check existing issues** to avoid duplicates
2. **Open an issue first** for major changes to discuss approach
3. **Keep changes focused** - one feature/fix per PR
4. **Follow coding standards** outlined below

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Properly type function parameters and return values
- Avoid `any` type - use `unknown` or proper types
- Use interfaces for object shapes

```typescript
// Good
interface TokenConfig {
  id: string
  name: string
  endpoint: string
}

function saveToken(config: TokenConfig): Promise<void> {
  // implementation
}

// Avoid
function saveToken(config: any) {
  // implementation
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused (< 200 lines)
- Extract reusable logic into custom hooks
- Use meaningful component and prop names

```tsx
// Good
interface MessageBubbleProps {
  content: string
  isUser: boolean
  timestamp: Date
}

export function MessageBubble({ content, isUser, timestamp }: MessageBubbleProps) {
  return (
    <div className={cn("rounded-lg p-4", isUser ? "bg-primary" : "bg-secondary")}>
      {content}
    </div>
  )
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow existing color scheme and spacing
- Ensure responsive design (mobile, tablet, desktop)
- Test in multiple browsers

### File Organization

```
src/
├── components/      # React components
│   ├── ui/         # Reusable UI components
│   └── ...         # Feature-specific components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and types
│   ├── types.ts    # TypeScript types
│   ├── utils.ts    # Helper functions
│   └── ...
└── styles/         # Global styles
```

### Naming Conventions

- **Components**: PascalCase (`MessageBubble.tsx`)
- **Hooks**: camelCase with "use" prefix (`useCountdown.ts`)
- **Utilities**: camelCase (`formatTime.ts`)
- **Types**: PascalCase (`TokenConfig`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_REFRESH_COUNT`)

## Pull Request Process

### 1. Prepare Your Changes

```bash
# Make sure you're on your feature branch
git checkout feature/your-feature-name

# Commit your changes
git add .
git commit -m "feat: add new feature description"

# Keep your fork updated
git fetch upstream
git rebase upstream/main
```

### 2. Commit Message Format

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(token): add automatic token refresh
fix(ui): correct message alignment in split view
docs(readme): update installation instructions
```

### 3. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:

- **Clear title** describing the change
- **Description** explaining what and why
- **Link to issue** if applicable
- **Screenshots** for UI changes
- **Testing notes** explaining how to test

### 4. PR Review Process

- Maintainers will review your PR
- Address any requested changes
- Keep PR updated with main branch
- Once approved, maintainer will merge

## Testing Guidelines

### Current State

The project currently has **no automated tests**. Adding tests is a high-priority contribution area!

### Desired Testing Approach

```typescript
// Example unit test (Vitest)
import { describe, it, expect } from 'vitest'
import { encrypt, decrypt } from './encryption'

describe('encryption', () => {
  it('should encrypt and decrypt data correctly', async () => {
    const data = { secret: 'test-data' }
    const password = 'test-password'
    
    const encrypted = await encrypt(data, password)
    expect(encrypted).not.toEqual(data)
    
    const decrypted = await decrypt(encrypted, password)
    expect(decrypted).toEqual(data)
  })
})
```

### Manual Testing

Before submitting PR, manually test:

1. **Basic functionality** works as expected
2. **Edge cases** are handled properly
3. **Error states** show appropriate messages
4. **UI is responsive** on different screen sizes
5. **No console errors** in browser DevTools

## Documentation

### Code Documentation

- Add JSDoc comments for public functions
- Explain complex logic with inline comments
- Update README.md if adding new features
- Add examples for new functionality

```typescript
/**
 * Encrypts data using AES-256-GCM algorithm
 * @param data - The data to encrypt
 * @param password - The encryption password
 * @returns Promise with encrypted data in base64 format
 * @throws Error if encryption fails
 */
export async function encrypt(data: any, password: string): Promise<string> {
  // implementation
}
```

### Documentation Files

Update relevant documentation:
- `README.md` - For user-facing changes
- `docs/TODO.md` - Remove completed items
- `docs/ARCHITECTURE.md` - For architectural changes
- Add new guides to `docs/` as needed

## Security Guidelines

### Security Best Practices

- **Never commit secrets** or credentials
- **Validate all user input** to prevent XSS
- **Use parameterized requests** to prevent injection
- **Test encryption features** thoroughly
- **Report security issues privately** to maintainers

### Reporting Security Issues

⚠️ **Do not open public issues for security vulnerabilities**

Instead, email maintainers directly with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Getting Help

### Resources

- **Issues**: Browse and search existing issues
- **Discussions**: Ask questions (when enabled)
- **Documentation**: Check `docs/` folder
- **Code**: Read existing code for patterns

### Communication

- Be clear and concise in issues and PRs
- Provide context and examples
- Be patient - maintainers are volunteers
- Follow up on your contributions

## Recognition

Contributors will be:
- Listed in project documentation
- Mentioned in release notes
- Appreciated in the community

## License & Intellectual Property

By contributing, you acknowledge and agree that:

1. Your contributions will be subject to the proprietary license of this project
2. You assign all intellectual property rights in your contributions to the copyright holder
3. The copyright holder retains exclusive rights to use, modify, distribute, or commercialize your contributions
4. You do not retain any rights to use the software or your contributions independently
5. Your contribution does not grant you any license or usage rights to the software

See the [LICENSE](LICENSE) file for the complete proprietary license terms.

If you have questions about the licensing terms, please contact the repository owner before contributing.

---

Thank you for contributing to Multi-Agent Tester! 🎉

Your contributions help make this tool better for everyone.
