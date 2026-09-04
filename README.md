# Special Needs 4 Special Needs — Production App

This is the mobile-first PWA for Special Needs 4 Special Needs, connected to the project's Supabase backend.

## Included
- Supabase email/password sign-up, sign-in, sign-out, and password reset
- Cloud-synced family profile, support note, emergency card, and reminders
- Secure support-request storage for signed-in users
- Public verified-resource table with local fallback resources
- Row Level Security enforced by the Supabase database
- PWA install/offline shell

## Supabase project
The browser uses the project's Supabase URL and **publishable** API key in `config.js`. Publishable/anon keys are designed to be exposed in browser applications; never put a Supabase service-role/secret key in this app.

## Before public launch
1. Host this folder over HTTPS.
2. Add the final production URL to Supabase Auth redirect/URL settings, including the password-reset redirect.
3. Test sign-up, email confirmation, sign-in, password reset, profile sync, reminders, support requests, and sign-out on Android and desktop.
4. Review Supabase security/performance advisors.
5. Add privacy policy, terms, consent, retention/deletion process, and contact/reporting information.
6. Have the security/privacy model reviewed before collecting sensitive health or disability information. This app is not represented as HIPAA compliant.
7. Replace/expand resource seed data with verified, dated, moderated local resources before launch.
