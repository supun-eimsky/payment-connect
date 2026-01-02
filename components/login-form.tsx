"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/hooks/useAuth';
import { Bus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
export function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Add your login logic here
        console.log("Login attempt:", { email, password })
        try {
            console.log('🔑 Submitting login...');
            if (isLogin) {
                await login({ email: email, password: password });
            } else {
                //await signup({ name: formData.name, email: formData.email, password: formData.password });
            }
            // Login/signup will handle redirect
        } catch (err) {
            console.log('❌ Error during authentication:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label className="text-sm" htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label className="text-sm" htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && (
                <Alert variant="destructive" className="border-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="ml-2">
                        {error}
                    </AlertDescription>
                </Alert>
            )}
            {/* <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                        Demo: admin@eimsky.com / Password123
                    </div> */}

            <Button type="submit" className="w-full bg-blue-500" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login"}
            </Button>
            <div className="space-y-2 text text-sm">

                <div className="background: var(--theme-foreground, #020618);
  text-sm">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-600 hover:underline text-sm">
                        Sign up
                    </Link>
                </div>
                <div className="background: var(--theme-foreground, #020618);
  text-sm">
                    <Link href="#" >
                        Forgot your password?

                    </Link>
                    <div data-orientation="horizontal"  role="none" data-slot="separator" className="bg-border mt-3 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"></div>
                    
                </div>

            </div>

        </form>

    )
}
