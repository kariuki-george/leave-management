import AuthProvider from '@/lib/providers/auth.provider';
import Header from '@/components/header/header';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function BusinessLayout({ children }: RootLayoutProps) {
  return (
    <AuthProvider>
      <div className="flex h-fit min-h-screen w-full flex-col">
        <Header />
        <div className="h-full overflow-hidden"> {children}</div>
      </div>
    </AuthProvider>
  );
}
