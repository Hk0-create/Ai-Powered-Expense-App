# Expense App Flow Document

Ye document `Expense App` ki frontend aur backend flow ko roman Urdu mein detail se samjhata hai. Har file ko uske istimaal aur kaam ke hisaab se sequential tareeqay se cover kiya gaya hai.

---

## 1. Frontend Flow (Client Side)

### 1.1 `client/src/main.jsx`

- Ye React app ka entry point hai.
- `StrictMode` React ke development warnings dikhata hai.
- `createRoot(document.getElementById('root')).render(...)` se app browser ke `root` element mein render hota hai.
- `./index.css` import kar ke global styling laayi gayi hai.
- `App` component import karke render kiya gaya hai.

### 1.2 `client/src/App.jsx`

- `BrowserRouter` React Router ke liye wrapper provide karta hai, jo URL history manage karta hai.
- `AuthProvider` app ke auth state ko wrap karta hai, jisse saare components `useAuth` hook se user state access kar saken.
- `AppRouter` routes define karta hai, yaani kaun sa page kaunsa URL pe dikhega.
- `Toaster` notification toast system provide karta hai jisse success/error messages frontend pe dikhayi dete hain.
- `toastOptions` se toast ka style aur success duration customize hota hai.

### 1.3 `client/src/router/AppRouter.jsx`

- `lazy` loading se pages async load hote hain, takay initial bundle chhota rahe.
- `Suspense` fallback ke sath `PageLoader` show karta hai jab page load ho raha ho.
- `Routes` aur `Route` use kar ke URL path map kiye gaye:
  - `/`, `/login`, `/register` public routes hain.
  - `/dashboard`, `/transactions`, `/analytics`, `/budget`, `/profile` protected routes hain.
- `PublicLayout` un users ke liye hai jo login nahin hue. Agar user already logged in hai to `Navigate` se `/dashboard` pe bheja jata hai.
- `ProtectedLayout` sirf authorized users ke liye hai. Agar user login nahin hua to `Navigate` se `/login` pe redirect hota hai.
- `*` route 404 page dikhata hai.

### 1.4 `client/src/context/AuthContext.jsx`

- `AuthContext` global state container hai.
- `user`, `accessToken`, `loading` state define kiye gaye hain.
- `tokenRef` React ref use karta hai taake latest token interceptors mein bina re-registering access ho.
- `logout` function:
  - `refreshApi.post('/auth/logout')` call karta hai.
  - `user` aur `accessToken` ko null set karta hai.
- `useEffect` mount ke time `setupInterceptors` register karta hai:
  - Request interceptor har request mein `Authorization` header lagata hai agar token ho.
  - Response interceptor `401` par silent refresh karta hai.
- `initAuth` function:
  - `refreshApi.post('/auth/refresh')` se session restore karta hai, jisme cookies use hoti hain.
  - agar refresh mil jaye to token memory mein store hota hai.
  - phir `api.get('/auth/me')` call karke user profile fetch karta hai.
  - agar fail ho jaye to app visitor ko unauthenticated treat karta hai.
- `login` function:
  - `api.post('/auth/login', { email, password })` backend ko request bhejta hai.
  - response mein `accessToken` aur `user` set karta hai.
- `register` function:
  - `api.post('/auth/register', userData)` se naya user banata hai.
- `AuthContext.Provider` tab render hota hai jab `loading` false ho jaye.

### 1.5 `client/src/api/axiosInstance.js`

- `BASE_URL` environment variable se set hota hai ya default `/api/v1`.
- `api` instance main requests ke liye hai, jis par interceptors attach hote hain.
- `refreshApi` separate instance hai, jisme interceptors nahin hain. Yeh refresh request ke liye use hota hai taake infinite 401 loop se bacha ja sake.
- `setupInterceptors`:
  - Request interceptor `Authorization: Bearer <token>` lagata hai.
  - Response interceptor 401 par token refresh karta hai:
    - `refreshApi.post('/auth/refresh')` se new accessToken leta hai.
    - original request phir `api(originalRequest)` se retry hota hai.
    - agar refresh fail ho jaye to logout call hota hai.

### 1.6 `client/src/lib/utils.js`

