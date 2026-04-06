---
applyTo: "src/**/*.{ts,tsx,astro}"
---

# Clean Architecture Instructions for Static Site (Astro + React)

## Tech Stack

- **Framework**: [Astro](https://astro.build/) — static site generation (`output: "static"`)
- **UI Runtime**: React (via `@astrojs/react` integration) — used as interactive islands
- **Design System**: [Ant Design](https://ant.design/) — themed to the "Analog Terminal" design system (see `DESIGN.md`)
- **No server-side API routes** — this is a fully static site; all data fetching happens in the browser

## The Dependency Rule

Dependencies point inward only. Outer layers depend on inner layers, never the reverse.

**Layers (innermost to outermost):**
1. Entities — Enterprise business rules
2. Use Cases — Application business rules
3. Adapters — Interface converters (gateways, components, hooks)
4. Infrastructure — Astro pages, layouts, composition root

## Directory Structure

```
src/
├── entities/                  # Layer 1: Business domain entities
├── use-cases/                 # Layer 2: Application business rules
├── gateways/                  # Layer 3: External API adapters
├── pages/                     # Layer 4: Astro pages (composition root)
│   └── index.astro            # Each .astro file is a static route
├── layouts/                   # Layer 4: Astro layout components
│   └── BaseLayout.astro       # HTML shell (head, fonts, global styles)
├── components/                # Layer 3: React components (UI adapters)
│   ├── providers/             # Context providers (e.g., AntDProvider)
│   ├── layout/                # Site-wide layout components (Header, Footer)
│   ├── ui/                    # Primitive UI components
│   └── features/              # Feature-specific components
├── hooks/                     # Layer 3: React hooks for data fetching
├── styles/                    # Global CSS (CSS custom properties, resets)
└── lib/                       # Layer 3: Configuration and utilities
```

## Layer 1: Entities

**Location:** `src/entities/`

- MUST NOT import from any other layer
- MUST NOT depend on frameworks or infrastructure
- MUST NOT use non-deterministic or side-effect-producing global APIs (e.g., `crypto.randomUUID()`, `Date.now()`, `Math.random()`)
- MAY use pure, deterministic global APIs (e.g., `Intl.NumberFormat`, `parseInt()`, `JSON.parse()`)
- MUST be plain TypeScript objects/classes with business logic
- MAY contain validation and business rules

```typescript
// src/entities/product.ts
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly inStock: boolean;
}

export function isAvailableForPurchase(product: Product): boolean {
  return product.inStock && product.price > 0;
}

export function formatPrice(product: Product): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);
}
```

**Violations:**
- Importing React, Astro, or any framework
- Importing from `src/use-cases/`, `src/gateways/`, `src/components/`, or `src/lib/`
- HTTP calls or API operations
- Using non-deterministic global APIs like `crypto.randomUUID()`, `Date.now()`, or `Math.random()`

## Layer 2: Use Cases

**Location:** `src/use-cases/`

- MUST only import from entities and ports (interfaces)
- MUST define input/output DTOs
- MUST define ports for external dependencies
- MUST NOT import concrete implementations

```typescript
// src/use-cases/get-products.ts
import type { Product } from '../entities/product';

export interface GetProductsInput {
  category?: string;
  limit?: number;
}

export interface GetProductsOutput {
  products: Product[];
  total: number;
}

// Port - interface for the API gateway
export interface ProductApiGateway {
  fetchProducts(category?: string, limit?: number): Promise<{ products: Product[]; total: number }>;
}

export class GetProductsUseCase {
  constructor(private readonly productApi: ProductApiGateway) {}

  async execute(input: GetProductsInput): Promise<GetProductsOutput> {
    const { products, total } = await this.productApi.fetchProducts(
      input.category,
      input.limit
    );

    return { products, total };
  }
}
```

**Violations:**
- Importing React, Astro, or any framework
- Importing from `gateways/`, `components/`, or `lib/`
- Making HTTP calls directly

## Layer 3: Adapters

**Location:** `src/gateways/`, `src/components/`, `src/hooks/`, and `src/lib/`

### Gateways (External API Adapters)

Gateways call external APIs directly from the browser (no server proxy — this is a static site). Use Zod to validate all external API responses.

```typescript
// src/gateways/product-api-gateway.ts
import { z } from 'zod';
import type { Product } from '@/entities/product';
import type { ProductApiGateway } from '@/use-cases/get-products';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  inStock: z.boolean(),
});

const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
});

export function createProductApiGateway(baseUrl: string): ProductApiGateway {
  return {
    async fetchProducts(
      category?: string,
      limit?: number
    ): Promise<{ products: Product[]; total: number }> {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (limit) params.set('limit', String(limit));

      const response = await fetch(`${baseUrl}/products?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data: unknown = await response.json();
      return ProductsResponseSchema.parse(data);
    },
  };
}
```

### React Hooks (Data Fetching Adapters)

Hooks wire use cases to React components and manage loading/error states. Do **not** add `'use client'` — Astro handles hydration through island directives on the component, not file-level directives.

```typescript
// src/hooks/use-products.ts
import { useState, useEffect } from 'react';
import type { Product } from '@/entities/product';
import type { GetProductsUseCase } from '@/use-cases/get-products';

