# Itemite Client

Itemite Client is the frontend part of an online classifieds platform built with Angular.
It provides a user interface where you can browse products, make offers,
complete transactions, and communicate with sellers. Designed to work with the Itemite API.

## Features

- Create and manage your own offers
- Browse personalized offers based on user behavior
- Filter and sort listings on dedicated pages
- Make transactions or negotiate prices with sellers
- Chat directly with sellers in real time
- Manage your user profile and account settings
- Save favourite offers to a personal list
- Sign in with a standard account or Google
- Report inappropriate content or behavior
- Admin panel for managing categories, reports, users, transactions and banners

## Tech stack

- **Angular 21** - main frontend framework with SSR (Server-Side Rendering) support
- **TypeScript** - statically typed superset of JavaScript
- **Tailwind CSS** - utility-first CSS framework for rapid UI styling
- **SignalR** - real-time communication library powering the live chat feature
- **ngx-translate** - internationalization (i18n) library for multi-language support
- **Leaflet** - interactive maps library that works together with Geoapify to display location-based offers on the map.
- **ESLint** - static code analysis tool to enforce code quality and consistency
- **Jasmine & Karma** - unit testing framework and test runner for Angular components
- **Stripe.js / ngx-stripe** - Stripe integration for handling secure online payments and transactions.

## Architecture

The project is built on a standard feature-based Angular architecture composed of reusable components, separating the UI layer from the business logic to ensure a clear and scalable project structure.

```mermaid
graph TD
  A["src - project files"]
  B["assets - static files"]
  C["environments - app configuration"]
  F["app - main module"]
  D["components - UI layer"]
  E["core - business logic"]
  
  A --> F
  A --> B["assets - static files"]
  A --> C["environments - app configuration"]

  F --> D["components - UI layer"]
  F --> E["core - business logic"]
```

## Preview

### Home page

![home_page.png](preview/home_page.png)

### Login page

![login_page.png](preview/login_page.png)

### Offer list page

![product_list_page.png](preview/product_list_page.png)

### Detailed offer page

![product_details_page.png](preview/product_details_page.png)

### Create and edit offer form

![edit_product_page.png](preview/edit_product_page.png)

### Payment page

![payment_page.png](preview/payment_page.png)

### Profile page

![profile_page.png](preview/profile_page.png)

### Chat page

![chat_buyer_page.JPG](preview/chat_buyer_page.JPG)

### Report form

![report_page.png](preview/report_page.png)

### Admin Panel

![admin_panel.png](preview/admin_panel.png)

![admin_transactions.png](preview/admin_transactions.png)

![admin_notifications.png](preview/admin_notifications.png)

![admin_categories.png](preview/admin_categories.png)

![admin_banners.png](preview/admin_banners.png)

## How to run

### 1. Clone the repository

```bash
git clone <repository-url>
cd ItemiteClient
```

### 2. Install required tools and dependencies

Make sure you have installed:
- **Node.js** - JavaScript runtime environment required to run the development server and build tools.
- **Npm** - package manager for JavaScript, used to install project dependencies.

Then install project dependencies:
```bash
npm install
```

### 3. Configure environment variables

Set up your environment variables in the `environments` folder:

```typescript
export const environment = {
  // Production mode
  production: true,
  // Itemite API base URL
  itemiteApiUrl: 'http://localhost:5066/api',
  // Geoapify geocoding API URL
  geoapifyUrl: 'https://api.geoapify.com/v1/geocode',
  // Geoapify API key
  geoapifyApiKey: '',
  // Itemite SignalR hubs URL
  itemiteHubs: 'http://localhost:5066/hubs',
  // Stripe public key
  stripePublicKey: ''
};
```

### 4. Run the application

Start the local development server:

```bash
ng serve
```

Open your browser and navigate to `http://localhost:4200/`.  
The application reloads automatically when you modify source files.

To build the project for production:
```bash
ng build
```
The compiled output will be stored in the `dist/` directory.

## License

This project is part of an academic project by filip_wojc, DarknesoPirate, RobertPintera, HAScrashed
