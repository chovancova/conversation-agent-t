# Contributing

Thank you for your interest in contributing to Multi-Agent Tester! This guide will help you get started.

## ⚠️ Important: Proprietary License

**This repository is under a proprietary license.** The source code is publicly viewable for review purposes only.

### Contribution Agreement

By contributing to this project, you acknowledge and agree that:
- Your contributions become part of the proprietary codebase
- The copyright holder retains all rights to your contributions
- Your contributions do not grant you any usage rights to the software
- You assign all intellectual property rights of your contributions to the copyright holder

**If you do not agree with these terms, please do not contribute to this project.**

## Getting Started

### Prerequisites

**Required:**
- Node.js 18+ and npm 9+
- Git for version control
- Modern web browser
- Code editor (VS Code recommended)

**Recommended:**
- React DevTools browser extension
- Git GUI client (optional)
- Postman/Insomnia for API testing

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/conversation-agent-t.git
   cd conversation-agent-t
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:5173

4. **Verify Setup**
   - Application loads without errors
   - Console shows no errors
   - Hot reload works

See [[Installation|Installation]] for detailed setup instructions.

## How to Contribute

### Ways to Contribute

1. **Report Bugs** 🐛
   - Open issues with clear descriptions
   - Include reproduction steps
   - Provide environment details

2. **Suggest Features** 💡
   - Propose new features via issues
   - Explain use cases
   - Discuss implementation

3. **Improve Documentation** 📖
   - Fix typos and errors
   - Add examples
   - Clarify instructions

4. **Submit Code** 💻
   - Fix bugs
   - Implement features
   - Optimize performance

5. **Review Code** 👀
   - Review pull requests
   - Test changes
   - Provide feedback

### Finding Issues

Good first issues:
- Look for `good-first-issue` label
- Check `help-wanted` label
- Browse `documentation` issues

Priority areas:
- ESLint configuration
- Test coverage
- Mobile responsiveness
- Bundle size optimization

## Development Workflow

### 1. Create a Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch Naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test additions

### 2. Make Changes

**Code Guidelines:**
- Follow existing code style
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use TypeScript types

**Example:**
```typescript
// Good: Clear, typed, documented
interface TokenConfig {
  name: string;
  endpoint: string;
  clientId: string;
}

/**
 * Validates token configuration
 * @param config - Token configuration to validate
 * @returns True if valid, false otherwise
 */
function validateTokenConfig(config: TokenConfig): boolean {
  return !!(config.name && config.endpoint && config.clientId);
}

// Bad: Unclear, untyped, no docs
function validate(c) {
  return c.name && c.endpoint && c.clientId;
}
```

### 3. Test Changes

**Manual Testing:**
```bash
# Run development server
npm run dev

# Test in browser
# - Verify functionality
# - Check console for errors
# - Test edge cases
# - Try different browsers
```

**Build Testing:**
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Verify build works correctly
```

**Planned: Automated Tests**
```bash
# Run tests (when available)
npm run test

# Run with coverage
npm run test:coverage
```

### 4. Commit Changes

**Commit Messages:**

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```bash
# Good commit messages
git commit -m "feat(token): add auto-refresh configuration"
git commit -m "fix(chat): resolve message ordering issue"
git commit -m "docs(readme): update installation steps"

# Bad commit messages
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP"
```

### 5. Push Changes

```bash
# Push to your fork
git push origin feature/your-feature-name
```

### 6. Create Pull Request

**PR Title:**
Follow commit message format:
```
feat(component): add new feature
fix(bug): resolve issue with...
```

**PR Description Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested in production build
- [ ] Tested across browsers
- [ ] Added/updated tests (when available)

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings

## Screenshots (if applicable)
Add screenshots for UI changes
```

### 7. Code Review

**Respond to Feedback:**
- Address all comments
- Make requested changes
- Ask for clarification if needed
- Be respectful and professional

**Update PR:**
```bash
# Make changes based on feedback
git add .
git commit -m "refactor: address review comments"
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript

**Use Strict Types:**
```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User | null {
  // Implementation
}

// Avoid
function getUser(id: any): any {
  // Implementation
}
```

**Avoid `any`:**
```typescript
// Good
type ApiResponse = {
  data: unknown;
  status: number;
};

// Bad
type ApiResponse = {
  data: any;
  status: number;
};
```

### React

**Functional Components:**
```typescript
// Good: Functional component with proper typing
interface Props {
  message: string;
  onSend: (text: string) => void;
}

export function MessageInput({ message, onSend }: Props) {
  return (
    <input 
      value={message}
      onChange={(e) => onSend(e.target.value)}
    />
  );
}

// Avoid: Class components (unless necessary)
```

**Hooks Best Practices:**
```typescript
// Good: Memoized values and callbacks
const sortedMessages = useMemo(
  () => messages.sort((a, b) => a.timestamp - b.timestamp),
  [messages]
);

const handleSend = useCallback(
  (text: string) => {
    sendMessage(text);
  },
  [sendMessage]
);

// Avoid: Recreating on every render
const sortedMessages = messages.sort(...);
const handleSend = (text: string) => sendMessage(text);
```

### CSS/Tailwind

**Use Tailwind Utilities:**
```tsx
// Good: Tailwind utilities
<div className="flex items-center gap-4 p-4 bg-card rounded-lg">
  <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
    Click Me
  </button>
</div>