interface UseProductsDeps {
  getProductsUseCase: GetProductsUseCase;
}

// Factory to create a hook with injected dependencies
export function createUseProductsHook({ getProductsUseCase }: UseProductsDeps) {
  return function useProducts(category?: string) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      setLoading(true);
      getProductsUseCase
        .execute({ category })
        .then(({ products }) => setProducts(products))
        .catch(setError)
        .finally(() => setLoading(false));
    }, [category]);

    return { products, loading, error };
  };
}

// src/hooks/index.ts - Composition root for hooks
import { GetProductsUseCase } from '@/use-cases/get-products';
import { createProductApiGateway } from '@/gateways/product-api-gateway';
import { createUseProductsHook } from './use-products';

const productApi = createProductApiGateway('https://api.example.com');
const getProductsUseCase = new GetProductsUseCase(productApi);

export const useProducts = createUseProductsHook({ getProductsUseCase });
```

### React Components (UI Adapters)

Components receive data as props and focus purely on presentation. They use Ant Design primitives and must be wrapped in `AntDProvider` before rendering. Do **not** use `'use client'` — not applicable in Astro.

```typescript
// src/components/features/product-list.tsx
import { Button, Flex, Typography } from 'antd';
import type { Product } from '@/entities/product';
import { formatPrice, isAvailableForPurchase } from '@/entities/product';

const { Text } = Typography;

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, onAddToCart }: ProductListProps) {
  return (
    <Flex vertical gap={8}>
      {products.map((product) => (
        <Flex key={product.id} justify="space-between" align="center">
          <Text>{product.name}</Text>
          <Text>{formatPrice(product)}</Text>
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!isAvailableForPurchase(product)}
          >
            Add to Cart
          </Button>
        </Flex>
      ))}
    </Flex>
  );
}
```

**Violations:**
- Business logic (validation rules, pricing calculations)
- Domain decisions that should be in entities or use cases
- Direct API calls in components (use hooks instead)
- Using `'use client'` directive (Next.js only — not applicable in Astro)

### Ant Design Theme Provider

All React component trees that use Ant Design MUST be wrapped in `AntDProvider`. The provider lives at `src/components/providers/AntDProvider.tsx` and applies the "Analog Terminal" dark theme from `DESIGN.md`.

```typescript
// src/components/providers/AntDProvider.tsx
import { theme as antdTheme, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

const { darkAlgorithm } = antdTheme;

export function AntDProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={{ algorithm: darkAlgorithm, token: { colorPrimary: '#bdce89', colorBgBase: '#121410' } }}>
      {children}
    </ConfigProvider>
  );
}
```

The root-level page component (e.g., `HomePage`) is responsible for wrapping all its children in `AntDProvider`.

## Layer 4: Infrastructure (Astro Pages & Layouts)

**Location:** `src/pages/` and `src/layouts/`

Astro files (`.astro`) serve as the infrastructure layer. They compose the HTML shell and mount React islands.

### Layouts

Layouts provide the HTML `<head>`, global styles, and font loading. They do not contain React or Ant Design — these belong in component islands.

```astro
---
// src/layouts/BaseLayout.astro
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
}

// biome-ignore lint/correctness/noUnusedVariables: used in Astro HTML template
const { title, description = "Default description." } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Pages (Composition Root)

Pages are the composition root: they import the layout and mount React component islands using Astro's `client:*` directives.

```astro
---
// src/pages/products.astro
// biome-ignore lint/correctness/noUnusedImports: used in Astro HTML template
import BaseLayout from "../layouts/BaseLayout.astro";
// biome-ignore lint/correctness/noUnusedImports: used in Astro HTML template
import { ProductsPage } from "../components/features/ProductsPage";
---

<BaseLayout title="Products">
  <ProductsPage client:only="react" />
</BaseLayout>
```