- `cn` helper class names ko merge karta hai.
- `clsx` aur `tailwind-merge` use karke CSS class combinations ko optimize karte hain.

### 1.7 `client/src/pages/Landing.jsx`

- Landing page ka hero section hai.
- Navbar main login aur register links hain.
- Feature grid inki product capabilities dikhati hai.
- Security section aur about section bhi yahan banaye gaye hain.
- Ye public page hai, backend ya auth calls nahin karta.

### 1.8 `client/src/pages/Login.jsx`

- `email`, `password`, `isLoading` states hain.
- `useAuth` se `login` function liya gaya hai.
- `handleSubmit` form submit handler hai:
  - prevent default kare.
  - `login(email, password)` call kare.
  - success par `/dashboard` pe navigate kare.
  - error par toast error dikhaye.
- Input fields controlled components hain.

### 1.9 `client/src/pages/Register.jsx`

- `formData` state mein name, email, password, confirmPassword store hote hain.
- Password matching validation hoti hai.
- `register` function backend par naya user create karta hai.
- success pe `/login` pe bhejta hai.

### 1.10 `client/src/pages/Dashboard.jsx`

- Dashboard multiple API calls karti hai:
  - `/transactions?limit=5`
  - `/transactions/summary/category`
  - `/transactions/summary/monthly`
  - `/ai/insight/latest`
- `Promise.allSettled` use kiya gaya hai takay ek request fail ho to baki requests bhi chalein.
- `stats` state monthly income/expense balance calculate karti hai.
- `categoryData` donut chart ko bheja jata hai.
- `recentTransactions` dashboard table ke liye hoti hai.
- `AIInsightCard` data aur refresh button show karta hai.
- `AddTransactionModal` show karne ke baad data refresh karta hai.

### 1.11 `client/src/pages/Transactions.jsx`

- `useSearchParams` se URL search parameter support milti hai.
- `filters` state query strings ko manage karta hai.
- `fetchTransactions` `api.get('/transactions', { params })` call karta hai.
- pagination, search, category and type filter apply hota hai.
- `handleDelete` API se delete request bhejta hai.
- `handleEditStart` aur `handleEditSave` edit in-place experience dete hain.
- `AddTransactionModal` se nayi transaction add hone par list refresh hoti hai.

### 1.12 `client/src/pages/Analytics.jsx`

- Data fetch kare:
  - `/transactions/summary/monthly`
  - `/transactions/summary/category`
- Monthly trend line `MonthlyTrendChart` ko feed hota hai.
- Category breakdown `CategoryDonut` ko feed hota hai.
- Summary cards ke liye frontend carta use karta hai.

### 1.13 `client/src/pages/Budget.jsx`

- Budget manager backend se lagaata hai:
  - `/budgets`
  - `/budgets/vs-actual`
  - `/budgets/advisor`
- `updateBudget` `/budgets` ko PUT request bhejta hai.
- `BudgetGauge` component category progress show karta hai.
- AI advice `advice` state mein aata hai.

### 1.14 `client/src/pages/Profile.jsx`

- `useAuth` se current `user` milta hai.
- `profileForm` aur `passwordForm` states profile aur password tabs ke liye hain.
- `api.put('/auth/profile', profileForm)` profile update karta hai.
- `api.put('/auth/change-password', { currentPassword, newPassword })` password change karta hai.
- Tabs: profile info, security, preferences.

### 1.15 Layout and Navigation Components

#### `client/src/components/layout/PublicLayout.jsx`

- Public pages ka wrapper hai.
- agar user authenticated ho to `/dashboard` redirect karta hai.
- `Outlet` child routes render karta hai.

#### `client/src/components/layout/ProtectedLayout.jsx`

- Protected pages ka wrapper hai.
- `loading` state pe spinner dikhta hai.
- `!user` pe `/login` redirect.
- `Sidebar` aur `TopBar` layout components render karta hai.
- mobile sidebar overlay aur open/close state manage karta hai.

#### `client/src/components/layout/Sidebar.jsx`

- sidebar navigation items define karta hai.
- `NavLink` se active state highlight hoti hai.
- logout button `useAuth().logout` call karta hai.

