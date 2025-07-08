"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CommunityBrowser } from './CommunityBrowser';
import { AlgorithmSharingAPI } from '@/lib/api/algorithmSharingClient';
import { Code, Users } from 'lucide-react';

export const CommunityFloatingButton = () => {
  const [showBrowser, setShowBrowser] = useState(false);

  // Only show if community features are enabled
  if (!AlgorithmSharingAPI.isCommunityEnabled()) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowBrowser(true)}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-full h-14 w-14 p-0"
          title="Browse Community Algorithms"
        >
          <Users className="h-6 w-6" />
        </Button>
      </div>

      {/* Community Browser Modal */}
      <CommunityBrowser
        isOpen={showBrowser}
        onClose={() => setShowBrowser(false)}
      />
    </>
  );
};
