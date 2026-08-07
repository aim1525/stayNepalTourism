# Data Flow Diagrams (DFD) — StayNepal Platform

## DFD Level 0 (Context Diagram)

```
                       +-------------------+
                       |      Tourist      |
                       +---------+---------+
                                 |
                                 | 1. Search & Filter Homestays
                                 | 2. Book & Pay (eSewa/Khalti)
                                 | 3. Submit Post-Stay Review
                                 v
+------------------+   +------------------------------------+   +-------------------+
|  Homestay Host   |-->| 1. Voice-Assisted Listing (FR-10)  |-->|   Administrator   |
|                  |<--| 2. Booking Approvals               |<--|                   |
+------------------+   |                                    |   +-------------------+
                       |         StayNepal Platform         |     1. Verify Listing
                       |                                    |     2. Monitor System
                       +-----------------+------------------+
                                         |
                                         v
                       +-------------------+----------------+
                       | Python FastAPI AI Recommendation   |
                       | Microservice (CBF / UBCF / NCF)    |
                       +------------------------------------+
```

## DFD Level 1 (System Process Breakdown)

- **Process 1.0 — Authentication & User Management**: Validates JWT token, enforces RBAC (`tourist`, `host`, `admin`), hashes passwords with bcrypt.
- **Process 2.0 — Homestay Spatial Directory**: Queries PostgreSQL/PostGIS spatial coordinates for 77 districts with Haversine distance sorting.
- **Process 3.0 — AI Recommendation Engine**: Sends user profile & interactions to Python FastAPI microservice; compares CBF (TF-IDF), UBCF (Jeffries-Matusita distance), and NCF (PyTorch deep neural net).
- **Process 4.0 — Booking & Availability Engine**: Evaluates date overlaps to prevent double-booking (FR-05).
- **Process 5.0 — Unified Payment Service Adapter**: Routes transaction requests to eSewa, Khalti, or FonePay sandbox APIs via `PaymentAdapter` interface.
