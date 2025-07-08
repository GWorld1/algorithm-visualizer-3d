"use client"

import { useState } from 'react';
import { CommunityBrowser } from '@/components/community/CommunityBrowser';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const [showBrowser, setShowBrowser] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Visualizer
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Code className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Community Algorithms
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Community Algorithms
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore algorithms created by the community, learn from different approaches, 
            and import them directly into your visual scripting editor.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Browse & Search</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Filter algorithms by category, difficulty, and search for specific implementations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowLeft className="h-5 w-5 text-green-600 rotate-180" />
              </div>
              <h3 className="font-semibold text-gray-900">One-Click Import</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Import any community algorithm directly into your visual scripting editor.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Code className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Learn & Share</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Like algorithms you find useful and share your own creations with the community.
            </p>
          </div>
        </div>

        {/* Browse Button */}
        <div className="text-center">
          <Button 
            onClick={() => setShowBrowser(true)}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Code className="h-5 w-5 mr-2" />
            Browse Community Algorithms
          </Button>
        </div>
      </div>

      {/* Community Browser Modal */}
      <CommunityBrowser
        isOpen={showBrowser}
        onClose={() => setShowBrowser(false)}
      />
    </div>
  );
}
