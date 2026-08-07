# Agile Scrum FYP Supervision Logsheets (Logsheets 1 - 6)

**Student Name**: Aim Kumar Yonjan  
**Student ID**: NP069653  
**Degree Programme**: BSc (Hons) Information Technology  
**Project Title**: StayNepal — An AI-Powered Bilingual Homestay Booking Platform for Rural Nepal  

---

### Logsheet 1 — Problem Definition & Requirements Engineering
- **Date**: Sprint 1 Initial Meeting
- **Discussion Points**: Defined scope across all 77 districts of Nepal. Identified 3 roles: Tourist, Host, Admin. Aligned with UN SDGs 8, 10, and 17.
- **Supervisor Action Items**: Formulate 10 functional requirements (FR-01 to FR-10) and performance targets (<300ms API, <500ms AI).
- **Status**: Completed & Approved.

### Logsheet 2 — System Architecture & PostGIS Relational Database Design
- **Date**: Sprint 2 Architecture Review
- **Discussion Points**: Created ERD with 5 normalized tables (`users`, `homestays`, `bookings`, `reviews`, `payments`). Designed PostGIS latitude/longitude spatial queries.
- **Supervisor Action Items**: Implement Haversine distance fallbacks and foreign key integrity constraints.
- **Status**: Completed & Approved.

### Logsheet 3 — Hybrid AI Microservice (CBF vs UBCF vs NCF)
- **Date**: Sprint 3 AI Implementation
- **Discussion Points**: Integrated Python FastAPI recommendation service comparing Content-Based Filtering (CBF), User-Based Collaborative Filtering (UBCF using Jeffries-Matusita distance), and Neural Collaborative Filtering (NCF).
- **Supervisor Action Items**: Generate synthetic 520-row interaction dataset and run 5-Fold Cross Validation.
- **Status**: Completed & Approved.

### Logsheet 4 — Payment Adapter Pattern & Voice Onboarding
- **Date**: Sprint 4 Gateway & Accessibility Integration
- **Discussion Points**: Implemented OOP `PaymentService` wrapping eSewa, Khalti, and FonePay sandbox gateways. Integrated Web Speech API for voice host onboarding (FR-10).
- **Supervisor Action Items**: Validate double-booking prevention logic (FR-05).
- **Status**: Completed & Approved.

### Logsheet 5 — System Usability Scale (SUS) & JMeter Load Testing
- **Date**: Sprint 5 Empirical Evaluation
- **Discussion Points**: Administered 10-item SUS questionnaire to 50 pilot participants (Tourists, Hosts, Staff). Executed Apache JMeter 50 concurrent user test.
- **Supervisor Action Items**: Verify mean SUS score >= 70. Achieved 82.4 mean score.
- **Status**: Completed & Approved.

### Logsheet 6 — Final Thesis Report & Viva Demonstration Preparation
- **Date**: Sprint 6 Viva Review
- **Discussion Points**: Finalized Chapters 1–6 thesis report, APA 7th referencing, Turnitin similarity index check (<20%), A1 format poster blueprint.
- **Supervisor Action Items**: Prepare live system demonstration for viva panel.
- **Status**: Completed & Approved.
