import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { UserProvider } from '@/components/contexts/UserContext';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative flex w-full flex-col">
        <UserProvider>
          <Header />
          <main className="flex-auto">{children}</main>
          <Footer />
        </UserProvider>
      </div>
    </>
  )
}
