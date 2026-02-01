# Usage Examples

## Constants

```typescript
import { APP_NAME, STATUS, PRIORITY, ROUTES } from '@workspace/common/constants'

console.log(APP_NAME) // 'SearchFIT'
console.log(STATUS.ACTIVE) // 'active'
console.log(ROUTES.DASHBOARD) // '/dashboard'
```

## Utilities

### Formatting

```typescript
import { formatCurrency, formatNumber, formatBytes, truncate } from '@workspace/common/utils'

formatCurrency(1234.56) // '$1,234.56'
formatNumber(1234567) // '1,234,567'
formatBytes(1024) // '1.00 KB'
truncate('This is a long text', 10) // 'This is...'
```

### Validation

```typescript
import { isValidEmail, isValidUrl, isEmpty, parseJSON } from '@workspace/common/utils'

isValidEmail('test@example.com') // true
isValidUrl('https://example.com') // true
isEmpty('') // true
isEmpty([]) // true
parseJSON('{"key": "value"}', {}) // { key: 'value' }
```

### String Manipulation

```typescript
import { slugify, capitalize, toTitleCase, randomString, getInitials } from '@workspace/common/utils'

slugify('Hello World!') // 'hello-world'
capitalize('hello') // 'Hello'
toTitleCase('helloWorld') // 'Hello World'
randomString(10) // 'aB3dE5fG7h'
getInitials('John Doe') // 'JD'
```

## Types

```typescript
import type { 
  Status, 
  Priority, 
  BaseEntity, 
  ApiResponse, 
  PaginatedResponse 
} from '@workspace/common/types'

const status: Status = 'active'
const priority: Priority = 'high'

interface User extends BaseEntity {
  name: string
  email: string
  status: Status
}

const response: ApiResponse<User> = {
  success: true,
  data: {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
```

## Configuration

```typescript
import { getEnv, getEnvBoolean, isDevelopment } from '@workspace/common/config'

const apiUrl = getEnv('API_URL', 'http://localhost:3000')
const debugMode = getEnvBoolean('DEBUG', false)

if (isDevelopment()) {
  console.log('Running in development mode')
}
```

## Complete Example

```typescript
// In your app or package
import { 
  STATUS, 
  ROUTES, 
  formatCurrency, 
  slugify,
  type ApiResponse,
  type BaseEntity 
} from '@workspace/common'

interface Product extends BaseEntity {
  name: string
  price: number
  status: typeof STATUS[keyof typeof STATUS]
}

function createProduct(name: string, price: number): ApiResponse<Product> {
  const slug = slugify(name)
  
  return {
    success: true,
    data: {
      id: '123',
      name,
      price,
      status: STATUS.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    message: `Product created: ${formatCurrency(price)}`
  }
}
```
