# TVET Johor Portal — Project Documentation

## Overview

**TVET Johor Portal** is a comprehensive web platform for the Johor State Department of Skills Development (JTM) and TVET institutions. It connects students, employers, training providers, and government officials through a unified digital ecosystem.

**Live URL (via Cloudflare Tunnel):** `https://conf-unix-commissioners-defence.trycloudflare.com`
**Local URL:** `http://localhost:3000`

---

## Architecture

### Tech Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router) + React 19 + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui components |
| **Backend** | Next.js Server Actions + API Routes |
| **Database** | PostgreSQL 16 (via Prisma ORM) |
| **Auth** | Auth.js (NextAuth) v5 |
| **File Storage** | Supabase Storage / AWS S3 |
| **Email** | Nodemailer (SMTP or console logging in dev) |
| **Deployment** | Docker + Cloudflare Tunnel (dev) |

### Project Structure
```
tvet-johor-portal-main/
├── prisma/
│   ├── schema.prisma          # Database schema (25+ models)
│   └── seed.ts                # Database seeding script
├── src/
│   ├── app/
│   │   ├── (public)/          # Public pages (news, directory, about)
│   │   ├── api/               # API routes (auth, verify, etc.)
│   │   ├── auth/              # Auth pages (login, register, verify)
│   │   ├── dashboard/         # Role-based dashboards
│   │   └── actions/           # Server actions (auth, etc.)
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utilities (prisma, auth, email, validations)
│   └── types/                 # TypeScript type definitions
├── .env                       # Environment variables
├── next.config.ts             # Next.js configuration
└── package.json               # Dependencies
```

---

## User Roles & Features

### 1. Student / Pelajar & Belia
**Registration:** Self-register with email verification
**Features:**
- Profile management (IC, education, skills, portfolio links)
- Browse and apply for job vacancies
- Browse and enroll in training programs
- Upload documents (resume, cover letter)
- Track application status
- View news and announcements

### 2. Employer / Majikan & Industri
**Registration:** Self-register with email verification + document verification (SSM, MOF, Bank Statement)
**Features:**
- Company profile management
- Post and manage job vacancies
- Review and manage job applications
- Upload company documents for verification
- View news and announcements

### 3. Training Provider / Pusat Latihan
**Registration:** Self-register with email verification
**Features:**
- Institution profile management
- Create and manage training programs
- Post job vacancies (internships, apprenticeships)
- Track student enrollments
- Upload professional certifications

### 4. Government Official / Pegawai Kerajaan
**Access:** Admin-created accounts (read-only dashboard)
**Features:**
- View analytics and reports
- Browse all vacancies, programs, and providers
- Read-only access to system data

### 5. Admin (ADTEC / JTDC / Superadmin)
**Access:** Admin-created accounts
**Features:**
- Full system administration
- Manage users, documents, vacancies, programs
- Review and approve/reject documents
- Audit log monitoring
- System settings management

---

## Authentication & Authorization

### Registration Flow
1. User selects role (Student, Employer, Provider)
2. Fills registration form with role-specific fields
3. System creates user with `PENDING_VERIFICATION` status
4. Verification email sent with secure token link
5. User clicks link → email verified → status changes to `ACTIVE`
6. User can now log in

### Login Flow
1. User enters email and password
2. System validates credentials
3. System checks user status (`ACTIVE` required)
4. User redirected to role-appropriate dashboard

### Email Verification
- **Token-based:** UUID v4 tokens stored in `verification_tokens` table
- **Expiry:** 24 hours
- **Resend:** Available from registration success page
- **Email service:** Nodemailer with SMTP (console logging in dev)

### Role-Based Access Control (RBAC)
- Middleware protects routes based on user role
- Each role has a dedicated dashboard
- Unauthorized access redirects to login

---

## Database Schema

### Core Models
| Model | Description |
|-------|-------------|
| **User** | Core auth account (email, password, role, status) |
| **Account** | OAuth provider accounts (Auth.js) |
| **Session** | Auth.js sessions |
| **VerificationToken** | Email verification tokens |

### Profile Models
| Model | Description |
|-------|-------------|
| **StudentProfile** | Student details (IC, education, skills, etc.) |
| **EmployerProfile** | Company details (SSM, sector, size, etc.) |
| **ProviderProfile** | Institution details (accreditation, contact, etc.) |
| **OfficialProfile** | Government official details |
| **AdminProfile** | Admin details (department, entity) |

### Content Models
| Model | Description |
|-------|-------------|
| **Document** | Uploaded files (resumes, certs, etc.) |
| **Vacancy** | Job listings with categories |
| **Application** | Student applications to vacancies |
| **TrainingProgram** | Training programs with enrollments |
| **News** | CMS news/articles |
| **Inquiry** | Public contact form submissions |
| **AuditLog** | System activity logging |
| **SystemSetting** | Key-value config store |

### Enums
- `UserRole`: SUPERADMIN, ADMIN_ADTEC, ADMIN_JTDC, STUDENT, EMPLOYER, PROVIDER, OFFICIAL
- `AccountStatus`: ACTIVE, SUSPENDED, PENDING_VERIFICATION
- `DocumentType`: RESUME, COVER_LETTER, SSM, MOF, BANK_STATEMENT, CERT_PROFESSIONAL, OTHER
- `DocumentStatus`: PENDING_REVIEW, REQUIRES_REVISION, APPROVED, REJECTED
- `VacancyStatus`: DRAFT, PUBLISHED, CLOSED, ARCHIVED
- `VacancyType`: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, APPRENTICESHIP, FREELANCE
- `ApplicationStatus`: SUBMITTED, IN_REVIEW, REQUIRES_REVISION, SHORTLISTED, APPROVED, REJECTED, WITHDRAWN
- `TrainingStatus`: UPCOMING, OPEN_FOR_REGISTRATION, ONGOING, COMPLETED, CANCELLED
- `NewsCategory`: ANNOUNCEMENT, EVENT, ACHIEVEMENT, CIRCULAR, INDUSTRY_NEWS, VACANCY_HIGHLIGHT
- `NewsStatus`: DRAFT, PUBLISHED, ARCHIVED
- `AuditAction`: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, UPLOAD, APPROVE, REJECT, REVISE, PUBLISH, UNPUBLISH

