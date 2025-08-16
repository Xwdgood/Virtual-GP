"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/MobileLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    
    // 检查是否同意了条款
    if (!agreedToTerms) {
      setShowTermsError(true);
      return;
    }
    
    // 清除错误状态
    setShowTermsError(false);
    
    // 使用用户数据管理系统验证登录
    if (email && password) {
      // 导入登录函数
      import("@/lib/userData").then(({ loginUser }) => {
        const success = loginUser(email, password);
        if (success) {
          router.push("/dashboard");
        } else {
          alert("Invalid email format");
        }
      }).catch(error => {
        console.error("Login error:", error);
        alert("Login failed");
      });
    }
  };

  return (
    <MobileLayout>

        {/* 登录卡片 */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 邮箱输入 */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white/50"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white/50"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* 隐私条款同意 */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (e.target.checked) {
                      setShowTermsError(false);
                    }
                  }}
                  className={`w-4 h-4 mt-1 text-[#84AE84] border-gray-300 rounded focus:ring-[#84AE84] focus:ring-2 ${
                    showTermsError ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  By ticking this box you are confirming that you have read and agree to our{" "}
                  <button
                    type="button"
                    onClick={() => setShowPolicy(!showPolicy)}
                    className="text-[#84AE84] hover:text-[#6a9d73] underline font-medium transition-colors"
                  >
                    terms and conditions
                  </button>
                  .
                </label>
              </div>

              {/* 错误提示 */}
              {showTermsError && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">You must agree to the terms and conditions to proceed.</p>
                </div>
              )}

              {/* 展开的条款内容 */}
              {showPolicy && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <h4 className="font-semibold text-gray-800 mb-3">Terms and Conditions</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      <strong>1.</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                    <p>
                      <strong>2.</strong> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPolicy(false)}
                    className="mt-3 text-xs text-[#84AE84] hover:text-[#6a9d73] font-medium"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* 记住我 & 忘记密码 */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              className="w-full bg-[#77b080] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6a9d73] focus:ring-2 focus:ring-[#77b080] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>

            {/* 分割线 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

                        {/* 社交登录 */}
                        <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
              
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
              
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="#000000" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
              
              
            </div>
          </form>

          {/* 注册链接 */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Sign up here
            </a>
          </div>
        </div>
    </MobileLayout>
  );
}
