"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUp() {
  const router = useRouter()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')

  const signUp = async () => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      username
    }, {
      onRequest: (ctx) => {
        setIsLoading(true)
      },
      onSuccess: (ctx) => {
        router.push("/dashboard")
      },
      onError: (ctx) => {
        setIsLoading(false)
        setError('خطایی رخ داده است!')
        alert(ctx.error.message);
      },
    });
  };

  return (
    <div className="grid lg:grid-cols-2 h-screen">
      <div className="hidden lg:block relative">
        <Image src="/placeholder.svg?height=1080&width=1920" alt="Login background" layout="fill" objectFit="cover" />
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={signUp}>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>ثبت نام</CardTitle>
              <CardDescription>برای ورود ابتدا باید ثبت نام کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">نام و نام خانوادگی</Label>
                  <Input dir="ltr" id="name" placeholder="" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input dir="ltr" id="email" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">نام کاربری</Label>
                  <Input dir="ltr" id="username" placeholder="" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">رمز عبور</Label>
                  <Input dir="ltr" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'ذخیره ...' : 'ذخیره'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>

  );
}