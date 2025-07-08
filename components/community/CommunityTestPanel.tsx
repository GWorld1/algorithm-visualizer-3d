"use client"

import { useState } from 'react';
import { useVisualScriptingStore } from '@/store/useVisualScriptingStore';
import { AlgorithmSharingAPI } from '@/lib/api/algorithmSharingClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { 
  Code, 
  Share2, 
  Users, 
  Heart, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

export const CommunityTestPanel = () => {
  const { addToast } = useToast();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  const {
    communityAlgorithms,
    isLoadingCommunity,
    communityError,
    loadCommunityAlgorithms,
    currentAlgorithm,
    nodes,
    connections,
  } = useVisualScriptingStore();

  const isCommunityEnabled = AlgorithmSharingAPI.isCommunityEnabled();

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      // Test the connection by trying to fetch community algorithms
      await loadCommunityAlgorithms({ limit: 1 });
      setConnectionStatus('connected');
      addToast({
        title: 'Connection Successful',
        description: 'Successfully connected to the Algorithm Sharing API',
        type: 'success',
      });
    } catch (error) {
      setConnectionStatus('error');
      addToast({
        title: 'Connection Failed',
        description: `Failed to connect to API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Wifi className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isCommunityEnabled) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="h-5 w-5 text-gray-400" />
            Community Features
          </CardTitle>
          <CardDescription>
            Community features are currently disabled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            <p>To enable community features:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Set <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_ENABLE_COMMUNITY_FEATURES=true</code></li>
              <li>Set <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_API_BASE_URL</code> to your backend URL</li>
              <li>Start the Algorithm Sharing Backend API</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Community Features
        </CardTitle>
        <CardDescription>
          Test and monitor community integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">API Connection</span>
            <Badge className={`${getStatusColor()} border`}>
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </Badge>
          </div>
          
          <Button
            onClick={testConnection}
            disabled={isTestingConnection}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {isTestingConnection ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                Testing...
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Test Connection
              </>
            )}
          </Button>
        </div>

        {/* API Configuration */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Configuration</span>
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              <span className="font-mono bg-gray-100 px-1 rounded">API URL:</span>
              <br />
              <span className="break-all">{AlgorithmSharingAPI.getBaseURL()}</span>
            </div>
            <div>
              <span className="font-mono bg-gray-100 px-1 rounded">User ID:</span> {process.env.NEXT_PUBLIC_DEV_USER_ID}
            </div>
            <div>
              <span className="font-mono bg-gray-100 px-1 rounded">Username:</span> {process.env.NEXT_PUBLIC_DEV_USERNAME}
            </div>
          </div>
        </div>

        {/* Current Algorithm Status */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Current Algorithm</span>
          <div className="text-xs text-gray-600">
            {currentAlgorithm ? (
              <div className="space-y-1">
                <div><strong>Name:</strong> {currentAlgorithm.name}</div>
                <div><strong>Nodes:</strong> {nodes.length}</div>
                <div><strong>Connections:</strong> {connections.length}</div>
                <div><strong>Valid:</strong> {currentAlgorithm.isValid ? '✅' : '❌'}</div>
              </div>
            ) : (
              <div className="text-gray-500">No algorithm loaded</div>
            )}
          </div>
        </div>

        {/* Community Data Status */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Community Data</span>
          <div className="text-xs text-gray-600">
            {isLoadingCommunity ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600" />
                Loading...
              </div>
            ) : communityError ? (
              <div className="text-red-600">Error: {communityError}</div>
            ) : (
              <div className="space-y-1">
                <div><strong>Algorithms:</strong> {communityAlgorithms.length}</div>
                <div><strong>Last Updated:</strong> {new Date().toLocaleTimeString()}</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Quick Actions</span>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => loadCommunityAlgorithms()}
              disabled={isLoadingCommunity}
              variant="outline"
              size="sm"
            >
              <Download className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button
              onClick={() => {
                addToast({
                  title: 'Feature Available',
                  description: 'Use the Share button in the Visual Scripting Editor toolbar',
                  type: 'info',
                });
              }}
              disabled={!currentAlgorithm || nodes.length === 0}
              variant="outline"
              size="sm"
            >
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