### Astro Island Directives

Choose the appropriate hydration directive:

| Directive | When to Use |
| --- | --- |
| `client:only="react"` | Component uses Ant Design CSS-in-JS — avoids server-side styling mismatch (default choice) |
| `client:load` | Component has simple styling and benefits from SSR pre-render |
| `client:idle` | Non-critical components that can hydrate during browser idle time |
| `client:visible` | Components below the fold that should hydrate on scroll |

**Default to `client:only="react"`** for any component that uses Ant Design, to avoid flash-of-unstyled-content caused by CSS-in-JS hydration mismatches.

### Why No BFF API Routes

This is a fully static site. There is no server at runtime, so Next.js-style API routes (`/api/...`) do not exist. Gateways call external APIs directly from the browser. If a backend proxy is required in the future, use Astro server endpoints (requires changing `output` to `"hybrid"` or `"server"`).

## Dependency Injection Patterns

### Factory Functions (Preferred)

Factory functions create gateway instances with injected configuration.

```typescript
// ✅ Good - Factory function with dependency injection
export function createProductApiGateway(baseUrl: string): ProductApiGateway {
  return {
    async fetchProducts(category?: string): Promise<{ products: Product[] }> {
      const response = await fetch(`${baseUrl}/products`);
      if (!response.ok) throw new Error(`Failed: ${response.status}`);
      const data: unknown = await response.json();
      return ProductsResponseSchema.parse(data);
    },
  };
}

// ❌ Bad - Hardcoded URL (hard to test)
export const productApiGateway: ProductApiGateway = {
  async fetchProducts(): Promise<{ products: Product[] }> {
    const response = await fetch('https://api.example.com/products');
    return response.json();
  },
};
```

### Constructor Injection for Classes

```typescript
// ✅ Good - Constructor injection
export class GetProductsUseCase {
  constructor(private readonly productApi: ProductApiGateway) {}

  async execute(input: GetProductsInput): Promise<GetProductsOutput> {
    return this.productApi.fetchProducts(input.category);
  }
}
```

## Import Rules Summary

| From | Entities | Use Cases | Gateways/Hooks/Components | Pages/Layouts (Infrastructure) |
| --- | --- | --- | --- | --- |
| Entities | ✓ | ✗ | ✗ | ✗ |
| Use Cases | ✓ | ✓ | ✗ | ✗ |
| Gateways/Hooks/Components | ✓ | ✓ | ✓ | ✗ |
| Pages/Layouts | ✓ | ✓ | ✓ | ✓ |

## Anti-Patterns

**Anemic Domain Model:** Entities as data-only containers with logic in services. Put business rules in entities.

**Leaky Abstractions:** Gateways exposing fetch `Response` objects. Return domain types only.

**Business Logic in Components:** Authorization checks or validation in React components. Move to entities/use cases.

**Direct API Calls in Components:** Components making fetch calls directly. Use hooks or gateways.

**`'use client'` in Astro projects:** This is a Next.js directive. In Astro, interactivity is controlled by `client:*` directives on the island mount point in the `.astro` page, not inside the component file itself.

**Ant Design without AntDProvider:** Rendering Ant Design components outside of `AntDProvider` will produce unstyled output. Always ensure the component tree is wrapped.

**Astro `.astro` variables appearing unused:** Variables declared in an Astro frontmatter (`---`) block and used only in the HTML template section will be flagged as unused by Biome. Suppress with `// biome-ignore lint/correctness/noUnusedVariables: used in Astro HTML template`.

## Code Review Checklist

- Entities have zero imports from other layers
- Use cases define ports for all external dependencies
- Gateways implement ports, call external APIs, and validate responses with Zod
- Hooks wire use cases to React lifecycle (no `'use client'` directive)
- Components use Ant Design primitives and receive data as props
- All React trees using Ant Design are wrapped in `AntDProvider`
- Pages use `client:only="react"` for Ant Design islands
- Layouts contain only HTML structure and global styles — no React or Ant Design
- Use cases are testable with simple mocks (no HTTP)
- CSS for new UI components cross-references `DESIGN.md` surface hierarchy, border, and shadow rules
- Interactive overlays/dialogs implement full accessibility: `aria-modal`, focus trap, focus restore, `inert`, keyboard dismiss
- No empty `catch` blocks — all errors are logged or rethrown
- Focus indicators meet `DESIGN.md` §2 WCAG Compliance requirements (use `primary` color, not `outline-variant`)

