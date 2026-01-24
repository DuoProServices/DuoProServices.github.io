import { Shield, X } from 'lucide-react';
import { useState } from 'react';

interface AdminStatusBannerProps {
  userEmail: string;
}

export function AdminStatusBanner({ userEmail }: AdminStatusBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5" />
          <div className="flex items-center gap-2">
            <span className="font-semibold">ADMIN MODE</span>
            <span className="text-purple-100">•</span>
            <span className="text-sm text-purple-100">{userEmail}</span>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
