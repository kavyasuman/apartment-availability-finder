
import { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb')] bg-cover bg-fixed">
      <div className="min-h-screen bg-white/95 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/24001ff3-c1fd-492d-a0c6-6b66c798a352.png" 
              alt="Aikya Homestay"
              className="h-24 object-contain"
            />
          </div>
          {children}
        </div>
        <footer className="mt-20 py-6 bg-white/80 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            <p>© 2025 Aikya Homestay</p>
            <p className="mt-1">Data is simulated for demonstration purposes.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