#### `client/src/components/layout/TopBar.jsx`

- top navigation bar aur command palette ke liye complex UI hai.
- `useAuth` se `user` aur `logout` milta hai.
- search modal `cmd/ctrl + K` hotkey se open hota hai.
- transaction search ke liye `api.get('/transactions', { params: { search, limit: 5 } })` call karta hai.
- notifications ke liye `/notifications` API call karta hai.
- `read` aur `readAll` buttons notifications read state update karte hain.
- profile menu aur log out action yahan handle hoti hai.

### 1.16 Shared UI Components

#### `client/src/components/shared/AddTransactionModal.jsx`

- modal form jisme transaction manually add ki ja sakti hai.
- Natural language parsing `api.post('/ai/parse-nl', { text: nlText })` karta hai.
- AI parsing ke baad form fields auto-fill hoti hain.
- `api.post('/transactions', { ...form, amount: Number(form.amount) })` se save karta hai.
- save ke baad `onSuccess()` callback call hota hai.

#### `client/src/components/shared/AIInsightCard.jsx`

- AI insight text show karta hai.
- refresh button se `onRefresh()` call hoti hai.
- jab data load ho raha ho to skeleton display karta hai.

#### `client/src/components/shared/BudgetGauge.jsx`

- category budget bar show karta hai.
- `percent` aur `displayPercent` calculate karta hai.
- color logic budget status ke mutabiq apply hoti hai.
- agar category over budget ho to warning text dikhata hai.

#### `client/src/components/shared/KPICard.jsx`

- dashboard statistics cards render karta hai.
- `CountUp` numbers animate karta hai.
- trend icons aur value labels show karta hai.

#### `client/src/components/shared/DataTable.jsx`

- reusable table component hai.
- columns aur data props se generic table render hota hai.
- edit/view/delete actions buttons render karta hai.

#### `client/src/components/shared/Logo.jsx`

- app ka SVG logo render karta hai.
- simple vector aur gradient design hai.

#### `client/src/components/shared/NLInputBar.jsx`

- natural language input bar ai parse ke liye.
- `api.post('/ai/parse-nl')` call se parsed JSON result return hota hai.
- `onParsed(data.data)` callback se form update ho sakta hai.

### 1.17 Chart Components

#### `client/src/components/charts/CategoryDonut.jsx`

- `recharts` pie chart use karta hai.
- `Pie` component category values render karta hai.
- `Tooltip` aur `Legend` chart details dikhate hain.

#### `client/src/components/charts/MonthlyTrendChart.jsx`

- `recharts` bar chart use karta hai.
- `income` aur `expense` bars monthly trend show karte hain.
- responsive layout desktop aur mobile dono par adjust hota hai.

---

## 2. Backend Flow (Server Side)

### 2.1 `server/src/index.js`

- `dotenv/config` environment variables load karta hai.
- `express` app create karta hai.
- `helmet` security headers set karta hai.
- `cors` configuration local dev aur configured client origins allow karti hai.
- `express.json` request body ko parse karta hai.
- `cookieParser` cookies handle karta hai.
- `morgan('dev')` request logging karta hai.
- `connectDB()` MongoDB se connection banata hai.
- routes mount hoti hain:
  - `/api/v1/auth`
  - `/api/v1/transactions`
  - `/api/v1/budgets`
  - `/api/v1/ai`
  - `/api/v1/notifications`
- `notFound` aur `errorHandler` middleware error handling deti hain.
- server production mein Vercel serverless mode se alag listen kar sakta hai.

### 2.2 `server/src/config/db.js`

- `mongoose.connect(process.env.MONGO_URI)` se MongoDB connect hota hai.
- success pe connected host console mein dikhaya jata hai.
- failure pe process exit ho jati hai.

### 2.3 `server/src/config/gemini.js`

- Google Gemini generative AI client create karta hai.
- `getModel()` function API key verify karta hai.
- `model` proxy object se `generateContent` jaise methods directly call kiye ja sakte hain.

### 2.4 Middleware

#### `server/src/middleware/auth.middleware.js`

