# TODO: Fix Orders Not Showing and Logout on Refresh

## Steps to Complete
- [x] Add `loadUserFromStorage` action in `src/redux/actions/loginActions.ts` to rehydrate auth state from localStorage.
- [x] Dispatch `loadUserFromStorage` in `src/main.tsx` after store creation to restore user on app init.
- [x] Add error logging in `src/redux/actions/orderActions.ts` for fetchAllOrders failures.
- [x] Update `src/pages/Orders.tsx` to display loading and error states from Redux.
- [x] Test: Run dev server, refresh Orders page, verify auth persists and orders load (check console for errors).
- [x] If issues persist, debug API/DB (e.g., check Supabase for orders data or token validity).
- [x] Remove sign up from Auth page, keep only login.
- [x] Fix OrderDetails runtime error (order.total.toFixed).
- [x] Configure Vite for production hosting at https://800pharmacy.ae/panel_v2 with base '/panel_v2/'.
- [x] Fix CORS error in production login by updating API base URL to https://dashboard.800pharmacy.ae/api/api_panel/1.0.
- [x] Implement CreateOrder page with product fetching, cart functionality, customer details collection, order submission via API, and search in product dialog.
