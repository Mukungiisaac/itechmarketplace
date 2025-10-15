# iTech Marketplace

A modern, full-featured marketplace platform for technology products, houses, and services. Built with cutting-edge web technologies and designed for optimal user experience.

![iTech Marketplace Banner](public/banner.png)

## 🌟 Features

### For Users
- Browse and search products, houses, and services
- Advanced filtering and sorting options
- Secure user authentication
- Detailed product/house/service pages with rich media support
- User reviews and ratings
- Responsive design for all devices

### For Sellers/Landlords/Service Providers
- Dedicated dashboards for different user types
- Easy product/house/service listing management
- Real-time analytics and insights
- Advertisement options
- Profile management

### For Administrators
- Comprehensive admin dashboard
- User management
- Content moderation
- Analytics and reporting
- System configuration

## 🛠️ Technology Stack

- **Frontend**:
  - React with TypeScript
  - Vite for blazing-fast development
  - TailwindCSS for styling
  - shadcn/ui for beautiful UI components
  - Responsive design principles

- **Backend**:
  - Supabase for:
    - User authentication
    - Database management
    - Real-time features
    - Edge Functions
    - File storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- Bun package manager
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mukungiisaac/itechmarketplace.git
cd itechmarketplace
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:5173`

## 📖 Project Structure

```
itechmarketplace/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page components and routes
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   └── integrations/ # Third-party integrations
├── public/           # Static assets
└── supabase/        # Supabase configurations and migrations
```

## 🔐 Security

- Implements secure authentication via Supabase
- Input validation and sanitization
- HTTPS encryption
- Regular security updates
- Protected API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Isaac Mukungi - Lead Developer & Project Owner
- [Add other team members here]

## 📞 Contact

- Project Link: [https://github.com/Mukungiisaac/itechmarketplace](https://github.com/Mukungiisaac/itechmarketplace)
- Website: [Add your website URL here]
- Email: [Add your contact email here]

## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Supabase team for the excellent backend platform
- All contributors and supporters of the project
## Project info

**URL**: https://lovable.dev/projects/de1bb153-3697-49fa-8fd4-035b93bf36bf

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/de1bb153-3697-49fa-8fd4-035b93bf36bf) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/de1bb153-3697-49fa-8fd4-035b93bf36bf) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
