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