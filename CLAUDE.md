# Backoffice Hub Frontend 프로젝트 가이드

## 프로젝트 개요

**Backoffice Hub**는 혜움, 비즈플레이, 홈택스 등 다양한 SaaS 시스템의 데이터를 통합 관리하고, 마감 기반 업무 자동화를 제공하는 통합 ERP 시스템입니다.

### 핵심 기능

- 마감 관리 (캘린더/리스트 뷰, D-day 알림)
- 증빙 체크리스트 관리
- 업무 대시보드 (KPI, 스코어링)
- 외부 시스템 연동 (혜움, 비즈플레이, 홈택스)
- AI 자동화 (문서 분류, 이상 탐지)

### 환경 정보

- **패키지 매니저**: pnpm 10.6.4
- **개발 서버**: `pnpm dev` (Turbopack)
- **주요 브랜치**: `main` (개발), `production` (프로덕션)

---

## 기술 스택

### 핵심

- **Next.js 15.3.8** (App Router) + **React 19** + **TypeScript 5**
- **TailwindCSS 3.4** + **Radix UI** + **shadcn/ui** (new-york)
- **Zustand 5.0** - 글로벌 상태 (devtools + persist + immer)
- **TanStack Query 5.60** - 서버 상태 (staleTime: 5분, gcTime: 30분)
- **Clerk** - 인증

### UI

- **Framer Motion** - 애니메이션
- **Lucide React** - 아이콘
- **Recharts** - 차트

---

## FSD 아키텍처

```
src/
├── app/           # Next.js App Router, API Routes
├── views/         # 페이지 뷰 (widgets/features 조합)
├── widgets/       # 복합 UI 위젯
├── features/      # 비즈니스 로직
├── entities/      # 도메인 모델
└── shared/        # 공통 코드 (api, components, hooks, store)
```

### 의존성 규칙

```
app → views → widgets → features → entities → shared
```

---

## 라우팅 구조

### Route Groups

- `(main)/` - 인증 필요 (AppLayout)
- 나머지 - 인증 불필요 (login)

### 주요 라우트

| 라우트        | 설명           |
| ------------- | -------------- |
| `/dashboard`  | 업무 대시보드  |
| `/deadlines`  | 마감 관리      |
| `/documents`  | 증빙 관리      |
| `/payroll`    | 급여/4대보험   |
| `/expenses`   | 지출/법인카드  |
| `/tax`        | 세무신고       |
| `/reports`    | 보고서         |
| `/settings`   | 설정           |

---

## 상태 관리 전략

| 상태 유형   | 도구              |
| ----------- | ----------------- |
| 로컬 UI     | `useState`        |
| 페이지 공유 | React Context     |
| 글로벌      | Zustand           |
| 서버 상태   | TanStack Query    |
| URL 상태    | `useSearchParams` |

---

## 스타일링

### 규칙

```tsx
// ❌ 인라인/하드코딩
<div style={{ color: "#666" }}>

// ✅ Tailwind + CSS 변수
<div className="text-gray-6">
<Button variant="default">
```

---

## 개발 가이드라인

### 파일 네이밍

- 컴포넌트: PascalCase (`MyComponent.tsx`)
- 훅/유틸: camelCase (`useMyHook.ts`)

### Git 커밋

```
feat: 새 기능
fix: 버그 수정
refactor: 리팩토링
```

### 주요 명령어

```bash
pnpm dev           # 개발 서버
pnpm build         # 빌드
pnpm check-types   # 타입 체크
pnpm lint:fix      # 린트 수정
```

---

## 환경변수

```env
# 필수
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
BACKOFFICE_API_URL=http://localhost:5000
```