---

## Current Progress

### ✅ Completed
1. **Environment Setup**
   - `.env` configuration file created
   - npm dependencies installed
   - PostgreSQL database running via Docker
   - Prisma schema migrated and seeded

2. **Authentication System**
   - Registration pages for all 3 user types (Student, Employer, Provider)
   - Email verification flow (token-based, 24-hour expiry)
   - Login page with role-based redirect
   - Password hashing with bcryptjs
   - Auth.js session management

3. **Email Verification System**
   - `src/lib/email.ts` — Email utility with nodemailer
   - `src/app/api/auth/verify/route.ts` — Verification API endpoint
   - `src/app/auth/verify/page.tsx` — Verification page with loading state
   - `src/app/actions/auth.ts` — Registration sends verification emails
   - Resend verification action implemented
   - SMTP configuration in `.env` (optional — console logging fallback)

4. **Public Pages**
   - Homepage with news grid and featured content
   - News listing and detail pages
   - About page
   - Contact form
   - Job directory (kerja)
   - Training directory (latihan)
   - Training provider directory (pusat-latihan)

5. **Infrastructure**
   - Next.js dev server running on `localhost:3000`
   - Cloudflare Tunnel for secure remote access
   - Cross-origin configuration for tunnel domains

### 🚧 In Progress / Partially Complete
1. **Dashboard Pages** — Shell exists but features need implementation
2. **Document Upload** — Form components exist, integration pending
3. **Vacancy Management** — Listing works, CRUD operations pending
4. **Training Program Management** — Listing works, CRUD operations pending
5. **Admin Panel** — Structure exists, full features pending

### 📋 Not Yet Started
1. **Application Management** — Student application workflow
2. **Enrollment System** — Training program enrollment
3. **Audit Logging** — Full audit trail implementation
4. **System Settings** — Admin configuration panel
5. **Search & Filtering** — Advanced search across directories
6. **Notification System** — In-app notifications
7. **Production Deployment** — Docker Compose, CI/CD pipeline

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- Docker Desktop
- npm

### Steps
1. **Start PostgreSQL:**
   ```bash
   docker start tvet-postgres
   ```

2. **Start Next.js dev server:**
   ```bash
   cd tvet-johor-portal-main
   npx next dev --turbopack
   ```

3. **Access the app:**
   - Local: `http://localhost:3000`
   - Remote (via Cloudflare Tunnel): Run `cloudflared tunnel --url http://localhost:3000`

### Environment Variables
Key variables in `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tvet_johor?schema=public"
NEXTAUTH_SECRET="local-dev-secret-change-in-production-abc123xyz"
NEXTAUTH_URL="http://localhost:3000"
EMAIL_FROM="noreply@tvet-johor.gov.my"
SMTP_HOST=""          # Optional — leave empty for console logging
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
```

---

## Known Issues

1. **`experimental.serverComponentsExternalPackages` warning** — Next.js 15 moved this to `serverExternalPackages`. Not breaking, just a warning.
2. **TypeScript errors in `src/app/dashboard/student/page.tsx`** — Pre-existing, unrelated to verification flow.
3. **Cloudflare Tunnel connectivity** — Occasional network timeouts; tunnel auto-reconnects.
4. **Email delivery** — In dev mode, emails are logged to console. SMTP must be configured for real delivery.

---

## Security Considerations

1. **Passwords** — Hashed with bcryptjs (12 rounds)
2. **Sessions** — Auth.js with secure session management
3. **Email verification** — Required before account activation
4. **Role-based access** — Middleware enforces RBAC
5. **Cloudflare Tunnel** — HTTPS encryption, no open firewall ports
6. **Database** — PostgreSQL with password authentication
7. **File uploads** — Stored in Supabase Storage / S3 (not local filesystem)

---

## API Endpoints

### Auth
- `POST /api/auth/verify?token=...` — Verify email token
- `POST /api/auth/[...nextauth]` — Auth.js endpoints (login, logout, session)

### Public
- `GET /` — Homepage
- `GET /berita` — News listing
- `GET /berita/[slug]` — News detail
- `GET /direktori/kerja` — Job directory
- `GET /direktori/latihan` — Training directory
- `GET /direktori/pusat-latihan` — Provider directory
- `GET /tentang` — About page
- `GET /hubungi` — Contact page

### Auth Pages
- `GET /auth/login` — Login page
- `GET /auth/register/student` — Student registration
- `GET /auth/register/employer` — Employer registration
- `GET /auth/register/provider` — Provider registration
- `GET /auth/verify` — Email verification page
- `GET /auth/verify/resend` — Resend verification page

---

## Database Seeding

The seed script (`prisma/seed.ts`) creates:
- 1 Superadmin user
- 1 ADTEC admin user
- 1 JTDC admin user
- 1 Government official user
- 3 Training providers (ADTEC Johor, ILP Johor, Kolej Vokasional Pasir Gudang)
- 5 Employers (various sectors)
- 10 News articles (mix of categories)
- 8 Job vacancies
- 5 Training programs
- 3 Student profiles
- 10 Documents
- 5 Applications
- 3 Audit log entries

**To re-seed:**
```bash
npx prisma db push
npx tsx prisma/seed.ts
```