- `protect` route guard hai.
- token `Authorization` header ya `accessToken` cookie se nikalta hai.
- `jwt.verify(..., ACCESS_TOKEN_SECRET)` se token validate hota hai.
- user database se `User.findById` fetch hota hai.
- agar token invalid ho to `ApiError(401, 'Unauthorized request')` throw hota hai.
- valid user `req.user` mein attach hota hai.

#### `server/src/middleware/error.middleware.js`

- `errorHandler` errors ko common response format mein convert karta hai.
- agar error `ApiError` na ho to new `ApiError` banaya jata hai.
- `notFound` middleware unknown route ke liye 404 error create karta hai.

#### `server/src/middleware/rateLimit.middleware.js`

- `authLimiter` login attempts ko limit karta hai.
- `apiLimiter` overall API requests ko throttle karta hai.
- `aiLimiter` AI endpoints par request rate control karta hai.

### 2.5 Backend Utilities

#### `server/src/utils/ApiError.js`

- custom error class hai.
- status code, message aur errors attach hotay hain.
- `success` false set hota hai agar status code 400 ya upar ho.

#### `server/src/utils/ApiResponse.js`

- simple response wrapper hai.
- `success` true tab hota hai jab status code 400 se neeche ho.

#### `server/src/utils/asyncHandler.js`

- async controller functions ka wrapper hai.
- Promise rejection catch karke `next(err)` send karta hai.

#### `server/src/utils/tokenUtils.js`

- `generateAccessToken(user)` 15 minute JWT create karta hai.
- `generateRefreshToken(user)` 7 din ka refresh token banata hai.

### 2.6 Backend Models

#### `server/src/models/User.model.js`

- user schema define karta hai:
  - name, email, password, avatar, currency
  - monthlyBudget, isEmailVerified, refreshTokens, notifPrefs
- password save hone se pehle bcrypt se hash hota hai.
- `comparePassword` method password verify karta hai.

#### `server/src/models/Transaction.model.js`

- transaction schema define karta hai:
  - user reference, type, amount, category, merchant, description, date
  - currency, receiptUrl, recurring fields, anomaly flag, deleted soft delete
- compound index `user + deleted + date` query performance ke liye hai.

#### `server/src/models/Budget.model.js`

- monthly budget document per user store karta hai.
- `globalCap`, `categories` aur AI advice cache fields hain.
- month field `YYYY-MM` format mein index hota hai.

#### `server/src/models/Notification.model.js`

- notifications store karta hai:
  - type, title, message, isRead, meta
- TTL index 90 din ke baad auto delete ke liye.

### 2.7 Auth Module

#### `server/src/modules/auth/auth.routes.js`

- authentication routes define karta hai:
  - `POST /register`
  - `POST /login` (rate limited)
  - `POST /logout` (protected)
  - `POST /refresh`
  - `GET /me` (protected)
  - `PUT /profile` (protected)
  - `PUT /change-password` (protected)

#### `server/src/modules/auth/auth.controller.js`

- route handlers frontend ke requests ka response ready karte hain.
- `register`, `login`, `logout`, `refresh`, `getMe`, `updateProfile`, `changePassword` functions hain.
- login response mein `accessToken` body mein aur `accessToken`, `refreshToken` cookies mein bhejte hain.
- logout cookies clear karta hai.

#### `server/src/modules/auth/auth.service.js`

- business logic define karta hai.
- `registerUser` email duplicate check aur user create karta hai.
- `loginUser` email/password verify kar ke access aur refresh tokens generate karta hai.
- `logoutUser` refresh token list se remove karta hai.
- `refreshAccessToken` refresh token validate karke naya access/refresh token pair return karta hai.
- `updateProfile` aur `changePassword` profile updates handle karte hain.
- `generateAccessAndRefereshTokens` user ke refresh tokens array mein naya token push karta hai.

### 2.8 Transaction Module

#### `server/src/modules/transaction/transaction.routes.js`

- `router.use(protect)` se saare transaction endpoints protected hain.
- `POST /` create transaction.
- `GET /` list transactions.
- `DELETE /` bulk remove transactions.
- `GET /summary/monthly` monthly summary.
- `GET /summary/category` category summary.
- `GET /:id`, `PUT /:id`, `DELETE /:id` single transaction operations.

