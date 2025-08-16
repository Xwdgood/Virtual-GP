# VirtualGP 全局组件使用说明

## 组件概览

### 1. BrandLogo 组件
位置：`src/components/BrandLogo.tsx`

VirtualGP 的品牌Logo和艺术字组件，包含动画效果。

```tsx
import BrandLogo from "@/components/BrandLogo";

// 基本使用
<BrandLogo />

// 不显示标语
<BrandLogo showTagline={false} />

// 自定义样式
<BrandLogo className="mb-8" />
```

**Props:**
- `showTagline?: boolean` - 是否显示 "anyone, anyplace, any time" 标语（默认：true）
- `className?: string` - 自定义CSS类名

### 2. MobileLayout 组件
位置：`src/components/MobileLayout.tsx`

手机App样式的全局布局组件，提供固定宽度的移动端布局。

```tsx
import MobileLayout from "@/components/MobileLayout";

// 基本使用（包含Logo和标语）
<MobileLayout>
  <div>您的页面内容</div>
</MobileLayout>

// 不显示Logo
<MobileLayout showLogo={false}>
  <div>您的页面内容</div>
</MobileLayout>

// 显示Logo但不显示标语
<MobileLayout showTagline={false}>
  <div>您的页面内容</div>
</MobileLayout>
```

**Props:**
- `children: React.ReactNode` - 页面内容
- `showLogo?: boolean` - 是否显示品牌Logo（默认：true）
- `showTagline?: boolean` - 是否显示标语（默认：true）
- `className?: string` - 自定义CSS类名

## 布局特性

- **固定宽度**: 所有页面保持 `max-w-md` 的移动端宽度
- **居中布局**: 在大屏幕上自动居中显示
- **响应式**: 在小屏幕上自适应宽度
- **统一品牌**: 自动包含VirtualGP品牌元素
- **版权信息**: 底部自动显示版权信息

## 使用示例

### 登录页面
```tsx
import MobileLayout from "@/components/MobileLayout";

export default function LoginPage() {
  return (
    <MobileLayout>
      {/* 登录表单 */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
        {/* 表单内容 */}
      </div>
    </MobileLayout>
  );
}
```

### 仪表板页面
```tsx
import MobileLayout from "@/components/MobileLayout";

export default function DashboardPage() {
  return (
    <MobileLayout showTagline={false}>
      {/* 仪表板内容 */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
        {/* 页面内容 */}
      </div>
    </MobileLayout>
  );
}
```

### 纯内容页面（无Logo）
```tsx
import MobileLayout from "@/components/MobileLayout";

export default function ContentPage() {
  return (
    <MobileLayout showLogo={false}>
      {/* 内容页面 */}
      <div className="space-y-4">
        {/* 页面内容 */}
      </div>
    </MobileLayout>
  );
}
```
