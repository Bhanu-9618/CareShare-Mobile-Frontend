# CareShare - Frontend Architecture

CareShare is a full-stack, strictly typed mobile application designed to bridge the gap between food surplus and food scarcity. It operates as a real-time logistics and donation platform connecting Donors, Volunteers, and Receivers. The platform facilitates the seamless posting, tracking, and secure handover of food donations.

---

## 🛠 Tech Stack & Architecture

* **Framework:** React Native (Bare CLI)
* **Language:** TypeScript (100% Strict Mode, zero `: any` types)
* **Navigation:** React Navigation v6 with fully typed route parameters
* **State Management:** React Query for server state and Context API for global client state
* **Networking:** Axios with centralized interceptors and strict error typing
* **Styling & UI:** React Native StyleSheet with custom Native App Icons and vector icons

---

## 🚀 Engineering Highlights

* **Strict Type Safety:** The entire application enforces strict TypeScript rules, keeping UI components screen-specific to ensure pixel-perfect adjustments without breaking other screens.
* **Role-Based Access Control (RBAC):** The app decodes secure JWT tokens upon login to instantly determine the user's role and dynamically injects an entirely different navigation flow (Donor, Volunteer, or Receiver tabs).
* **Advanced Error Handling:** Implemented safe `try/catch` patterns utilizing `error: unknown` with proper type narrowing and casting for stable parsing of HTTP error responses.
* **Optimized Caching:** Leveraging React Query and `useFocusEffect`, the app minimizes redundant network requests and guarantees instant data freshness when navigating between dashboards.
* **Clean Code Architecture:** API calls are abstracted into dedicated service files, and complex utility logic is centralized, keeping React components focused purely on rendering UI.
* **Secure Handover Protocol:** The system utilizes a cryptographic OTP flow where the volunteer must physically input a secret code provided by the receiver to complete the transaction.

---

## 🔄 The Complete Project Flow

The application handles a real-time lifecycle for every donation:

### 1. The Donor Flow (Initiation)
Donors fill out a form detailing the food type, quantity, location, and expiry time. Once posted, the food status becomes `ACTIVE` and is instantly pushed to the Volunteer Feed.

### 2. The Volunteer Flow (Transit)
Volunteers view an actively updating feed and can accept `ACTIVE` donations, upgrading the status to `LIVE` (in transit). They manage their deliveries in an ongoing tasks screen and can safely unclaim items in emergencies.

### 3. The Receiver Flow (Fulfillment)
Receivers monitor `LIVE` items and request specific deliveries. They are issued a Secure Delivery OTP. The transaction is only marked as `COMPLETED` when the volunteer arrives and correctly enters the receiver's OTP into the verification screen.
