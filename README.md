# 🎨 LogoLoco

> **AI destekli logo oluşturma SaaS platformu** - Girişimciler ve geliştiriciler için anında profesyonel logolar

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/Hono-4.10-E36002?style=flat-square)](https://hono.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.2-000000?style=flat-square&logo=bun)](https://bun.sh/)

---

## 📖 İçindekiler

- [Hakkında](#-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Proje Yapısı](#-proje-yapısı)
- [API Referansı](#-api-referansı)
- [Environment Variables](#-environment-variables)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

## 🎯 Hakkında

**LogoLoco**, uygulama geliştiricileri ve girişimciler için tasarlanmış, tam özellikli bir **SaaS (Software as a Service)** platformudur. Yapay zeka teknolojisi kullanarak, tasarım becerisi gerektirmeden profesyonel kalitede logolar üretmenizi sağlar.

### Neden LogoLoco?

- 🚀 **Hızlı**: 60 saniyeden kısa sürede logo oluşturun
- 🎨 **Profesyonel**: App Store/Google Play kalitesinde sonuçlar
- 💳 **Kredi Tabanlı**: Esnek, kullandıkça öde modeli
- 🔐 **Güvenli**: Better Auth ile güvenli kimlik doğrulama
- 💰 **Payment Ready**: Polar.sh ile entegre ödeme sistemi
- ⚡ **Modern Stack**: Turborepo monorepo, Next.js 15, Hono, Bun
- 📊 **Tam SaaS**: Kullanıcı yönetimi, kredi sistemi, admin paneli ve daha fazlası

---

## ✨ Özellikler

### 🎨 Logo Oluşturma
- **Basit Form Arayüzü**: Uygulama adı, odak, renk seçimi ile kolay kullanım
- **Çoklu Model Desteği**: 
  - **Nano Banana** - Hızlı ve verimli
  - **Seedream v4** - Yüksek kaliteli görüntüler
  - **Reve Text** - Metin odaklı logolar
- **Toplu Üretim**: Tek seferde 1-4 adet logo oluşturma
- **Gerçek Zamanlı İzleme**: TanStack Query ile polling ve status takibi
- **Renk Önizleme**: Seçtiğiniz renkleri anlık görüntüleme

### 📜 Geçmiş ve Yönetim
- **Logo Geçmişi**: Üretilen tüm logolar veritabanında saklanır
- **Owner-Only Access**: Her kullanıcı sadece kendi geçmişini görür
- **Retention Policy**: 365 gün (yapılandırılabilir) kayıt tutma
- **Pagination**: Limit/offset ile sayfalama desteği
- **Status Tracking**: Success, failed, running, queued durumları

### 💳 Kredi ve Payment Sistemi
- **Kredi Tabanlı**: Her logo çıktısı 1 kredi tüketir (max 4 kredi/request)
- **Signup Bonus**: İlk kayıtta ücretsiz kredi hediyesi
- **Polar.sh Entegrasyonu**: Güvenli ödeme ve kredi paketleri
- **Webhook Support**: Otomatik kredi yüklemeleri
- **Sandbox/Production**: Test ve canlı mod desteği

### 🔐 Kimlik Doğrulama
- **Better Auth**: Modern, güvenli authentication
- **Anonymous Sessions**: Giriş yapmadan deneme
- **Email/Password**: Klasik kimlik doğrulama
- **Session Management**: Güvenli oturum yönetimi
- **Protected Routes**: Auth-required endpoints

### 🛠️ Teknik Özellikler
- **Monorepo Mimari**: Turborepo ile organize kod yapısı
- **Type-Safe**: End-to-end TypeScript güvenliği
- **Database ORM**: Drizzle ORM ile tip-güvenli sorgular
- **API Polling**: Asenkron logo üretimi için otomatik polling
- **Skeleton Loading**: Professional yükleme animasyonları
- **Framer Motion**: Akıcı, performanslı animasyonlar
- **Dark/Light Mode**: Otomatik tema desteği
- **Responsive Design**: Mobil ve masaüstü uyumlu
- **Admin Panel**: `/api/admin/*` yönetim endpoint'leri
- **Security**: SSL, CORS, environment-based konfigürasyon

---

## 🛠️ Teknolojiler

### Monorepo & Build Tools
- **Monorepo**: [Turborepo](https://turbo.build/repo) - İki uygulama (web + api)
- **Package Manager**: [Bun](https://bun.sh/) - Hızlı paket yönetimi
- **Workspaces**: Bun workspaces ile bağımlılık yönetimi

### Frontend (`apps/web`)
- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router + Turbopack)
- **UI Library**: [React 19.2](https://reactjs.org/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) - Polling, caching
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) - Accessible primitives
  - [Lucide React](https://lucide.dev/) - Icons
  - [Shadcn/ui](https://ui.shadcn.com/) - UI components
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

### Backend (`apps/api`)
- **Framework**: [Hono](https://hono.dev/) - Edge-first web framework
- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - TypeScript-first
- **Auth**: [Better Auth](https://better-auth.com/) - Secure authentication
  - Anonymous session plugin
  - Drizzle adapter
- **Payment**: [Polar.sh SDK](https://polar.sh/) - Payment processing
- **Validation**: [Zod](https://zod.dev/) - Schema validation

### Developer Tools
- **Linting**: [ESLint 9](https://eslint.org/)
- **Type Checking**: TypeScript strict mode
- **Database Tools**: Drizzle Kit (migrations, studio)
- **Testing**: [Vitest](https://vitest.dev/) (API unit tests)

---

## 🚀 Kurulum

### Gereksinimler
- **Bun** 1.2.22 veya üzeri ([Kurulum](https://bun.sh/docs/installation))
- **PostgreSQL** 16.x veya üzeri
- **Node.js** 20.x veya üzeri (opsiyonel, Bun kullanılabilir)

### Adım 1: Depoyu Klonlayın
```bash
git clone https://github.com/altudev/eachlabs-ai-logo-maker-saas.git
cd eachlabs-ai-logo-maker-saas
```

### Adım 2: Bağımlılıkları Yükleyin
```bash
bun install
```

Bu komut monorepo'daki tüm bağımlılıkları (web + api) yükleyecektir.

### Adım 3: PostgreSQL Veritabanını Başlatın

**Docker ile (Önerilen):**
```bash
docker run --name logoloco-postgres \
  -p 1453:5432 \
  -e POSTGRES_PASSWORD=123alper123 \
  -e POSTGRES_DB=logoloco \
  -d postgres:16.9-alpine3.22
```

**Veya yerel PostgreSQL:**
```bash
createdb logoloco
```

### Adım 4: Environment Variables'ı Ayarlayın

Kök dizinde `.env.local` dosyası oluşturun:

```bash
# Database
DATABASE_URL="postgresql://postgres:123alper123@localhost:1453/logoloco"
DATABASE_SSL=false

# AI Provider
EACHLABS_API_KEY=your_eachlabs_api_key_here

# API Configuration
PORT=3002
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002

# Authentication
BETTER_AUTH_SECRET=change_this_to_a_random_secret
BETTER_AUTH_URL=http://localhost:3002

# Payment (Polar.sh)
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_SERVER=sandbox
POLAR_CHECKOUT_SUCCESS_URL=http://localhost:3000/checkout/success?checkout_id={CHECKOUT_ID}
POLAR_CHECKOUT_RETURN_URL=http://localhost:3000/account
POLAR_WEBHOOK_SECRET=your_polar_webhook_secret

# Business Logic
SIGNUP_BONUS_CREDITS=10
GENERATION_RETENTION_DAYS=365
ADMIN_EMAILS=admin@example.com

# Database Pool (Opsiyonel)
PGPOOL_MAX=50
PGPOOL_IDLE_MS=30000
PGPOOL_CONN_TIMEOUT_MS=5000
```

> **Not**: `.env.example` dosyasında tüm değişkenlerin şablonları mevcuttur.

### Adım 5: Database Migration
```bash
bun run db:push
```

Bu komut:
- Drizzle schema'yı veritabanına uygular
- Better Auth tablolarını oluşturur
- Gerekli indeksleri ekler

### Adım 6: Geliştirme Sunucularını Başlatın
```bash
bun run dev
```

Bu komut **hem web hem de API** sunucularını başlatır:
- 🌐 Web: [http://localhost:3000](http://localhost:3000)
- 🔌 API: [http://localhost:3002](http://localhost:3002)

**Sadece bir uygulama başlatmak için:**
```bash
# Sadece web
bun run dev -- --filter=web

# Sadece API
bun run dev -- --filter=api
```

---

## 💻 Kullanım

### Komut Satırı Scriptleri

#### Geliştirme
```bash
# Tüm uygulamalar (web + API)
bun run dev

# Sadece web uygulaması
bun run dev -- --filter=web

# Sadece API servisi
bun run dev -- --filter=api
```

#### Build & Production
```bash
# Tüm uygulamaları build et
bun run build

# Production başlat
bun run start

# Sadece web veya API
bun run start -- --filter=web
bun run start -- --filter=api
```

#### Database Yönetimi
```bash
# Schema değişikliklerinden migration oluştur
bun run db:generate

# Migration'ları çalıştır
bun run db:migrate

# Schema'yı direkt veritabanına uygula (dev only)
bun run db:push

# Drizzle Studio GUI'yi aç
bun run db:studio
```

#### Linting & Testing
```bash
# Tüm uygulamalarda lint kontrolü
bun run lint

# API testlerini çalıştır
cd apps/api
bun run test
```

---

## 📁 Proje Yapısı

```
eachlabs-ai-logo-maker-saas/
│
├── apps/                               # Monorepo uygulamaları
│   ├── web/                            # Next.js Frontend (port 3000)
│   │   ├── app/                        # Next.js App Router
│   │   │   ├── (dashboard)/           # Dashboard layout group
│   │   │   ├── (landing)/             # Landing page group
│   │   │   ├── account/               # User account page
│   │   │   ├── checkout/              # Payment pages
│   │   │   ├── history/               # Logo history
│   │   │   └── layout.tsx             # Root layout (providers)
│   │   │
│   │   ├── components/                 # React components
│   │   │   ├── logo-maker.tsx         # Ana logo oluşturucu
│   │   │   ├── landing/               # Landing page sections
│   │   │   ├── providers/             # React context providers
│   │   │   │   ├── query-provider.tsx # TanStack Query setup
│   │   │   │   └── theme-provider.tsx # next-themes provider
│   │   │   └── ui/                    # Shadcn/ui components (70+ dosya)
│   │   │
│   │   ├── hooks/                      # Custom React hooks
│   │   │   ├── use-toast.ts           # Toast notifications
│   │   │   └── use-mobile.ts          # Responsive hooks
│   │   │
│   │   ├── lib/                        # Utilities
│   │   │   ├── utils.ts               # cn() helper
│   │   │   └── auth-client.ts         # Better Auth client
│   │   │
│   │   ├── public/                     # Static assets
│   │   └── package.json                # Web dependencies
│   │
│   └── api/                            # Hono Backend (port 3002)
│       ├── src/
│       │   ├── index.ts                # Hono app entrypoint
│       │   ├── auth.ts                 # Better Auth server instance
│       │   │
│       │   ├── db/                     # Database layer
│       │   │   ├── index.ts           # Pool connection
│       │   │   ├── schemas/           # Drizzle schemas
│       │   │   │   ├── auth.ts        # Better Auth tables
│       │   │   │   ├── credits.ts     # User credits
│       │   │   │   └── generations.ts # Logo generations
│       │   │   ├── migrations/        # SQL migrations
│       │   │   └── seed.ts            # Database seeding
│       │   │
│       │   ├── routes/                 # API endpoints
│       │   │   ├── predictions.ts     # Logo generation API
│       │   │   ├── credits.ts         # Credits API
│       │   │   ├── generations.ts     # History API
│       │   │   ├── webhooks.ts        # Polar webhooks
│       │   │   ├── admin.ts           # Admin endpoints
│       │   │   └── __tests__/         # Route tests
│       │   │
│       │   └── middleware/             # Hono middleware
│       │       └── cors.ts            # CORS configuration
│       │
│       ├── drizzle.config.ts           # Drizzle Kit config
│       └── package.json                # API dependencies
│
├── docs/                               # Dokümantasyon
│   ├── logoloco-PRD.md                # Ürün gereksinimleri
│   ├── api-registry.md                # API referansı
│   ├── AGENTS.md                      # AI agent guidelines
│   ├── turborepo/                     # Monorepo notları
│   ├── better-auth/                   # Auth dokümanları
│   ├── polar-sh/                      # Payment dokümanları
│   ├── tanstack-query/                # Query dokümanları
│   └── ...
│
├── turbo.json                          # Turborepo yapılandırması
├── tsconfig.base.json                  # Paylaşılan TS ayarları
├── package.json                        # Monorepo root scripts
├── bun.lock                            # Lock file
├── .env.example                        # Environment template
├── AGENTS.md                           # Repository guidelines
└── README.md                           # Bu dosya
```

---

## 🔌 API Referansı

**Base URL:** `http://localhost:3002` (geliştirme)

Tüm API endpoint'leri için detaylı dokümantasyon: [`docs/api-registry.md`](docs/api-registry.md)

### Authentication

API, Better Auth kullanır. Tüm korumalı endpoint'ler session cookie gerektirir.

**Anonymous Sessions:** Kullanıcı giriş yapmadan denemeler yapabilir, ancak kredi sistemine katılamaz.

### Logo Oluşturma

**POST** `/api/predictions`

**Auth:** ✅ Gerekli (kayıtlı kullanıcı veya anonymous session)

**Request Body:**
```typescript
{
  appName: string;      // Uygulama adı
  appFocus: string;     // Uygulama odağı/konsepti
  color1: string;       // Ana renk
  color2: string;       // Yardımcı renk
  model: string;        // AI modeli ("nano-banana" | "seedream-v4" | "reve-text")
  outputCount: string;  // Çıktı sayısı ("1" | "2" | "3" | "4")
}
```

**Response:**
```typescript
{
  predictionID: string;     // Takip için ID
  prediction?: unknown;     // Eachlabs yanıtı (debug)
}
```

**Kredi Tüketimi:** `outputCount` kadar kredi düşer (örn: 3 logo = 3 kredi)

---

### Logo Durumu Sorgulama

**GET** `/api/predictions/{predictionID}`

**Auth:** ✅ Gerekli - Sadece logo sahibi erişebilir

**Response:**
```typescript
{
  status: "success" | "failed" | "running" | "queued";
  output?: string[];        // Logo URL'leri (success durumunda)
  error?: string;           // Hata mesajı (failed durumunda)
  [key: string]: unknown;   // Eachlabs raw response
}
```

**Polling:** Client tarafında TanStack Query ile 2 saniye aralıklarla çağrılır.

---

### Logo Geçmişi

**GET** `/api/predictions`

**Auth:** ✅ Gerekli - Kullanıcı kendi geçmişini görür

**Query Parametreleri:**
- `limit` - Sayı limiti (default: 50, max: 100)
- `offset` - Pagination offset (default: 0)

**Response:**
```typescript
{
  history: Array<{
    id: string;
    created_at: string;
    status: string;
    images?: string[];
    app_name: string;
    app_focus: string;
    model: string;
    output_count: number;
  }>;
  pagination: {
    limit: number;
    offset: number;
  };
}
```

**Retention:** `GENERATION_RETENTION_DAYS` (default 365 gün) içindeki kayıtlar döner.

---

### Kredi Yönetimi

**GET** `/api/credits`

**Auth:** ✅ Gerekli

**Response:**
```typescript
{
  balance: number;       // Mevcut kredi bakiyesi
  history: Array<{
    id: string;
    amount: number;      // Pozitif = yükleme, Negatif = harcama
    type: "purchase" | "signup_bonus" | "expense";
    description?: string;
    created_at: string;
  }>;
}
```

---

### Webhook (Polar)

**POST** `/api/webhooks/polar`

**Public endpoint** - Polar.sh tarafından çağrılır

**Events:**
- `checkout.created`
- `checkout.updated`
- `order.created`

Signature doğrulaması yapılır (`POLAR_WEBHOOK_SECRET`).

---

### Admin Endpoints

**GET** `/api/admin/users`  
**GET** `/api/admin/stats`  
**POST** `/api/admin/credits/{userId}`

**Auth:** ✅ Gerekli - Email `ADMIN_EMAILS`'de olmalı

---

## 🔐 Environment Variables

`.env.local` dosyanızda mutlaka ayarlanması gerekenler:

### 🗄️ Database
| Variable | Açıklama | Örnek |
|----------|----------|-------|
| `DATABASE_URL` | PostgreSQL bağlantı string'i | `postgresql://user:pass@host:port/db` |
| `DATABASE_SSL` | SSL bağlantısı (production: `true`) | `false` |

### 🔑 Authentication
| Variable | Açıklama | Örnek |
|----------|----------|-------|
| `BETTER_AUTH_SECRET` | Auth JWT secret (rastgele) | `super-secret-change-me` |
| `BETTER_AUTH_URL` | Auth server URL | `http://localhost:3002` |

### 🔌 API Configuration
| Variable | Açıklama | Örnek |
|----------|----------|-------|
| `PORT` | API port numarası | `3002` |
| `NEXT_PUBLIC_API_BASE_URL` | Web → API URL | `http://localhost:3002` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,http://localhost:3002` |
| `EACHLABS_API_KEY` | Eachlabs AI API key | `your_key_here` |

### 💳 Payment (Polar.sh)
| Variable | Açıklama | Örnek |
|----------|----------|-------|
| `POLAR_ACCESS_TOKEN` | Polar API token | `polar_pat_...` |
| `POLAR_SERVER` | Ortam (`sandbox` veya `production`) | `sandbox` |
| `POLAR_CHECKOUT_SUCCESS_URL` | Ödeme sonrası redirect (placeholder: `{CHECKOUT_ID}`) | `http://localhost:3000/checkout/success?checkout_id={CHECKOUT_ID}` |
| `POLAR_CHECKOUT_RETURN_URL` | İptal/geri dönüş URL | `http://localhost:3000/account` |
| `POLAR_WEBHOOK_SECRET` | Webhook signature secret | `whsec_...` |

### ⚙️ Business Logic
| Variable | Açıklama | Default |
|----------|----------|---------|
| `SIGNUP_BONUS_CREDITS` | İlk kayıtta verilen kredi | `10` |
| `GENERATION_RETENTION_DAYS` | Geçmiş saklama süresi (gün) | `365` |
| `ADMIN_EMAILS` | Admin email listesi (virgülle ayrılmış) | `admin@example.com` |

### 🔧 Database Pool (Opsiyonel)
| Variable | Default |
|----------|---------|
| `PGPOOL_MAX` | `50` |
| `PGPOOL_IDLE_MS` | `30000` |
| `PGPOOL_CONN_TIMEOUT_MS` | `5000` |

---

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! 

### Nasıl Katkıda Bulunulur?

1. **Fork** edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

### Katkı Yönergeleri

- ✅ TypeScript tip güvenliğini koruyun
- ✅ Mevcut kod stilini takip edin (ESLint uyumlu)
- ✅ Değişikliklerinizi test edin
- ✅ [Conventional Commits](https://www.conventionalcommits.org/) kullanın
- ✅ Büyük değişiklikler için önce Issue açın
- ✅ Monorepo yapısına uygun geliştirme yapın
- ✅ [`AGENTS.md`](AGENTS.md) ve [`CLAUDE.md`](CLAUDE.md) rehberlerini inceleyin

### Development Workflow

```bash
# 1. Branch oluştur
git checkout -b feature/my-feature

# 2. Değişiklikleri yap
# ...  

# 3. Lint kontrolü
bun run lint

# 4. Build test
bun run build

# 5. Testleri çalıştır (varsa)
cd apps/api && bun run test

# 6. Commit
git commit -m "feat: My awesome feature"

# 7. Push ve PR
git push origin feature/my-feature
```

---

## 📄 Lisans

Bu proje açık kaynak kodludur ve [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

## 🙏 Teşekkürler

- [Eachlabs](https://eachlabs.ai/) - AI altyapı sağlayıcısı
- [Polar.sh](https://polar.sh/) - Payment infrastructure
- [Vercel](https://vercel.com/) - Hosting ve deployment
- [Turborepo](https://turbo.build/) - Monorepo tools
- [Hono](https://hono.dev/) - Web framework
- [Better Auth](https://better-auth.com/) - Authentication
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe ORM
- [Shadcn/ui](https://ui.shadcn.com/) - UI bileşenleri
- [TanStack Query](https://tanstack.com/query) - Data fetching
- Tüm açık kaynak katkıda bulunanlara ❤️

---

## 📞 İletişim ve Destek

- **Dokümantasyon**: [`docs/`](docs/) klasörünü inceleyin
  - [`AGENTS.md`](AGENTS.md) - Repository guidelines
  - [`docs/api-registry.md`](docs/api-registry.md) - API referansı
  - [`docs/logoloco-PRD.md`](docs/logoloco-PRD.md) - Ürün gereksinimleri
- **Bugs**: [GitHub Issues](https://github.com/altudev/eachlabs-ai-logo-maker-saas/issues) üzerinden bildirin
- **Feature Requests**: Issue açarak önerinizi paylaşın
- **Discussions**: [GitHub Discussions](https://github.com/altudev/eachlabs-ai-logo-maker-saas/discussions) kullanın

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

**Made with ❤️ using AI • Powered by [Eachlabs](https://eachlabs.ai/)**

</div>
