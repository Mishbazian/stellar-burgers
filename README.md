# Stellar Burgers
Проектная работа 11-го спринта курса Фронтенд-разработчик Я.Практикум.

Онлайн-сервис заказа бургеров —  SPA-приложение для просмотра ингредиентов, сборки собственных бургеров, оформления заказов и управления профилем.

## Стек технологий

| Слой | Технологии |
|---|---|
| **Framework** | React 18 + TypeScript |
| **State Management** | Redux Toolkit v2 (`combineSlices`, `createSlice`, `createAsyncThunk`) |
| **Routing** | React Router v6 (BrowserRouter, nested routes, modal overlay routing) |
| **Styling** | CSS Modules (`.module.css`) + [`clsx`](https://github.com/clsx/clsx) для условных классов |
| **Build** | Webpack 5 + Babel |
| **Компоненты UI** | [@zlden/react-developer-burger-ui-components](https://www.npmjs.com/package/@zlden/react-developer-burger-ui-components) |

### Тестирование и качество кода

| Инструмент | Назначение |
|---|---|
| **Jest** + Testing Library | Юнит- и интеграционные тесты (Redux slices, страницы конструктора) |
| **Cypress** | E2E-тесты |
| **ESLint** + Prettier | Линтинг и форматирование |
| **Husky** + **lint-staged** | Pre-commit хуки |
| **Commitizen** | Конвенциональные коммиты (`npm run commit`) |
| **Storybook** | Документация UI-компонентов |

## Архитектура проекта

```
src/
├── index.tsx                 # Точка входа (Provider + BrowserRouter)
├── components/
│   ├── app/                  # Корневой компонент (App) — роутинг, инициализация
│   ├── [domain]/             # Компоненты доменной логики (подключены к Redux)
│   │   ├── app-header/
│   │   ├── burger-constructor/
│   │   ├── burger-ingredient/
│   │   ├── burger-ingredients/
│   │   ├── feed-info/
│   │   ├── ingredient-details/
│   │   ├── ingredients-category/
│   │   ├── modal/
│   │   ├── order-card/
│   │   ├── order-info/
│   │   ├── order-status/
│   │   ├── orders-list/
│   │   └── profile-menu/
│   ├── ui/                   # Презентабельные (UI-only) компоненты + CSS
│   │   └── pages/            # UI-обёртки страниц
│   └── protected-route/      # Auth-guard компонент
├── pages/                    # Страницы-контейнеры (лёгкие)
├── layouts/
│   └── app-layout/           # Layout: AppHeader + Outlet
├── services/
│   ├── store/                # Redux store, typed hooks (useSelector/useDispatch)
│   └── slices/               # Redux Toolkit slices (4 слайса)
└── utils/
    ├── types.ts              # Общие TS-типы (TIngredient, TOrder, TUser ...)
    ├── burger-api.ts         # API-клиент (10+ функций, JWT refresh flow)
    ├── cookie.ts             # getCookie / setCookie / deleteCookie
    ├── helpers.ts            # getRandomId
    └── constants.ts          # UI-константы
```

### Паттерн компонентов

Трёхслойная архитектура: **Pages → Domain Components → UI Components**

- **Pages** (`src/pages/`) — лёгкие контейнеры, принимают `title` + `children`
- **Domain components** (`src/components/`) — бизнес-логика, работа с Redux, dispatch actions
- **UI components** (`src/components/ui/`) — чистое отображение, получают props, никакого стейта

### Роутинг

```
/                          → AppLayout → ConstructorPage  (сборщик бургеров)
/feed                      → Feed         (лента всех заказов)
/feed/:number              → OrderInfo (в модальном окне поверх ленты)
/ingredients/:id           → IngredientDetails (в модальном окне)
/profile                   → ProtectedRoute → Profile    (редактирование профиля)
/profile/orders            → ProfileOrders (история заказов пользователя)
/profile/orders/:number    → OrderInfo (в модальном окне)
/login                     → ProtectedRoute(onlyUnAuth) → Login
/register                  → ProtectedRoute(onlyUnAuth) → Register
/forgot-password           → ForgotPassword
/reset-password            → ResetPassword
/*                         → NotFound404
```

Модальное overlay-роутинг реализован через `location.state.background` — второй `<Routes>` блок рендерит детальную страницу поверх списка.

## Страницы

| Страница | Путь | Описание |
|---|---|---|
| **ConstructorPage** | `/` | Сборка бургера: каталог ингредиентов (слева) + конструктор (справа) |
| **Feed** | `/feed` | Публичная лента всех заказов со статистикой |
| **Profile** | `/profile` | Редактирование данных пользователя |
| **ProfileOrders** | `/profile/orders` | История заказов пользователя |
| **Login** | `/login` | Авторизация |
| **Register** | `/register` | Регистрация |
| **ForgotPassword** | `/forgot-password` | Запрос сброса пароля |
| **ResetPassword** | `/reset-password` | Сброс пароля по токену |
| **NotFound404** | `/*` | Страница 404 |

## Управление состоянием (Redux Toolkit)

| Слайс | Имя в store | Данные | Тёзки/thunks |
|---|---|---|---|
| **ingredientsSlice** | `ingredients` | Список ингредиентов, `isLoading`, `error` | `getIngredients` |
| **burgerConstructorSlice** | `burgerConstructor` | Bun + массив ингредиентов с порядком | `addItem`, `removeItem`, `moveItem`, `clearConstructor` |
| **ordersSlice** | `orders` | Лента заказов, статистика (`total`, `totalToday`), `newOrder`, `userOrders` | `getFeed`, `getOrderByNumber`, `createOrder`, `getUserOrders` |
| **userSlice** | `user` | Данные пользователя, флаги ошибок, `isLoading`, `isInit` | `loginUser`, `registerUser`, `logoutUser`, `updateUser`, `getUser` |

### Авторизация

- **Access token** — хранится в cookie
- **Refresh token** — хранится в `localStorage`
- `fetchWithRefresh` — intercepts 401 responses и автоматически refresh token

## Возможности

- 🍔 Просмотр ингредиентов, сгруппированных по категориям (булочки, основы, соусы) с scroll-spy
- 🛒 Сборка кастомного бургера: добавление, удаление, перемещение ингредиентов
- 📦 Оформление заказа с авторизацией (редирект на `/login` если не авторизован)
- 📋 Публичная лента заказов со статистикой (количество готовых/в процессе)
- 👤 Профиль пользователя: редактирование данных, история заказов
- 🔐 JWT-авторизация: регистрация, вход, сброс/восстановление пароля
- 🪟 Модальные окна для деталей ингредиентов и заказов

## Начало работы

```bash
# 1. Скопировать конфиг окружения
cp .env.example .env

# 2. Установить зависимости
npm install

# 3. Запустить dev-сервер
npm start

# Storybook
npm run storybook

# Тесты
npm test              # Jest
npm run cypress:open  # Cypress UI
```

## Команды

| Команда | Описание |
|---|---|
| `npm start` | Dev-сервер (Webpack) |
| `npm run storybook` | Storybook |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |
| `npm run check` | Линтинг + форматирование |
| `npm run commit` | Конвенциональный коммит (через commitizen) |
| `npm test` / `test:watch` / `test:coverage` | Jest |

## Что было сделано (история изменений)

### 1. Базовая структура и роутинг
- Инициализация проекта, настройка Webpack, TypeScript, CSS Modules
- BrowserRouter и черновик ProtectedRoute
- Разделение логики: App → ConstructorPage

### 2. Redux Store и конструктор бургеров
- Создание `ingredientsSlice` — загрузка ингредиентов с API
- Создание `burgerConstructorSlice` — добавление, удаление, перемещение ингредиентов
- Подключение BurgerIngredients и ConstructorPage к store
- Модальное окно деталей ингредиента

### 3. Страница заказов и статистика
- Создание `ordersSlice` — лента заказов, создание заказа, статистика
- Страница Feed с подсчётом `readyOrders` и `pendingOrders`
- Компонент OrderInfo с деталями заказа
- Clear constructor, move up/down элементов

### 4. Авторизация
- Создание `userSlice` — login, register, logout, update user
- ProtectedRoute с проверкой авторизации и редиректами
- JWT flow: access token в cookie, refresh token в localStorage
- `fetchWithRefresh` — авто-обновление токена при 401
- Инициализация пользователя при рендере App

### 5. Профиль и заказы пользователя
- Страница Profile — редактирование данных пользователя
- ProfileOrders — история заказов пользователя
- OrdersList с сортировкой по дате
- Редирект на `/login` при попытке заказа без авторизации


### 6. Тестирование
- Настройка Jest с Babel и CSS-трансформами
- Настройка Cypress для E2E-тестов
- Юнит-тесты для всех Redux-слайсов (ingredients, constructor, orders, user)
- Тесты async actions (thunks) с утилитой для mock-промптов
- E2E-тесты страницы конструктора и модалок
- Интеграционные тесты добавления ингредиентов и оформления заказа

### 7. DevOps и качество кода
- Husky + lint-staged — автоматический линтинг и форматирование на pre-commit
- Commitizen с conventional-changelog
- ESLint + Prettier конфиги