// Avoid: Inline styles (use sparingly)
<div style={{ display: 'flex', padding: '16px' }}>
  <button style={{ background: 'blue' }}>Click</button>
</div>
```

**Responsive Design:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

### File Organization

**Component Files:**
```
ComponentName/
├── ComponentName.tsx      # Component implementation
├── ComponentName.test.tsx # Tests (planned)
├── types.ts              # Component-specific types
└── utils.ts              # Component utilities
```

**Imports Order:**
```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// 2. Internal utilities and types
import { encrypt, decrypt } from '@/lib/encryption';
import type { TokenConfig } from '@/lib/types';

// 3. Styles (if any)
import './ComponentName.css';
```

## Testing Guidelines

### Manual Testing Checklist

**Feature Testing:**
- [ ] Feature works as intended
- [ ] Edge cases handled
- [ ] Error states tested
- [ ] Loading states work
- [ ] Success states display correctly

**Cross-Browser Testing:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

**Responsive Testing:**
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)

**Security Testing:**
- [ ] Encryption works
- [ ] Data persistence works
- [ ] No sensitive data in console
- [ ] Token handling secure

### Writing Tests (Planned)

**Unit Tests:**
```typescript
import { describe, it, expect } from 'vitest';
import { validateTokenConfig } from './utils';

describe('validateTokenConfig', () => {
  it('returns true for valid config', () => {
    const config = {
      name: 'Test',
      endpoint: 'https://api.test.com',
      clientId: 'client-123',
    };
    expect(validateTokenConfig(config)).toBe(true);
  });

  it('returns false for invalid config', () => {
    const config = {
      name: '',
      endpoint: 'https://api.test.com',
      clientId: 'client-123',
    };
    expect(validateTokenConfig(config)).toBe(false);
  });
});
```

## Documentation

### Code Documentation

**JSDoc Comments:**
```typescript
/**
 * Encrypts data using AES-256-GCM
 * 
 * @param data - Data to encrypt
 * @param password - Encryption password
 * @returns Encrypted data with salt and IV
 * @throws {Error} If encryption fails
 * 
 * @example
 * ```typescript
 * const encrypted = await encrypt({ secret: 'data' }, 'password');
 * ```
 */
export async function encrypt(
  data: unknown,
  password: string
): Promise<EncryptedData> {
  // Implementation
}
```

### Wiki Documentation

Update wiki when:
- Adding new features
- Changing existing behavior
- Updating configuration options
- Modifying APIs

See [[Home|Wiki Home]] for documentation structure.

## Pull Request Guidelines

### Before Submitting

**Checklist:**
- [ ] Code follows style guidelines
- [ ] Self-reviewed the code
- [ ] Tested thoroughly
- [ ] Documentation updated
- [ ] Commit messages clear
- [ ] No merge conflicts
- [ ] Branch up to date with main

### PR Size

**Keep PRs Small:**
- ✅ Single feature or fix
- ✅ Related changes only
- ✅ Easy to review
- ❌ Multiple unrelated changes
- ❌ Massive refactors

### PR Reviews

**As Reviewer:**
- Review promptly
- Be constructive
- Ask questions
- Suggest improvements
- Approve when ready

**As Author:**
- Respond to feedback
- Make requested changes
- Ask for clarification
- Thank reviewers

## Community Guidelines

### Code of Conduct

**Be Respectful:**
- Treat everyone with respect
- No harassment or discrimination
- Professional communication
- Constructive criticism only

**Be Collaborative:**
- Help other contributors
- Share knowledge
- Review others' code
- Participate in discussions

**Be Patient:**
- Maintainers are volunteers
- Reviews take time
- Questions may take time to answer
- Progress happens gradually

## Getting Help

### Where to Ask

**GitHub Issues:**
- Bug reports
- Feature requests
- Technical questions

**Discussions:**
- General questions
- Ideas and suggestions
- Show and tell

### Response Time

Please be patient:
- Issues reviewed within 1-3 days
- PRs reviewed within 3-7 days
- Complex changes take longer

## Priority Areas

### High Priority

1. **ESLint Configuration**
   - Migrate to v9 flat config
   - Add linting rules
   - Fix existing issues

2. **Test Coverage**
   - Set up Vitest
   - Write unit tests
   - Add integration tests

3. **Mobile Responsiveness**
   - Improve mobile UI
   - Touch gestures
   - Mobile-specific features

### Medium Priority

4. **Bundle Size Optimization**
   - Code splitting
   - Lazy loading
   - Tree shaking improvements

5. **Documentation**
   - More examples
   - Video tutorials
   - API documentation

6. **Accessibility**
   - WCAG AA compliance
   - Screen reader support
   - Keyboard navigation

See [TODO.md](https://github.com/chovancova/conversation-agent-t/blob/main/docs/TODO.md) for complete list.

## Recognition

### Contributors

All contributors are recognized:
- Listed in README
- Mentioned in release notes
- GitHub contributor graph

### Significant Contributions

Major contributions may result in:
- Special recognition
- Maintainer invitation
- Direct collaboration opportunities

## Questions?

Still have questions?
- 📖 Check existing documentation
- 🐛 Search existing issues
- 💬 Ask in discussions
- 📧 Contact maintainers

---

Thank you for contributing to Multi-Agent Tester! 🙏

**Previous**: [[Architecture]]  
**Next**: [[Troubleshooting]]