#### `server/src/modules/transaction/transaction.controller.js`

- controllers client response shape banate hain.
- har response `ApiResponse` wrapper mein wrap hoti hai.

#### `server/src/modules/transaction/transaction.service.js`

- transaction logic yahan hoti hai.
- `createTransaction`:
  - budget AI cache clear karta hai.
  - AI auto-categorization karta hai agar category missing ho.
  - transaction create karta hai.
  - anomaly detection asynchronous tarike se run karta hai.
- `checkAnomaly`:
  - last 30 same-category transactions laata hai.
  - mean aur standard deviation calculate karta hai.
  - agar naya transaction mean+2\*std se zyada ho to anomaly flag karta hai.
  - notification create karta hai.
- `getTransactions` filters banata hai:
  - type, category, date range, amount range, search.
  - pagination support.
- `getTransactionById`, `updateTransaction`, `deleteTransaction`, `bulkDeleteTransactions` manage karte hain.
- `getMonthlySummary` aggregate query monthly data return karti hai.
- `getCategorySummary` current month expense by category summary return karti hai.

### 2.9 Budget Module

#### `server/src/modules/budget/budget.routes.js`

- `GET /` current budget fetch.
- `PUT /` update budget.
- `GET /vs-actual` budget vs actual expense report.
- `GET /advisor` AI advice endpoint.

#### `server/src/modules/budget/budget.controller.js`

- `getMyBudget`, `updateMyBudget`, `getVsActual`, `getAdvisor` handle karta hai.
- current month default hai jab query month specify na ho.

#### `server/src/modules/budget/budget.service.js`

- `getBudget` user/month budget document fetch ya create karta hai.
- `updateBudget` upsert karta hai.
- `getBudgetVsActual`:
  - current month expense aggregate karta hai.
  - budget caps ke sath actual spending report generate karta hai.
- `getAIAdvisor`:
  - cached advice agar recent ho to return karta hai.
  - otherwise `aiService.getForecastCommentary` se naya advice banata hai.
  - AI advice cache update karta hai.

### 2.10 AI Module

#### `server/src/modules/ai/ai.routes.js`

- `GET /insight/latest` latest spending insight.
- `POST /insight/refresh` same insight ko refresh karta hai.
- `POST /parse-nl` natural language expense parsing.

#### `server/src/modules/ai/ai.controller.js`

- `getLatestInsight` weekly expense data fetch karta hai:
  - current 7 days aur prior 7 days.
  - `generateWeeklyInsight` AI service se summary banata hai.
- `parseNL` body text validate karta hai aur `parseNLExpense` call karta hai.

#### `server/src/modules/ai/ai.service.js`

- `categoriseExpense` AI prompt chalata hai category decide karne ke liye.
  - agar Gemini fail ho jaye to fallback keyword logic use karta hai.
- `parseNLExpense` natural language se JSON nikalne ki koshish karta hai.
  - agar AI parse fail ho to regex fallback se approximate result return karta hai.
- `generateWeeklyInsight`:
  - AI se user ke weekly spending trends ki insight create karta hai.
  - agar Gemini unavailable ho to rule-based summary generate karta hai.
- `explainAnomaly` anomaly explanation prompt ya fallback text banata hai.
- `getForecastCommentary` budget projection commentary banata hai.

### 2.11 Notification Module

#### `server/src/modules/notification/notification.routes.js`

- `GET /` notifications list karto.
- `PATCH /:id/read` single notification mark read.
- `POST /read-all` sab notifications read mark karta hai.

#### `server/src/modules/notification/notification.controller.js`

- `getAll`:
  - agar user ke notifications nahin hain to starter notifications seed karta hai.
  - response mein data return karta hai.
- `read` specific notification ko update karta hai.
- `readAll` saare unread notifications ko read kar deta hai.

#### `server/src/modules/notification/notification.service.js`

- `createNotification`, `getNotifications`, `markAsRead` database operations handle karte hain.

---

## 3. Frontend-to-Backend Interaction Flow

### 3.1 Login Flow

