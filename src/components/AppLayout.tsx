
import { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
      <footer className="mt-20 py-6 bg-white/80 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 Apartment Availability Finder</p>
          <p className="mt-1">Data is simulated for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
}
