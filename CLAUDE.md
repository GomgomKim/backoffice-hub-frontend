# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**Backoffice Hub**는 혜움, 비즈플레이, 홈택스 등 다양한 SaaS 시스템의 데이터를 통합 관리하고, 마감 기반 업무 자동화를 제공하는 통합 ERP 시스템입니다.

## 개발 명령어

```bash
pnpm dev           # 개발 서버 (Turbopack)
pnpm build         # 프로덕션 빌드
pnpm check-types   # 타입 체크
pnpm lint:fix      # 린트 자동 수정
pnpm format        # Prettier 포맷팅
pnpm test          # Vitest 단일 실행
pnpm test:watch    # Vitest 감시 모드
```

## 기술 스택

- **Next.js 15** (App Router) + **React 19** + **TypeScript 5**
- **TailwindCSS 3.4** + **Radix UI** + **shadcn/ui** (new-york 스타일)
- **Zustand 5** - 글로벌 상태 (devtools + persist + immer)
- **TanStack Query 5** - 서버 상태 (staleTime: 5분, gcTime: 30분)
- **Clerk** - 인증
- **Framer Motion** - 애니메이션
- **Lucide React** - 아이콘
- **date-fns** - 날짜 유틸리티

## FSD 아키텍처

```
src/
├── app/           # Next.js App Router, API Routes
├── views/         # 페이지 뷰 (widgets/features 조합)
├── widgets/       # 복합 UI 위젯
├── features/      # 비즈니스 로직 (ui/, hooks/, api/ 구조)
├── entities/      # 도메인 모델
└── shared/        # 공통 코드
    ├── api/       # httpClient, queryClient, QUERY_KEYS
    ├── components/# ui/, layout/, auth/, navigation/
    ├── lib/       # cn(), formatDate(), getDaysUntil() 등
    ├── store/     # appStore, authStore (Zustand)
    └── types/     # 타입 정의
```

### 의존성 규칙 (엄격)

```
app → views → widgets → features → entities → shared
```

상위 레이어는 하위 레이어만 import 가능. 역방향 import 금지.

## 라우팅

### Route Groups
- `(main)/` - 인증 필요 (AppLayout 적용)
- 나머지 - 인증 불필요

### 주요 라우트

| 라우트 | 설명 |
|--------|------|
| `/dashboard` | 업무 대시보드 |
| `/deadlines` | 마감 관리 |
| `/documents` | 증빙 관리 |
| `/payroll` | 급여/4대보험 |
| `/expenses` | 지출/법인카드 |
| `/tax` | 세무신고 |
| `/settings` | 설정 |

## 상태 관리 전략

| 상태 유형 | 도구 |
|-----------|------|
| 로컬 UI | `useState` |
| 페이지 공유 | React Context |
| 글로벌 | Zustand (`appStore`, `authStore`) |
| 서버 상태 | TanStack Query + `QUERY_KEYS` |
| URL 상태 | `useSearchParams` |

### Query Keys 패턴

```ts
import { QUERY_KEYS } from "@/shared/api";

// 사용 예시
QUERY_KEYS.DEADLINES(companyId, { status: 'pending' })
QUERY_KEYS.DOCUMENTS(companyId)
QUERY_KEYS.NOTIFICATIONS(userId)
```

## 스타일링 규칙

```tsx
// ❌ 인라인/하드코딩
<div style={{ color: "#666" }}>

// ✅ Tailwind + CSS 변수
<div className="text-gray-6">
<Button variant="default">
```

- CSS 변수는 `tailwind.config.js`에 정의 (brand, status, priority, deadline 색상)
- 다크모드는 `next-themes` 클래스 기반

## 파일 네이밍

- 컴포넌트: PascalCase (`DeadlineCard.tsx`)
- 훅/유틸: camelCase (`useDeadlines.ts`)

## Import 규칙

```tsx
// ✅ 경로 alias 사용
import { Button } from "@/shared/components/ui/button";
import { useDeadlines } from "@/features/deadline-management";

// ❌ 상대 경로 (레이어 간)
import { Button } from "../../shared/components/ui/button";
```

## Git 커밋 컨벤션

```
feat: 새 기능
fix: 버그 수정
refactor: 리팩토링
```

## 환경변수

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=  # Clerk 공개 키
CLERK_SECRET_KEY=                    # Clerk 비밀 키
BACKOFFICE_API_URL=http://localhost:5000  # 백엔드 API URL
```

API 호출은 Next.js rewrite를 통해 `/api/v1/*` → `${BACKOFFICE_API_URL}/api/v1/*`로 프록시됨.