1. User `/login` page par email/password type karta hai.
2. `Login.jsx` `handleSubmit` mein `login(email, password)` call hota hai.
3. `AuthContext.login` `api.post('/auth/login', { email, password })` bhejta hai.
4. Backend `auth.controller.login` `authService.loginUser` ko call karta hai.
5. `loginUser` user verify karta hai aur `accessToken` + `refreshToken` generate karta hai.
6. Response body mein `accessToken` aur cookies `accessToken`, `refreshToken` set kiye jate hain.
7. Frontend `AuthContext` user state aur accessToken update karta hai.
8. `navigate('/dashboard')` se protected dashboard khulta hai.

### 3.2 Session Restore / Token Refresh

1. App reload pe `AuthProvider` mount hota hai.
2. `refreshApi.post('/auth/refresh')` call hota hai.
3. Backend `auth.controller.refresh` `authService.refreshAccessToken` call karta hai.
4. valid refresh token se naya accessToken aur refreshToken create hotay hain.
5. frontend token state update hota hai.
6. `api.get('/auth/me')` se current user profile load hota hai.
7. agar `api` call 401 return kare to response interceptor refresh sequence chalaega.

### 3.3 Protected Page Access

1. User URL `/dashboard` ya `/transactions` open karta hai.
2. `ProtectedLayout` `useAuth` se `user` check karta hai.
3. agar user null ho to redirect `/login` hota hai.
4. agar user valid ho to `TopBar`, `Sidebar`, aur requested page render hote hain.

### 3.4 Dashboard Data Fetch

1. `Dashboard.jsx` mount hone par `fetchDashboardData` call hota hai.
2. `api.get('/transactions?limit=5')` recent transactions laati hai.
3. `api.get('/transactions/summary/category')` category chart data laata hai.
4. `api.get('/transactions/summary/monthly')` KPI summary laata hai.
5. `api.get('/ai/insight/latest')` AI spending insight laata hai.
6. UI charts aur cards in results se update hote hain.

### 3.5 Transaction Create / Edit / Delete

1. `AddTransactionModal` ya `Transactions.jsx` se create, update, delete requests run hoti hain.
2. Create: `api.post('/transactions', data)`.
3. Update: `api.put('/transactions/:id', body)`.
4. Delete: `api.delete('/transactions/:id')`.
5. `transaction.service` soft delete use karta hai aur budget cache clear karta hai.
6. transaction create par anomaly detection background mein chalti hai.

### 3.6 Budget and AI Advice

1. Budget page `/budgets` GET request data fetch karta hai.
2. budget compare report `/budgets/vs-actual` se actual expense milta hai.
3. AI advisor `/budgets/advisor` se commentary laata hai.
4. budget update `PUT /budgets` call karta hai.

### 3.7 Natural Language Expense Input

1. `AddTransactionModal` mein user text input karta hai.
2. `api.post('/ai/parse-nl', { text: nlText })` call hota hai.
3. backend AI service parse karke JSON response return karta hai.
4. frontend form fields auto-fill hoti hain.

### 3.8 Notifications

1. `TopBar.jsx` mount pe `/notifications` fetch karta hai.
2. unread count UI mein badge show hota hai.
3. `PATCH /notifications/:id/read` single notification read karta hai.
4. `POST /notifications/read-all` sab notifications read mark karta hai.

---

## 4. File-by-file Summary (Front to Back)

### Frontend Files

- `client/src/main.jsx` — React entry point.
- `client/src/App.jsx` — router + auth provider + toast wrapper.
- `client/src/router/AppRouter.jsx` — route definitions.
- `client/src/context/AuthContext.jsx` — auth lifecycle, token refresh, login/register.
- `client/src/api/axiosInstance.js` — axios setup, interceptors, silent refresh.
- `client/src/lib/utils.js` — Tailwind class merge helper.
- `client/src/pages/Landing.jsx` — marketing / public landing page.
- `client/src/pages/Login.jsx` — login form and auth submission.
- `client/src/pages/Register.jsx` — registration form.
- `client/src/pages/Dashboard.jsx` — summary, charts, recent transactions.
- `client/src/pages/Transactions.jsx` — transaction list, filtering, pagination.
- `client/src/pages/Analytics.jsx` — analytics charts and category breakdown.
- `client/src/pages/Budget.jsx` — budget controls, AI advice, budget gauge.
- `client/src/pages/Profile.jsx` — profile, password, preferences.
- `client/src/components/layout/PublicLayout.jsx` — unauthenticated wrapper.
- `client/src/components/layout/ProtectedLayout.jsx` — authenticated layout.
- `client/src/components/layout/Sidebar.jsx` — navigation menu.
- `client/src/components/layout/TopBar.jsx` — search, notifications, profile menu.
- `client/src/components/shared/AddTransactionModal.jsx` — transaction creation with NLP support.
- `client/src/components/shared/AIInsightCard.jsx` — AI insight card.
- `client/src/components/shared/BudgetGauge.jsx` — budget bar visualization.
- `client/src/components/shared/KPICard.jsx` — KPI cards.
- `client/src/components/shared/DataTable.jsx` — reusable table component.
- `client/src/components/shared/Logo.jsx` — app logo SVG.
- `client/src/components/shared/NLInputBar.jsx` — natural language input component.
- `client/src/components/charts/CategoryDonut.jsx` — donut chart component.
- `client/src/components/charts/MonthlyTrendChart.jsx` — trend bar chart.

### Backend Files

- `server/src/index.js` — Express app setup, middleware, route mounting.
- `server/src/config/db.js` — MongoDB connection.
- `server/src/config/gemini.js` — Google Gemini AI model init.
- `server/src/middleware/auth.middleware.js` — protected route guard.
- `server/src/middleware/error.middleware.js` — error and not-found handling.
- `server/src/middleware/rateLimit.middleware.js` — request throttling.
- `server/src/utils/ApiError.js` — custom error class.
- `server/src/utils/ApiResponse.js` — response wrapper.
- `server/src/utils/asyncHandler.js` — async controller wrapper.
- `server/src/utils/tokenUtils.js` — JWT access and refresh token generation.
- `server/src/models/User.model.js` — user schema and password hashing.
- `server/src/models/Transaction.model.js` — transaction schema.
- `server/src/models/Budget.model.js` — budget schema.
- `server/src/models/Notification.model.js` — notification schema.
- `server/src/modules/auth/auth.routes.js` — auth routes.
- `server/src/modules/auth/auth.controller.js` — auth controllers.
- `server/src/modules/auth/auth.service.js` — auth service logic.
- `server/src/modules/transaction/transaction.routes.js` — transaction routes.
- `server/src/modules/transaction/transaction.controller.js` — transaction controllers.
- `server/src/modules/transaction/transaction.service.js` — transaction services.
- `server/src/modules/budget/budget.routes.js` — budget routes.
- `server/src/modules/budget/budget.controller.js` — budget controllers.
- `server/src/modules/budget/budget.service.js` — budget services.
- `server/src/modules/ai/ai.routes.js` — AI routes.
- `server/src/modules/ai/ai.controller.js` — AI controllers.
- `server/src/modules/ai/ai.service.js` — AI service logic.
- `server/src/modules/notification/notification.routes.js` — notification routes.
- `server/src/modules/notification/notification.controller.js` — notification controllers.
- `server/src/modules/notification/notification.service.js` — notification services.

---

## 5. Important Notes

- Frontend session restore aur token refresh dono `AuthContext` aur `axiosInstance` ke cooperation se work karte hain.
- Backend delete operations soft delete use karte hain, physical deletion nahi hoti.
- AI endpoints `protect` middleware ke peechay hain, sirf logged in users ko access milta hai.
- Notifications model auto-expire hota hai 90 din baad.
- `Budget` module her month ke liye user-specific budget document maintain karta hai.

---

## 6. Kaam ka Summary

Ye application ek React frontend aur Express/MongoDB backend use karti hai:

- frontend React Router, protected routes, auth context, toast notifications, charts, and modal forms.
- backend JWT auth, refresh tokens, protected APIs, AI-enhanced categorization and insights, budget analytics, and notifications.
- saari API requests `/api/v1/*` endpoints par jaati hain.
- system design aise hai ke frontend state, server validation, aur session refresh ek doosre se closely integrated hain.

Ye document app ke har main code file ka flow roman Urdu mein explain karta hai.
